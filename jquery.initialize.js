/*!
 * https://github.com/adampietrasiak/jquery.initialize
 *
 * Copyright (c) 2015-2016 Adam Pietrasiak
 * Released under the MIT license
 * https://github.com/pie6k/jquery.initialize/blob/master/LICENSE
 *
 * This is based on MutationObserver
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
;(function ($) {

    "use strict";

    // Check if browser supports "matches" function.
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }

    // MutationSelectorObserver represents a selector and it's associated initialization callback.
    var MutationSelectorObserver = function (selector, callback, options) {
        this.selector = selector.trim();
        this.callback = callback;
        this.options = options;
    };

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

            // For each mutation.
            for (var m = 0; m < mutations.length; m++) {

                if (window.jQuery.fn.jquery > '3.7') {
                    // If this is an attributes mutation, then the target is the node upon which the mutation occurred.
                    if (mutations[m].type == 'attributes') {
                        // Check if the mutated node matches.
                        if ($(mutations[m].target).is(msobserver.selector))
                            matches.push($(mutations[m].target));

                        // Find nearby nodes.
                        matches.push($(mutations[m].target.parentElement).find(msobserver.selector));
                    }

                    // If this is an childList mutation, then inspect added nodes.
                    if (mutations[m].type == 'childList') {
                        // Search added nodes for matching selectors.
                        for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                            if (!(mutations[m].addedNodes[n] instanceof Element)) continue;

                            // Check if the added node matches the selector
                            if ($(mutations[m].addedNodes[n]).is(msobserver.selector))
                                matches.push($(mutations[m].addedNodes[n]));

                            // Find nearby nodes.
                            matches.push($(mutations[m].addedNodes[n].parentElement).find(msobserver.selector));
                        }
                    }

                } else {
                    // If this is an attributes mutation, then the target is the node upon which the mutation occurred.
                    if (mutations[m].type == 'attributes') {
                        // Check if the mutated node matchs.
                        if (mutations[m].target.matches(msobserver.selector))
                            matches.push($(mutations[m].target));

                        // Find nearby nodes.
                        matches.push.apply(matches, $.map(mutations[m].target.parentElement.querySelectorAll(msobserver.selector), $));
                    }

                    // If this is an childList mutation, then inspect added nodes.
                    if (mutations[m].type == 'childList') {
                        // Search added nodes for matching selectors.
                        for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                            if (!(mutations[m].addedNodes[n] instanceof Element)) continue;

                            // Check if the added node matches the selector
                            if (mutations[m].addedNodes[n].matches(msobserver.selector))
                                matches.push($(mutations[m].addedNodes[n]));

                            // Find nearby nodes.
                            matches.push.apply(matches, $.map(mutations[m].addedNodes[n].parentElement.querySelectorAll(msobserver.selector), $));
                        }
                    }
                }
            }

            // For each match, call the callback to initialize the element (once only.)
            for (var i = 0; i < matches.length; i++)
                matches[i].each(msobserver.callback);
        });

        // Observe the target element.
        var defaultObeserverOpts = { childList: true, subtree: true, attributes: true };
        observer.observe(options.target, options.observer || defaultObeserverOpts );

        return observer;
    };

    // Supported API
    $.initialize = function (selector, callback, options) {
        return msobservers.initialize(selector, callback, $.extend({}, $.initialize.defaults, options));
    };

    // Options
    $.initialize.defaults = {
        target: document.documentElement, // Defaults to observe the entire document.
        observer: null // MutationObserverInit: Defaults to internal configuration if not provided.
    }

})(jQuery);
