// Complete rewrite of adampietrasiak/jquery.initialize
// @link https://github.com/adampietrasiak/jquery.initialize
// @link https://github.com/dbezborodovrp/jquery.initialize
;(function($) {
	var MutationSelectorObserver = function(selector, callback) {
		this.selector = selector;
		this.callback = callback;
	}
	var msobservers = []; 
	msobservers.observe = function(selector, callback) {
		this.push(new MutationSelectorObserver(selector, callback));
	};
	msobservers.initialize = function(selector, callback) {
		$(selector).each(callback);
		this.observe(selector, callback);
	};

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var j = 0; j < msobservers.length; j++) {
				if (mutation.type == 'childList') {
					$(mutation.addedNodes).find(msobservers[j].selector).addBack(msobservers[j].selector).each(msobservers[j].callback);
				}
				if (mutation.type == 'attributes') {
					$(mutation.target).filter(msobservers[j].selector).each(msobservers[j].callback);
				}
			}
		});
	});

	observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

	$.fn.initialize = function(callback) {
		msobservers.initialize(this.selector, callback);
	};
})(jQuery);
