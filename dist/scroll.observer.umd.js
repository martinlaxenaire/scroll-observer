function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = global || self, factory(global.window = global.window || {}));
})(this, function (exports) {
  'use strict';
  /***
   Lightweight vanilla javascript library to handle intersection observers
   Inspired from past work & and Baptiste Briel work: http://awams.bbriel.me/
   Author: Martin Laxenaire https://www.martin-laxenaire.fr/
   Version: 1.0.0
   ***/

  var ScrollObserver = /*#__PURE__*/function () {
    /***
     If the intersection observer API is available, init our observer
     call the onError callback else
       params (see https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API):
     @root (CSS selector): root intersection observer params, viewport if null
     @rootMargin (string): root margins to use, default to 0 pixel
     @threshold (array): array of thresholds that will trigger the callback function, default to 0
     ***/
    function ScrollObserver(_ref) {
      var _this = this;

      var root = _ref.root,
          _ref$rootMargin = _ref.rootMargin,
          rootMargin = _ref$rootMargin === void 0 ? "0px" : _ref$rootMargin,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? 0 : _ref$threshold;

      _classCallCheck(this, ScrollObserver);

      if (!!window.IntersectionObserver) {
        this.root = document.querySelector(root);

        if (!this.root) {
          this.root = "viewport";
        }

        this.rootMargin = rootMargin;
        this.threshold = threshold; // cache elements to observe

        this.els = [];
        this.observer = new IntersectionObserver(this._callback.bind(this), {
          root: this.root === "viewport" ? null : this.root,
          rootMargin: this.rootMargin,
          threshold: this.threshold
        });
      } else {
        // intersection observer API not supported, trigger onError callback
        setTimeout(function () {
          _this._onErrorCallback && _this._onErrorCallback();
        }, 0);
      }
    }
    /***
     This is our intersection observer callback
     called each time an entry crosses a threshold
     Can call callback functions based on element parameters
     ***/


    _createClass(ScrollObserver, [{
      key: "_callback",
      value: function _callback(entries) {
        var _this2 = this;

        entries.forEach(function (entry, index) {
          // find our entry in our cache elements array
          var cachedEl = _this2.els.find(function (data) {
            return data.el.isSameNode(entry.target);
          });

          if (cachedEl) {
            // if intersection ratio is bigger than the triggerRatio property
            if (entry.intersectionRatio > cachedEl.triggerRatio) {
              // if we should always trigger it or if visibility hasn't been triggered yet
              if (cachedEl.alwaysTrigger || !cachedEl.inView) {
                // apply staggering
                setTimeout(function () {
                  cachedEl.onElVisible && cachedEl.onElVisible(cachedEl);
                  _this2._onElVisibleCallback && _this2._onElVisibleCallback(cachedEl);
                }, index * cachedEl.stagger);
              } // element is now in view


              cachedEl.inView = true;
            } else if (cachedEl.inView && entry.intersectionRatio <= cachedEl.triggerRatio) {
              // if intersection ratio is smaller than our trigger ratio and our element is visible
              // element is no more visible
              cachedEl.inView = false;
              cachedEl.onElHidden && cachedEl.onElHidden(cachedEl);
              _this2._onElHiddenCallback && _this2._onElHiddenCallback(cachedEl); // if we should observe it just once, unobserve it now

              if (!cachedEl.keepObserving) {
                _this2._unobserve(cachedEl);
              }
            } // update its ratio property


            cachedEl.ratio = entry.intersectionRatio; // update its boundingClientRect object

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

    }, {
      key: "observe",
      value: function observe(_ref2) {
        var _ref2$elements = _ref2.elements,
            elements = _ref2$elements === void 0 ? [] : _ref2$elements,
            selector = _ref2.selector,
            _ref2$keepObserving = _ref2.keepObserving,
            keepObserving = _ref2$keepObserving === void 0 ? false : _ref2$keepObserving,
            _ref2$triggerRatio = _ref2.triggerRatio,
            triggerRatio = _ref2$triggerRatio === void 0 ? 0 : _ref2$triggerRatio,
            _ref2$alwaysTrigger = _ref2.alwaysTrigger,
            alwaysTrigger = _ref2$alwaysTrigger === void 0 ? true : _ref2$alwaysTrigger,
            _ref2$stagger = _ref2.stagger,
            stagger = _ref2$stagger === void 0 ? 0 : _ref2$stagger,
            _ref2$onElVisible = _ref2.onElVisible,
            onElVisible = _ref2$onElVisible === void 0 ? function () {} : _ref2$onElVisible,
            _ref2$onElHidden = _ref2.onElHidden,
            onElHidden = _ref2$onElHidden === void 0 ? function () {} : _ref2$onElHidden;
        var els = elements.length ? elements : document.querySelectorAll(selector); // add elements to our els array and start observing them

        for (var i = 0; i < els.length; i++) {
          this.els.push({
            el: els[i],
            // HTML element
            keepObserving: keepObserving,
            triggerRatio: Math.max(0, Math.min(1, triggerRatio)) || 0,
            alwaysTrigger: alwaysTrigger,
            ratio: 0,
            stagger: stagger,
            onElVisible: onElVisible,
            onElHidden: onElHidden,
            inView: false,
            // not in view on init
            boundingClientRect: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }); // observe our HTML element

          this.observer.observe(els[i]);
        }
      }
      /***
       Unobserve a cached element and remove it from our els array
         params:
       @element (object): an element of our els array
       ***/

    }, {
      key: "_unobserve",
      value: function _unobserve(element) {
        // unobserve HTML element
        this.observer.unobserve(element.el); // remove element from our els array

        this.els = this.els.filter(function (data) {
          return !data.el.isSameNode(element.el);
        });
      }
      /***
       Unobserve a cached element by specifying its HTML element property
         params:
       @htmlElement (HTML element): a HTML element to stop watching
       ***/

    }, {
      key: "unobserveEl",
      value: function unobserveEl(htmlElement) {
        // find our HTML element in our array els array and unobserve it
        var cachedEl = this.els.find(function (data) {
          return data.el.isSameNode(htmlElement);
        });

        if (cachedEl) {
          this._unobserve(cachedEl);
        }
      }
      /***
       Unobserve a cached element by specifying its HTML element property
         params:
       @htmlElements (HTML elements): an array of HTML elements to stop watching
       ***/

    }, {
      key: "unobserveEls",
      value: function unobserveEls(htmlElements) {
        for (var i = 0; i < htmlElements.length; i++) {
          this.unobserveEl(htmlElements[i]);
        }
      }
      /***
       Unobserve all elements
       ***/

    }, {
      key: "unobserveAll",
      value: function unobserveAll() {
        this.observer.disconnect(); // reset our els array

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

    }, {
      key: "onError",
      value: function onError(callback) {
        if (callback) {
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

    }, {
      key: "onElVisible",
      value: function onElVisible(callback) {
        if (callback) {
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

    }, {
      key: "onElHidden",
      value: function onElHidden(callback) {
        if (callback) {
          this._onElHiddenCallback = callback;
        }

        return this;
      }
    }]);

    return ScrollObserver;
  }();

  exports.ScrollObserver = ScrollObserver;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
