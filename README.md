Lightweight vanilla javascript library to handle intersection observers

<h2>Initializing</h2>
    
```javascript
import {ScrollObserver} from './src/scroll.observer.js';

const scrollObserver = new ScrollObserver();
```

In a browser, you can use the UMD files located in the `dist` directory:
    
```html
<script src="dist/scroll.observer.umd.js"></script>
```


```javascript
const scrollObserver = new ScrollObserver();
```

<h3>Parameters</h3>

<h4>Basic params</h4>

The basic parameters you can specify are the same you'd use with an intersection observer (see https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API):

| Parameter  | Type | Default | Description |
| --- | --- | --- | --- |
| root  | CSS selector | "viewport" | Root intersection observer parameter |
| rootMargin | String | "0px" | Root margins to use |
| threshold | array | 0 | Array of thresholds that will trigger the callback function |

```javascript
const scrollObserver = new ScrollObserver({
    // root
    root: document.getElementById("content"),
    // rootMargins
    rootMargin: "20px 0",
    // threshold array
    threshold: [0, 0.25, 0.5, 0.75, 1]
});
```

<h3>Observe elements</h3>

Once you've created an observer, you need to observe elements.

You can add one or multiple elements to observe thanks to the `observe()` method:

```javascript
scrollObserver.observe({
    // elements to observe
    elements: document.querySelectorAll(".scroll-observed-el")
});
```

You can use a CSS selector instead of a list of elements:

```javascript
// exactly the same as above
scrollObserver.observe({
    // elements to observe specified with a selector
    selector: ".scroll-observed-el"
});
```

There are 2 callbacks that you can use when observing an element, `onElVisible()` and `onElHidden`, trigger by the intersection observer based on the `root`, `rootMargin` and `threshold` parameters:

```javascript
scrollObserver.observe({
    // elements to observe
    elements: document.querySelectorAll(".scroll-observed-el"),
    // an ".scroll-observed-el" element became visible
    onElVisible: (observedEl) => {
        // observedEl is an object containing the original HTML element, its bounding rectangle and other properties
        console.log(observedEl);
    },
    // an ".scroll-observed-el" element became hidden
    onElHidden: (observedEl) => {
        // observedEl is an object containing the original HTML element, its bounding rectangle and other properties
        console.log(observedEl);
    },
});
```

<h4>Complete parameter list</h4>

Here is a complete list of all `observe()` method parameters:

| Parameter  | Type | Default | Description |
| --- | --- | --- | --- |
| elements  | array of HTML elements | [] | elements to observe |
| selector | string | null | elements to observe based on a CSS selector |
| keepObserving | bool | false | Whether we should keep observing the element after it has been in and out of view |
| triggerRatio | float between 0 and 1 | 0 | The ratio at which the visible/hidden callback should be called |
| alwaysTrigger | bool | true | Whether it should trigger the visible callback multiple times or just once |
| stagger | float | 0 | Number of milliseconds to wait before calling the visible callback (used for staggering animations) |
| onElVisible | function(observedEl) | void | Function to execute when this element become visible |
| onElHidden | function(observedEl) | void | Function to execute when this element become hidden |


<h3>Unobserve elements</h3>

You can decide to stop observing elements whenever you want.

<h4>Unobserving one element</h4>

You can pass a HTML element to the `unobserveEl()` method:

```javascript
scrollObserver.unobserveEl(document.getElementById("observed-el"));
```

<h4>Unobserving multiple elements</h4>

You can pass an array of elements to the `unobserveEls()` method:

```javascript
scrollObserver.unobserveEls(document.querySelectorAll(".scroll-observed-el"));
```

<h4>Unobserving all elements and disconnect observer</h4>

You can also decide to unobserve all elements and disconnect your observer:

```javascript
scrollObserver.unobserveAll();
```


<h3>Events</h3>

There are 3 events you can use, `onError()`, `onElVisible()` and `onElHidden()`:

```javascript
scrollObserver.onError(() => {
    // intersection observer API is not supported, do something
}).onElVisible((observedEl) => {
    // called each time an observed element become visible
    console.log(observedEl);
}).onElHidden((observedEl) => {
    // called each time an observed element become hidden
    console.log(observedEl);
});
```