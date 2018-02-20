/*!
 * jQuery initialize - v1.0.0 - 12/14/2016
 * https://github.com/adampietrasiak/jquery.initialize
 *
 * Copyright (c) 2015-2016 Adam Pietrasiak
 * Released under the MIT license
 * https://github.com/timpler/jquery.initialize/blob/master/LICENSE
 */
;(function ($) {
    
    "use strict";
    
    // MutationSelectorObserver represents a selector and it's associated initialization callback.
    var MutationSelectorObserver = function (selector, callback, options) {
        this.selector = selector;
        this.callback = callback;
        this.options = options;
    };

    // List of mutation types that are observable.
    var mtypes = ['childList', 'attributes'];

    // List of MutationSelectorObservers.
    var msobservers = [];
    msobservers.initialize = function (selector, callback, options) {
        var target = options.target || document.documentElement;

        // Wrap the callback so that we can ensure that it is only
        // called once per element.
        var seen = [];
        var callbackOnce = function () {
            if (seen.indexOf(this) == -1) {
                seen.push(this);
                $(this).each(callback);
            }
        };

        // See if the selector matches any elements already on the page.
        $(selector).each(callbackOnce);

        // Then, add it to the list of selector observers.
        var msobserver = new MutationSelectorObserver(selector, callbackOnce, options)
        this.push(msobserver);

        // The MutationObserver watches for when new elements are added to the DOM.
        var observer = new MutationObserver(function (mutations) {

            // For each mutation.
            for (var m = 0; m < mutations.length; m++) {
                console.log(mutations[m]);

                // Do we observe this mutation type?
                if ($.inArray(mutations[m].type, mtypes) == -1) continue;

                if (msobserver.options.scanDocument) {

                    // Search within the observed node for elements matching the selector.
                    // This can take longer, but we are more likely to find a match with
                    // complex selectors.
                    $(target).find(msobserver.selector)
                        .each(msobserver.callback);
                } else {

                    // If this is an attributes mutation, then the target is the node upon which the mutation occurred.
                    if (mutations[m].type == 'attributes') {
                        $(mutations[m].target)
                            .find(msobserver.selector) // Find any descendent nodes matching selector
                            .addBack(msobserver.selector) // Include the mutated node itself.
                            .each(msobserver.callback); // initialize with the callback.
                        continue;
                    }

                    // Otherwise, search for added nodes.
                    // Search added nodes only for matching selectors.
                    for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                        $(mutations[m].addedNodes[n])
                            .find(msobserver.selector) // Find any descendent nodes matching selector
                            .addBack(msobserver.selector) // Include the added node itself.
                            .each(msobserver.callback); // initialize with the callback.
                    }
                }
            }
        });

        // Observe the target element.
        observer.observe(target, {childList: true, subtree: true, attributes: true});
    };

    // Deprecated API (does not work with jQuery >= 3.1.1):
    $.fn.initialize = function (callback, options) {
        msobservers.initialize(this.selector, callback, $.extend({}, $.initialize.defaults, options));
    };

    // Supported API
    $.initialize = function (selector, callback, options) {
        msobservers.initialize(selector, callback, $.extend({}, $.initialize.defaults, options));
    };

    $.initialize.defaults = {
        scanDocument: true,
        target: null // Defaults observe the entire document.
    }

})(jQuery);
