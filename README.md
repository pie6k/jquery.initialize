**Note from author (pie6k). I've created this lib few years ago and it was nice
back then. Now you should probably not be using jQuery for things like that and
go with [React](https://react.dev/) or something similar. Thank you.**
—*2018-11-21*

**Another note (bezborodow). The [Web
Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
suite is now widely adopted natively by most modern browsers as a standardised
feature such that it can now be used efficiently (without the overhead of
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver))
to achieve the same objectives as this library originally intended to
facilitate.** —*2023-05-27*

# jQuery.initialize

Version: 1.4.0, Last updated: 2023-05-37

**`jQuery.initialize`** plugin is created to help maintain dynamically created
elements on the page.

## Synopsis

jQuery.initialize will iterate over each element that matches the selector and
apply the callback function. It will then listen for any changes to the
[Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
and apply the callback function to any new elements inserted into to the
document that match the original selector.

    $.initialize([selector], [callback]);

This allows developers to define an initialisation callback that is applied
whenever a new element matching the selector is inserted into the DOM. It works
for elements loaded via AJAX also.

Simple demo - [click here](https://pie6k.github.io/jquery.initialize/test.html)

## Example of use
  
    $.initialize(".some-element", function() {
        $(this).css("color", "blue");
    });
	
But now if new element matching `.some-element` selector will appear on page,
it will be instantly initialised. The way new item is added is not important,
you do not need to care about any callbacks etc.
  
    $("<div/>").addClass("some-element").appendTo("body"); //new element will have blue color!

### Unobserving

To cease observation of the document, you may disconnect the observer by
calling `disconnect()` on the returned
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
instance which stops it from receiving further notifications until and unless
`observe()` is called again.  . E.g.,

    var obs = $.initialize([selector], [callback]); // Returns MutationObserver
    obs.disconnect();

## Options

### `target`

By default, the entire document is observed for changes. This may result in
poor performance. A specific node in the DOM can be observed by specifying a
target:

    $.initialize(".some-element", function() {
        $(this).css("color", "blue");
    }, { target: document.getElementById('observe-this-element') });
    
Otherwise, target will default to `document.documentElement`.

### `observer`

A custom
[`MutationObserverInit`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#MutationObserverInit)
may be provided. If not provided, it will default to internal configuration.

## Browser Compatibility

Plugin is based on **`MutationObserver`**. It will works on IE9+ (**read note
below**) and every modern browser.

Note: To make it work on IE9 and IE10 you'll need to add MutationObserver
polyfill - like ones here: <https://github.com/webcomponents/webcomponentsjs>

-----------------
[Performance test](https://jsfiddle.net/x8vtfxtb/5/) (thanks to **@bezborodow** and **@liuhongbo**)

## Todo

 - make it `bower` and `npm` compatible, add advanced performance test.

## Contributors
- [Adam Pietrasiak](https://github.com/pie6k)
- [Damien Bezborodov](https://github.com/bezborodow)
- [Michael Hulse](https://github.com/mhulse)
