//jquery.initialize plugin by Adam Pietrasiak ( https://github.com/AdamPietrasiak/jquery.initialize )

;(function($) {

	$.fn.initialize = function(init, firstInit) {
		var $t = this; //reference for deeper functions
		var selector = $t.selector; //get called selector for inits in future

		if ( typeof init !== "function" || !selector ) return $($t); //if no initialization function, no sense to continue

		// select the target node to observe
		var target = $('body')[0];

		$t.firstInitsCalled = $t.firstInitsCalled || []; //we need to collect info about firstInits that can be called only once

		//if proper firstInit and was never called before
		if ( typeof firstInit == "function" && $t.firstInitsCalled.indexOf(firstInit) == -1 ) {
			$t.firstInitsCalled.push(firstInit); //add to called list
			firstInit(); //call
		}


		$t.initData = $t.initData || {}; //we will collect inits for selectors here
		$t.initData[selector] = $t.initData[selector] || []; //if no inits yet for this selector, add empty array
		$t.initData[selector].push(init); //and add given init


		//firstly normally call it on given set as .each do, but add init function to each element called inits list
		$(this).each(function(){
			this.initsCalled = this.initsCalled || []; //if no list, add empty arrat
			if ( this.initsCalled.indexOf(init) == -1 ) { //if havent been called before
				this.initsCalled.push(init); //add to called list
				$(this).each(init); //call
			}
		});


		//only once initialize observer
		if ( !this.initializedObserver ) {
			this.initializedObserver = true; //dont initialize again

			window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver; //unify mutation obj

			// create an observer instance
			var observer = new MutationObserver(function(mutations) {
				//foreach mutation
				$.each(mutations , function(i, mutation) {
					//lets get mutation target basing of mutation type
					var target = $();
					if ( mutation.type == "attributes" ) target = $(mutation.target); //if attr changed, single target always
					//if child list, lets add all addedNodes
					if ( mutation.type == "childList" && mutation.addedNodes.length ) {
						$.each(mutation.addedNodes, function(i, addedNode){
							target = target.add(addedNode);
						});
					}

					//for each watched selector
					for ( selector in $t.initData ) {
						var inits = $t.initData[selector]; //get functions that this selector has to initialize

						//check children of elem if they match current selector
						var toInit = target.find(selector);
						//also check item itself, if it's good, add to set
						if ( target.is(selector) ) toInit = toInit.add(target);

						//for each item that match selector and is in mutated area
						toInit.each(function(){
							
							var toInitSingle = this;
							//create list of called inits if no list yet
							toInitSingle.initsCalled = toInitSingle.initsCalled || [];

							//foreach function for this selector
							$.each(inits, function(i, init){
								//if it's not yet called on this element
								if ( toInitSingle.initsCalled.indexOf(init) == -1 ) {
									toInitSingle.initsCalled.push(init); //add it to called list
									$(toInitSingle).each(init); //initialize it
								}
							});
						});
					}
				});    
			});
			 
			// configuration of the observer to be sure we dont miss possible way of adding wanted element 
			var config = { attributes: true, childList: true, characterData: false, subtree : true };
			 
			//start the observer
			observer.observe(target, config);
		}

		return $(this);
	}



})(jQuery);
