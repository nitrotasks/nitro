/* Filters Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded filter.js")
	
	filter = function(list, filters) {
		
		// This will check one task and either return true or false
		var check = function(task, key, property) {
			
			// Handles multiple properties in an array
			if(typeof property === 'object') {
				var match = false;
				// Loop through this
				for(var i = 0; i < property.length; i++) {			
					if(check(task, key, property[i])) {
						match = true;
					}
				}
				return match;
			}
			
			// Formats the property value
			switch(key) {
				
				case "logged":
						
					// Get tasks that are logged
					if (property === true) {
						if(typeof task[key] == 'number') return true;
						
					// Get tasks that were logged after a certain time
					} else if (typeof property == 'number') {
						if(task[key] >= property) return true;
					}
					break;
					
				case "notes":
				
					// Get tasks with notes
					if (property === true) {
						// Notes must have at least one non-space char
						if(task[key].match(/\S/)) return true;
					}
					break;
					
				case "priority":
				
					// Gets tasks without a priority
					if (property === false) {
						property = "none";
					
					// Get tasks that have a priority
					} else if (property === true) {
						if(task[key] !== "none") return true;
					}
					break;
					
				case "date":
				
					if (property === true) {
						if (task[key] != false) return true;
					}
				
					var due = new Date(task[key]),
						today = new Date();
						
					if (property == 'month') {
						if (due.getMonth() == today.getMonth()) return true;
					}
				
					// Copy date parts of the timestamps, discarding the time parts.
					var one = new Date(due.getFullYear(), due.getMonth(), due.getDate());
					var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());
					
					// Do the math.
					var millisecondsPerDay = 1000 * 60 * 60 * 24;
					var millisBetween = one.getTime() - two.getTime();
					var days = millisBetween / millisecondsPerDay;
					
					// Round down.
					var diff = Math.floor(days);
					
					// Get tasks due today
					if (property == 'overdue') {
						if (diff < 0) return true
					} else if (property == 'today') {
						if (diff === 0) return true;
					} else if(property == 'tomorrow') {
						if (diff <= 1) return true;
					} else if (property == 'week') {
						if (diff <= 7) return true;
					} else if (property == 'fortnight') {
						if (diff <= 14) return true;
					} else if (typeof property == 'number') {
						if (diff <= property) return true;
					}
					break;
			}
			
			if(task[key] == property) {
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
				
				// Convert string to boolean
				if(filters[key] === 'true') filters[key] = true;
				if(filters[key] === 'false') filters[key] = false;
				
				if(check(task, key, filters[key])) {
					
					results.push(list[i]);
					
				}
				
			}
			
		}

		// Get all tasks that are logged, but not in the logbook
		if(filters === 'logged') {
			for (var i=0; i<core.storage.tasks.length; i++) {
				if(!core.storage.tasks[i].hasOwnProperty('deleted') && core.storage.tasks[i].logged && core.storage.tasks[i].list !== 'logbook') {
					results.push(i);
				}
			}
		}
		
		return results;
		
	};
	
});