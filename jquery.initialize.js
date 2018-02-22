/*!
 * jQuery initialize - v1.0.0 - 12/14/2016
 * https://github.com/adampietrasiak/jquery.initialize
 *
 * Copyright (c) 2015-2016 Adam Pietrasiak
 * Released under the MIT license
 * https://github.com/timpler/jquery.initialize/blob/master/LICENSE
 *
 * This is based on MutationObserver
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
;(function ($) {

    "use strict";

    // List of mutation types that are observable.
    var mtypes = ['childList', 'attributes'];

    // Combinators https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators
    var combinators = [' ', '>', '+', '~'];
    var fraternisers = ['+', '~'];

    function grok(msobserver) {
        if (!$.find.tokenize) {
            // This is an old version of jQuery, so cannot parse the selector.
            // Therefore we must assume the worst case scenario. That is, that
            // this is a complicated selector. This feature was available in:
            // https://github.com/jquery/sizzle/issues/242
            msobserver.isCombinatorial = true;
            msobserver.isFraternal = true;
            return;
        }

        msobserver.isCombinatorial = false;
        msobserver.isFraternal = false;

        // Search for combinators.
        let token = $.find.tokenize(msobserver.selector.trim());
        for (let i = 0; i < token.length; i++) {
            for (let j = 0; j < token[i].length; j++) {
                if (combinators.indexOf(token[i][j].type) != -1)
                    msobserver.isCombinatorial = true;

                if (fraternisers.indexOf(token[i][j].type) != -1)
                    msobserver.isFraternal = true;
            }
        }
    }

    // MutationSelectorObserver represents a selector and it's associated initialization callback.
    var MutationSelectorObserver = function (selector, callback, options) {
        this.selector = selector;
        this.callback = callback;
        this.options = options;

        grok(this);
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
            function push(match) {
                matches.push(match);
            }

            // For each mutation.
            for (var m = 0; m < mutations.length; m++) {

                // Do we observe this mutation type?
                if (mtypes.indexOf(mutations[m].type) == -1) continue;

                // If this is an attributes mutation, then the target is the node upon which the mutation occurred.
                if (mutations[m].type == 'attributes') {
                    // Check if the mutated node matchs.
                    if (mutations[m].target.matches(msobserver.selector))
                        matches.push(mutations[m].target);

                    // If the selector is fraternal, query siblings of the mutated node for matches.
                    if (msobserver.isFraternal)
                        mutations[m].target.parentElement.querySelectorAll(msobserver.selector).forEach(push);

                    // If the selector is combinatorial, query descendants of the mutated node for matches.
                    else if (msobserver.isCombinatorial)
                        mutations[m].target.querySelectorAll(msobserver.selector).forEach(push);
                } else if (mutations[m].type == 'childList') {

                    // Search added nodes for matching selectors.
                    for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                        if (!(mutations[m].addedNodes[n] instanceof Element)) continue;

                        // Check if the added node matches the selector
                        if (mutations[m].addedNodes[n].matches(msobserver.selector))
                            matches.push(mutations[m].addedNodes[n]);

                        // If the selector is fraternal, query siblings for matches.
                        if (msobserver.isFraternal)
                            mutations[m].addedNodes[n].parentElement.querySelectorAll(msobserver.selector).forEach(push);

                        // If the selector is combinatorial, query descendants for matches.
                        else if (msobserver.isCombinatorial)
                            mutations[m].addedNodes[n].querySelectorAll(msobserver.selector).forEach(push);
                    }
                }
            }

            matches.forEach(function(match) {
                $(match).each(msobserver.callback);
            });
        });

        // Observe the target element.
        observer.observe(options.target, options.observer );
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
        target: document.documentElement, // Defaults observe the entire document.
        observer: { childList: true, subtree: true, attributes: true }
    }

})(jQuery);
