**Note from author (pie6k). I've created this lib few years ago and it was nice back then. Now you should propably not be using jQuery for things like that and go with React or something similar. Thank you.**

# jQuery.initialize

Version: 1.3.1, Last updated: 2023-01-31

jQuery.initialize plugin is created to help maintain dynamically created elements on the
page.

## Synopsis

jQuery.initialize will iterate over each element that matches the selector and apply the
callback function. It will then listen for any changes to the Document Object Model (DOM)
and apply the callback function to any new elements inserted into to the document that
match the original selector.

    $.initialize([selector], [callback]);

This allows developers to define an initialization callback that is applied whenever a new
element matching the selector is inserted into the DOM. It works for elements loaded via
AJAX also.

Simple demo - [click here](https://pie6k.github.io/jquery.initialize/test.html)

## Example of use
  
    $.initialize(".some-element", function() {
        $(this).css("color", "blue");
    });
	
But now if new element matching .some-element selector will appear on page, it will be instantly initialized. The way new item is added is not important, you dont need to care about any callbacks etc.
  
    $("<div/>").addClass("some-element").appendTo("body"); //new element will have blue color!

### Unobserving

To cease observation of the document, you may disconnect the observer by calling `disconnect()` on the returned [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) instance which stops it from receiving further notifications until and unless `observe()` is called again.
. E.g.,

    var obs = $.initialize([selector], [callback]); // Returns MutationObserver
    obs.disconnect();

## Options

### `target`

By default, the entire docment is observed for changes. This may result in poor performance. A specific node in the DOM can be observed by specifying a target:

    $.initialize(".some-element", function() {
        $(this).css("color", "blue");
    }, { target: document.getElementById('observe-this-element') });
    
Otherwise, target will default to `document.documentElement`.

### `observer`

A custom [`MutationObserverInit`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#MutationObserverInit) may be provided. If not provided, it will default to internal configuration.

## Browser Compatibility

Plugin is based on **MutationObserver**. It will works on IE9+ (**read note below**) and every modern browser.

Note: To make it work on IE9 and IE10 you'll need to add MutationObserver polyfill - like ones here: <https://github.com/webcomponents/webcomponentsjs>

-----------------
[Performance test](https://jsfiddle.net/x8vtfxtb/5/) (thanks to **@dbezborodovrp** and **@liuhongbo**)

## Todo

 - make it `bower` and `npm` compatible, add advanced performance test.

## Contributors
- Adam Pietrasiak
- Damien Bezborodov
- Michael Hulse
