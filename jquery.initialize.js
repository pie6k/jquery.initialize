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
    var MutationSelectorObserver = function (selector, callback) {
        this.selector = selector;
        this.callback = callback;
    };

    // List of MutationSelectorObservers.
    var msobservers = [];
    msobservers.initialize = function (selector, callback) {

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
        this.push(new MutationSelectorObserver(selector, callbackOnce));
    };

    msobservers.deInitialize = function(selectors) {

      /*
       * func for removing matching MutationSelectorObservers:
       *
       *    - all if var selectors is undefined, ex $.deInitialize();
       *
       *    - single selector if var selectors is a string,
       *       ex    $.deInitialize('.my-class');
       *
       *    - matching selectors if var selectors is an array,
       *       ex    var array = ['.my-class-one', '.my-class-2'];
       *             $.deInitialize(array);
       */

      for (var i = 0; i < msobservers.length; i++) {

         var match = true;

         if (typeof msobservers[i] == 'object') {

            if (selectors !== undefined) {
               // array of selectors
               if ($.isArray(selectors)) {
                  if ($.inArray(msobservers[i].selector, selectors) == -1) {
                     match = false;
                  }
               }
               // single selector, type 'string'
               else if (msobservers[i].selector !== selectors) {
                  match = false;
               }
            }

            if (match) {
               msobservers.splice(i,1);
               i--;
            }
         }
      }
   };


    // The MutationObserver watches for when new elements are added to the DOM.
    var observer = new MutationObserver(function (mutations) {

        // For each MutationSelectorObserver currently registered.
        for (var j = 0; j < msobservers.length; j++) {
            $(msobservers[j].selector).each(msobservers[j].callback);
        }

    });

    // Observe the entire document.
    observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

    // Deprecated API (does not work with jQuery >= 3.1.1):
    $.fn.initialize = function (callback) {
        msobservers.initialize(this.selector, callback);
    };
    $.initialize = function (selector, callback) {
        msobservers.initialize(selector, callback);
    };
    // unregister MutationSelectorObservers
    $.deInitialize = function(selectors) {
      msobservers.deInitialize(selectors);
   };

})(jQuery);
