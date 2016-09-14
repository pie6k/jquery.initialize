// @link https://github.com/adampietrasiak/jquery.initialize
// @author Adam Pietrasiak
// @author Damien Bezborodov
;(function($) {
    var seen = []; // Tracks elements that have previously been initialized.

    // MutationSelectorObserver represents a selector and it's associated initialization callback.
    var MutationSelectorObserver = function(selector, callback) {
        this.selector = selector;
        this.callback = callback;
    }

    // List of MutationSelectorObservers.
    var msobservers = []; 
    msobservers.initialize = function(selector, callback) {
        // Try to see if the selector matches any elements already on the page.
        $selector = $(selector);
        seen = seen.concat($selector.toArray()); // Mark as seen.
        $selector.each(callback); // Initialize-callback.

        // Then, add it to the list of selector observers.
        this.push(new MutationSelectorObserver(selector, callback));
    };

    // The MutationObserver watches for when new elements are added to the DOM.
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // For each MutationSelectorObserver currently registered.
            for (var j = 0; j < msobservers.length; j++) {
                var callbackOnce = function() {
                    if (seen.indexOf(this) == -1) {
                        seen.push(this);
                        $(this).each(msobservers[j].callback);
                    }
                }

                // Handle DOM node being added.
                if (mutation.type == 'childList') {
                    $(mutation.addedNodes)
                        .find(msobservers[j].selector)
                        .addBack(msobservers[j].selector)
                        .each(callbackOnce);
                }

                // Handle attribute being changed.
                if (mutation.type == 'attributes') {
                    $(mutation.target)
                        .filter(msobservers[j].selector)
                        .each(callbackOnce);
                }
            }
        });
    });

    // Observe the entire document.
    observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

    // Handle .initialize() calls.
    $.fn.initialize = function(callback) {
        msobservers.initialize(this.selector, callback);
    };
})(jQuery);
