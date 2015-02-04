# jquery.initialize

jquery.initialize plugin is created to help maintaining dynamically created elementes on page.

It works exacly same way like jQuery $elem.each function. The difference is that jQuery elem .each function handles elements that exist on page right now while .initialize function will also take care of elements created in the future by ajax or pretty much anything you can imagine to add new elements to page.

# Example of use
  
  **Initialize have exacly the same syntax as with .each function**
  
	$(".some-element").initialize( function(){
		$(this).css("color", "blue");
	});
	
  **But now if new element matching .some-element selector will appear on page, it will be instanty initialized. The way new item is added is not important, you dont need to care about any callbacks etc.**
  
	$("<div/>").addClass('some-element').appendTo("body"); //new element will have blue color!
	
	

**Support**
Plugin is based on **MutationObserver**. It will works on IE9+ (**read note below**) and every modern browser.

Note: To make it work on IE9 and IE10 you'll need to add MutationObserver and WeakMap polyfill - like this one <https://github.com/webcomponents/webcomponentsjs>
