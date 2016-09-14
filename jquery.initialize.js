// @link https://github.com/adampietrasiak/jquery.initialize
// @author Adam Pietrasiak
// @author Damien Bezborodov
;(function($) {
    var MutationSelectorObserver = function(selector, callback) {
        this.selector = selector;
        this.callback = callback;
    }
    var msobservers = [];
    var seen = [];
    msobservers.initialize = function(selector, callback) {
        $(selector).each(callback);
        this.push(new MutationSelectorObserver(selector, callback));
    };
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var j = 0; j < msobservers.length; j++) {
                var callbackOnce = function() {
                    if (seen.indexOf(this) == -1) {
                        seen.push(this);
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
