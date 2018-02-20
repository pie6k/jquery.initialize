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
        $(options.target).find(selector).each(callbackOnce);

        // Then, add it to the list of selector observers.
        var msobserver = new MutationSelectorObserver(selector, callbackOnce, options)
        this.push(msobserver);

        // The MutationObserver watches for when new elements are added to the DOM.
        var observer = new MutationObserver(function (mutations) {

            var matches = [];
            function add(match) {
                matches.push(match);
            }

            // For each mutation.
            for (var m = 0; m < mutations.length; m++) {

                // Do we observe this mutation type?
                if ($.inArray(mutations[m].type, mtypes) == -1) continue;

                if (msobserver.options.scanMode == 'target') {

                    // Search within the observed node for elements matching the selector.
                    // This can take longer, but we are more likely to find a match with
                    // complex selectors.
                    msobserver.options.target.querySelectorAll(msobserver.selector).forEach(add);
                } else if (msobserver.options.scanMode == 'descendants') {

                    // If this is an attributes mutation, then the target is the node upon which the mutation occurred.
                    if (mutations[m].type == 'attributes') {
                        mutations[m].target.querySelectorAll(msobserver.selector).forEach(add);
                        if (mutations[m].target.matches(msobserver.selector)) {
                            matches.push(mutations[m].target);
                        }
                    } else if (mutations[m].type == 'childList') {

                        // Otherwise, search for added nodes.
                        // Search added nodes only for matching selectors.
                        for (var n = 0; n < mutations[m].addedNodes.length; n++) {

                            mutations[m].addedNodes[n].querySelectorAll(msobserver.selector).forEach(add);
                            if (mutations[m].addedNodes[n].matches(msobserver.selector)) {
                                matches.push(mutations[m].addedNodes[n]);
                            }
                        }
                    }
                } else if (msobserver.options.scanMode == 'exact') {

                    // Similar to descendant scan mode, except it will not search within child nodes.
                    // This offers the most performance.
                    if (mutations[m].type == 'attributes') {
                        if (mutations[m].target.matches(msobserver.selector))
                            matches.push(mutations[m].target);
                    } else if (mutations[m].type == 'childList') {
                        for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                            if (mutations[m].addedNodes[n].matches(msobserver.selector))
                                matches.push(mutations[m].addedNodes[n]);
                        }
                    }

                }
            }

            matches.forEach(function(match) {
                $(match).each(msobserver.callback);
            });
        });

        // Observe the target element.
        observer.observe(options.target, {childList: true, subtree: true, attributes: true});
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
        scanMode: 'target', // Can be either: 'target', 'descendants', or 'exact'
        target: document.documentElement // Defaults observe the entire document.
    }

})(jQuery);
