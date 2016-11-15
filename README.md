# jquery.initialize

jquery.initialize plugin is created to help maintaining dynamically created elementes on page.

It has exacly the same syntax like jQuery $elem.each function. 

The difference is that jQuery elem .each function is called only once on elements that already exists on page right now. 

.initialize function will do what .each function does and then it will call function again on new items matching selector automatically just when they will be created by ajax or pretty much anything you can imagine to add new elements to page.

Simple demo - [click here](http://adampietrasiak.github.io/jquery.initialize/test.html)

---------------------------

TODO: make it `bower` and `npm` compatible, add advanced performance test.

# Example of use
  
  **Initialize has exactly the same syntax as with the .each function**
  
	$(".some-element").initialize( function(){
		$(this).css("color", "blue");
	});
	
  But now if new element matching .some-element selector will appear on page, it will be instantly initialized. The way new item is added is not important, you dont need to care about any callbacks etc.
  
	$("<div/>").addClass('some-element').appendTo("body"); //new element will have blue color!
	

Note that plugin needs to know the selector of items you want to initialize. Thats why you need to **call initialize right after you've created jQuery element from selector.**

	$(".some-element").initialize(myFunc); //will work
	$(".some-element").children().initialize(myFunc); //will NOT work

	

**Support**

Plugin is based on **MutationObserver**. It will works on IE9+ (**read note below**) and every modern browser.

Note: To make it work on IE9 and IE10 you'll need to add MutationObserver polyfill - like ones here: <https://github.com/webcomponents/webcomponentsjs>

-----------------
[Performance test](https://jsfiddle.net/x8vtfxtb/5/) (thanks to **@dbezborodovrp** and **@liuhongbo**)
