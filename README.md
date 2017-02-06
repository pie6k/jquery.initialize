# jquery.initialize

- **Version:** `1.0.1`
- **Updated:** 02/06/2017
- [Simple demo](http://timpler.github.io/jquery.initialize/test.html)

The [jquery.initialize](jquery.initialize.js) plugin was created to help “maintain” dynamically generated elements.

It uses the same syntax as jQuery’s `$.each(selector, callback)` function. The difference is that `$.each()` callback only fires once, at the time of it’s invocation, on elements that already exists on page. 

Conversely, the `$.initialize(selector, callback)` function behaves like `$.each()`, except it will call `callback` whenever new items matching `selector` appear (e.g. ajax-loaded content, etc.)

## Usage

Enable using this syntax:

```js
$.initialize('.some-selector', function() {
	$(this).css('color', 'blue');
});
```

Now, when a new element matching `.some-selector` appears on the page, it will be **instantly initialized!** You don’t need to worry about how/when new `.some-selector` elements are added, with `$.initialize()` enabled, it does the work for you!

```js
$('<div />')
	.addClass('some-selector')
	.appendTo('body'); // Element will be colored blue!
```

## Browser support

This plugin is based on [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) and will work in every modern browser.

To make this plugin work in IE9 and IE10 you’ll need to add a `MutationObserver` polyfill, like the ones found here: [@webcomponents / webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)

## Perfomance test

[See here](https://jsfiddle.net/x8vtfxtb/5/) (thanks to **@dbezborodovrp** and **@liuhongbo**)

## Todo

- Bower compatible
- npm compatible

## Contributors

- Adam Pietrasiak ([@timpler](https://github.com/timpler))
- Damien Bezborodov
- Ninos Ego ([@Ninos](https://github.com/Ninos))
