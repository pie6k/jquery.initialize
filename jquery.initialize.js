// Complete rewrite of adampietrasiak/jquery.initialize
// @author Adam Pietrasiak
// @author Damien Bezborodov
// @link https://github.com/dbezborodovrp/jquery.initialize
;(function($) {
    var MutationSelectorObserver = function(selector, callback) {
        this.selector = selector;
        this.callback = callback;
    }
    var msobservers = [];
    msobservers.initialize = function(selector, callback) {
        $(selector).each(callback);
        this.push(new MutationSelectorObserver(selector, callback));
    };
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var j = 0; j < msobservers.length; j++) {
                var callbackOnce = function() {
                    var seen = $(this).data('jquery-initialize-seen');
                    $(this).data('jquery-initialize-seen', 1);
                    if (!seen) {
                        $(this).each(msobservers[j].callback);
                    }
                }

                if (mutation.type == 'childList') {
                    $(mutation.addedNodes).find(msobservers[j].selector).addBack(msobservers[j].selector).each(callbackOnce);
                }
                if (mutation.type == 'attributes') {
                    $(mutation.target).filter(msobservers[j].selector).each(callbackOnce);
                }
            }
        });
    });

    observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

    $.fn.initialize = function(callback) {
        msobservers.initialize(this.selector, callback);
    };
})(jQuery);
