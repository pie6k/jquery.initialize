# jquery.initialize

Version: 1.1.0, Last updated: 2017-02-06

jquery.initialize plugin is created to help maintaining dynamically created elementes on page.

It has exacly the same syntax like jQuery $elem.each function. 

The difference is that jQuery elem .each function is called only once on elements that already exists on page right now. 

.initialize function will do what .each function does and then it will call function again on new items matching selector automatically just when they will be created by ajax or pretty much anything you can imagine to add new elements to page.

Simple demo - [click here](http://adampietrasiak.github.io/jquery.initialize/test.html)

---------------------------

TODO: make it `bower` and `npm` compatible, add advanced performance test.

# Example of use
  
  **Initialize has exactly the same syntax as with the .each function**
  
	$.initialize(".some-element", function() {
		$(this).css("color", "blue");
	});
	
  But now if new element matching .some-element selector will appear on page, it will be instantly initialized. The way new item is added is not important, you dont need to care about any callbacks etc.
  
	$("<div/>").addClass("some-element").appendTo("body"); //new element will have blue color!

**Support**

Plugin is based on **MutationObserver**. It will works on IE9+ (**read note below**) and every modern browser.

Note: To make it work on IE9 and IE10 you'll need to add MutationObserver polyfill - like ones here: <https://github.com/webcomponents/webcomponentsjs>

-----------------
[Performance test](https://jsfiddle.net/x8vtfxtb/5/) (thanks to **@dbezborodovrp** and **@liuhongbo**)

# Contributors
- Adam Pietrasiak
- Damien Bezborodov
- Ninos Ego
- Michael Hulse
