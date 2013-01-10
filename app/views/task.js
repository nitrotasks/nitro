(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['task'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "group";}

function program3(depth0,data) {
  
  
  return "completed";}

function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <img width=\"10\" height=\"10\" style=\"display: inline-block\" src=\"img/calendar.png\"><time class=\"";
  foundHelper = helpers.dateClass;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dateClass; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.dateValue;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dateValue; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</time><input class=\"date\" placeholder=\"";
  foundHelper = helpers.dateplaceholder;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dateplaceholder; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" value=\"";
  foundHelper = helpers.date;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.date; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\n    ";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <img width=\"10\" height=\"10\" src=\"img/calendar.png\"><time></time><input class=\"date\" placeholder=\"";
  foundHelper = helpers.dateplaceholder;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.dateplaceholder; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" value=\"\">\n    ";
  return buffer;}

function program9(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <div class=\"notes\"><div class=\"inner\" contenteditable=\"true\">";
  foundHelper = helpers.notes;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.notes; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div></div>\n  ";
  return buffer;}

function program11(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <div class=\"notes placeholder\"><div class=\"inner\" contenteditable=\"true\">";
  foundHelper = helpers.notesplaceholder;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.notesplaceholder; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</div></div>\n  ";
  return buffer;}

  buffer += "<li id=\"task-";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\" class=\"task ";
  stack1 = depth0.group;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = depth0.completed;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " p";
  foundHelper = helpers.priority;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.priority; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\n  <div class=\"priority\"></div>\n  <div class=\"checkbox\"></div>\n  <div class=\"name\">";
  stack1 = depth0.name;
  foundHelper = helpers.addTags;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "addTags", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "</div>\n  <input type=\"text\" class=\"input-name\">\n  <div class=\"right-controls\">\n    ";
  stack1 = depth0.date;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <div class=\"priority-button\">\n      <div data-id=\"1\" class=\"low\"></div>\n      <div data-id=\"2\" class=\"medium\"></div>\n      <div data-id=\"3\" class=\"high\"></div>\n    </div>\n    <div class=\"delete\"></div>\n  </div>\n  ";
  stack1 = depth0.notes;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</li>\n";
  return buffer;});
})();