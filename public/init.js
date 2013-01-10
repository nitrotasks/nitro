var jQuery  = require("jqueryify");
var exports = this;
jQuery(function(){
  var App = require("index");
  exports.app = new App({el: $("body")});
});
