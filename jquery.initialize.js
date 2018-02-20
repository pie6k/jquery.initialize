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
        $(selector).each(callbackOnce);

        // Then, add it to the list of selector observers.
        this.push(new MutationSelectorObserver(selector, callbackOnce, options));
    };

    // The MutationObserver watches for when new elements are added to the DOM.
    var observer = new MutationObserver(function (mutations) {

        // For each MutationSelectorObserver currently registered.
        for (var j = 0; j < msobservers.length; j++) {
            if (msobservers[j].options.scanDocument) {

                // Scan the entire document.
                $(msobservers[j].selector)
                    .each(msobservers[j].callback);
            } else {

                // For each mutation.
                for (var m = 0; m < mutations.length; m++) {
                    // If mutation type is observed.
                    if ($.inArray(mutations[m].type, mtypes) != -1) {
                        for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                            $(mutations[m].addedNodes[n]).find(msobservers[j].selector)
                                .addBack(msobservers[j].selector)
                                .each(msobservers[j].callback);
                        }
                    }
                }
            }
        }
    });

    // Observe the entire document.
    observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

    // Deprecated API (does not work with jQuery >= 3.1.1):
    $.fn.initialize = function (callback, options) {
        msobservers.initialize(this.selector, callback, $.extend({}, $.initialize.defaults, options));
    };

    // Supported API
    $.initialize = function (selector, callback, options) {
        msobservers.initialize(selector, callback, $.extend({}, $.initialize.defaults, options));
    };

    $.initialize.defaults = {
        scanDocument: true
    }

})(jQuery);
