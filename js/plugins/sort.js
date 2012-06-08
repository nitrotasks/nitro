/* Sorting Plugin for Nitro
 * By Jono Cooper & George Czabania
 * Licensed under the BSD License
 */

//Adds as a plugin
plugin.add(function() {
	
	console.log("Loaded sort.js");
	
	sort = function(list, method) {
		
		// Clone list
		list = list.splice(0);
		
		// Convert task IDs to obects
		for(var i = 0; i < list.length; i++) {
			var id = list[i];
			list[i] = core.storage.tasks[list[i]];
			list[i].arrayID = id;
		}
		
		// Sorting methods
		switch(method) {
			
			case "magic":
				break;
				
			case "manual":
				break;
				
			case "priority":
				
				list.sort(function(a,b) {
					var worth = { none: 0, low: 1, medium: 2, high: 3 };
					if(worth[a.priority] > worth[b.priority]) return true;
					else if(worth[a.priority] < worth[b.priority]) return false;
					else return null
				});
				
				break;
				
			case "date":
				break;
			
		}
		
		// Unconvert task IDs to obects
		for(var i = 0; i < list.length; i++) {
			console.log(list[i])
			list[i] = list[i].arrayID;
		}
		
		return list;
		
	};
	
});