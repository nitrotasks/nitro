// Shitty Modal Plugin.
// By Jono Cooper

(function($){
	$.fn.modal = function(control){
		// So it works in setTimeout and deferred
		var self = this;
		if (control === "hide" || control === undefined && this.hasClass("show")) {
			this.removeClass("show");
			setTimeout (function() {
				self.hide(0);
			}, 350);
			this.off("click.modal");
		} else if (control === "show" || control === undefined && !this.hasClass("show")) {
			this.show(0).addClass("show");
			// Because I'm an asshole
			this.on("click.modal", function(e) {
				if ($(e.target).hasClass("modal")) {
					// This feels so wrong...
					self.modal("hide");
				}
			});
		}
	};
})(jQuery);
