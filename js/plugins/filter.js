/* Filters Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded filter.js")
	
	filter = function(list, filters) {
		
		var check = function(task, key, property) {
			
			// Because arrays have a typeof object
			if(typeof property === 'object') {
				
				var match = false;
				
				// Loop through this
				for(var i = 0; i < property.length; i++) {
										
					if(check(task, key, property[i])) {
						
						match = true;
						
					}
					
				}
				
				return match;
				
			} else if(task[key] == property) {
							
				return true;
				
			} else {
				
				return false;
				
			}
		}
		
		var results = [];		
		
		// Loop through tasks
		for(var i = 0; i < list.length; i++) {
			
			var task = core.storage.tasks[list[i]];
			
			for(var key in filters) {
				
				if(check(task, key, filters[key])) {
					
					results.push(list[i]);
					
				}
				
			}
			
		}
		
		return results;
		
	}
	
});