var jQuery  = require("jqueryify");
var exports = this;
jQuery(function(){
  var App = require("../app/index.coffee");
  exports.app = new App({el: $("body")});
});
