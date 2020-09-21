/***
 Lightweight vanilla javascript library to handle intersection observers
 Inspired from past work & and Baptiste Briel work: http://awams.bbriel.me/
 Author: Martin Laxenaire https://www.martin-laxenaire.fr/
 Version: 1.0.0
 ***/

'use strict';

export class ScrollObserver {

    /***
     If the intersection observer API is available, init our observer
     call the onError callback else

     params (see https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API):
     @root (CSS selector): root intersection observer params, viewport if null
     @rootMargin (string): root margins to use, default to 0 pixel
     @threshold (array): array of thresholds that will trigger the callback function, default to 0
     ***/
    constructor({
                    root,
                    rootMargin = "0px",
                    threshold = 0
                }) {
        if(!!window.IntersectionObserver) {

            this.root = document.querySelector(root);
            if(!this.root) {
                this.root = "viewport";
            }

            this.rootMargin = rootMargin;
            this.threshold = threshold;

            // cache elements to observe
            this.els = [];

            this.observer = new IntersectionObserver(this._callback.bind(this), {
                root: this.root === "viewport" ? null : this.root,
                rootMargin: this.rootMargin,
                threshold: this.threshold,
            });
        }
        else {
            // intersection observer API not supported, trigger onError callback
            setTimeout(() => {
                this._onErrorCallback && this._onErrorCallback();
            }, 0);
        }
    }


    /***
     This is our intersection observer callback
     called each time an entry crosses a threshold
     Can call callback functions based on element parameters
     ***/
    _callback(entries) {
        entries.forEach((entry, index) => {
            // find our entry in our cache elements array
            const cachedEl = this.els.find(data => data.el === entry.target);

            if(cachedEl) {
                // if intersection ratio is bigger than the triggerRatio property
                if(entry.intersectionRatio > cachedEl.triggerRatio) {
                    // if we should always trigger it or if visibility hasn't been triggered yet
                    if(cachedEl.alwaysTrigger || !cachedEl.inView) {
                        // apply staggering
                        setTimeout(() => {
                            cachedEl.onElVisible && cachedEl.onElVisible(cachedEl);
                            this._onElVisibleCallback && this._onElVisibleCallback(cachedEl);
                        }, index * cachedEl.stagger);
                    }

                    // element is now in view
                    cachedEl.inView = true;
                }
                else if(cachedEl.inView && entry.intersectionRatio <= cachedEl.triggerRatio) {
                    // if intersection ratio is smaller than our trigger ratio and our element is visible

                    // element is no more visible
                    cachedEl.inView = false;
                    cachedEl.onElHidden && cachedEl.onElHidden(cachedEl);
                    this._onElHiddenCallback && this._onElHiddenCallback(cachedEl);

                    // if we should observe it just once, unobserve it now
                    if(!cachedEl.keepObserving) {
                        this._unobserve(cachedEl);
                    }
                }

                // update its ratio property
                cachedEl.ratio = entry.intersectionRatio;
                // update its boundingClientRect object
                cachedEl.boundingClientRect = entry.boundingClientRect;
            }
        });
    }


    /***
     Start observing a set of elements

     params:
     @elements (array of HTML elements): elements to observe
     @selector (CSS selector): elements to query based on a CSS selector
     @keepObserving (bool): whether we should keep observing the element after it has been in and out of view, default to false
     @triggerRatio (float between 0 and 1): the ratio at which the visible/hidden callback should be called, default to 0
     @alwaysTrigger (bool): whether it should trigger the visible callback multiple times or just once, default to true
     @stagger (int): number of milliseconds to wait before calling the visible callback (used for staggering animations), default to 0
     ***/
    observe({
                elements = [],
                selector,
                keepObserving = false,
                triggerRatio = 0,
                alwaysTrigger = true,

                stagger = 0,
                onElVisible = () => {},
                onElHidden = () => {},
            }) {
        const els = elements.length ? elements : document.querySelectorAll(selector);

        // add elements to our els array and start observing them
        for(let i = 0; i < els.length; i++) {
            this.els.push({
                el: els[i], // HTML element
                keepObserving: keepObserving,
                triggerRatio: Math.max(0, Math.min(1, triggerRatio)) || 0,
                alwaysTrigger: alwaysTrigger,
                ratio: 0,
                stagger: stagger,
                onElVisible: onElVisible,
                onElHidden: onElHidden,
                inView: false, // not in view on init
                boundingClientRect: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            });
            // observe our HTML element
            this.observer.observe(els[i]);
        }
    }


    /***
     Unobserve a cached element and remove it from our els array

     params:
     @element (object): an element of our els array
     ***/
    _unobserve(element) {
        // unobserve HTML element
        this.observer.unobserve(element.el);

        // remove element from our els array
        this.els = this.els.filter(data => data.el.isEqualNode(element.el));
    }


    /***
     Unobserve a cached element by specifying its HTML element property

     params:
     @htmlElement (HTML element): a HTML element to stop watching
     ***/
    unobserveEl(htmlElement) {
        // find our HTML element in our array els array and unobserve it
        const cachedEl = this.els.find(data => data.el === htmlElement);
        if(cachedEl) {
            this._unobserve(cachedEl);
        }
    }


    /***
     Unobserve a cached element by specifying its HTML element property

     params:
     @htmlElements (HTML elements): an array of HTML elements to stop watching
     ***/
    unobserveEls(htmlElements) {
        for(let i = 0; i < htmlElements.length; i++) {
            this.unobserveEl(htmlElements[i]);
        }
    }


    /***
     Unobserve all elements
     ***/
    unobserveAll() {
        this.observer.disconnect();

        // reset our els array
        this.els = [];
    }



    /*** EVENTS ***/

    /***
     This is called if the intersection observer API not supported

     params:
     @callback (function): a function to execute

     returns:
     @this: our ScrollObserver element to handle chaining
     ***/
    onError(callback) {
        if(callback) {
            this._onErrorCallback = callback;
        }

        return this;
    }


    /***
     This is called when an element state switches from hidden to visible

     params:
     @callback (function): a function to execute

     returns:
     @this: our ScrollObserver element to handle chaining
     ***/
    onElVisible(callback) {
        if(callback) {
            this._onElVisibleCallback = callback;
        }

        return this;
    }


    /***
     This is called when an element state switches from visible to hidden

     params:
     @callback (function): a function to execute

     returns:
     @this: our ScrollObserver element to handle chaining
     ***/
    onElHidden(callback) {
        if(callback) {
            this._onElHiddenCallback = callback;
        }

        return this;
    }
}