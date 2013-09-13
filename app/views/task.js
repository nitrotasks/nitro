(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['task'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "group";
  }

function program3(depth0,data) {
  
  
  return "completed";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <img width=\"10\" height=\"10\" style=\"display: inline-block\" src=\"img/calendar.png\"><time class=\"";
  if (stack1 = helpers.dateClass) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.dateClass; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.dateValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.dateValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</time><input class=\"date\" placeholder=\"";
  if (stack1 = helpers.dateplaceholder) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.dateplaceholder; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (stack1 = helpers.date) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.date; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <img width=\"10\" height=\"10\" src=\"img/calendar.png\"><time></time><input class=\"date\" placeholder=\"";
  if (stack1 = helpers.dateplaceholder) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.dateplaceholder; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" value=\"\">\n    ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <span class=\"listName\">";
  if (stack1 = helpers.listName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.listName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"notes\"><div class=\"inner\" contenteditable=\"true\">";
  if (stack1 = helpers.notes) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.notes; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div></div>\n  ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"notes placeholder\"><div class=\"inner\" contenteditable=\"true\">";
  if (stack1 = helpers.notesplaceholder) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.notesplaceholder; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div></div>\n  ";
  return buffer;
  }

  buffer += "<li id=\"task-";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"task ";
  stack1 = helpers['if'].call(depth0, depth0.group, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.completed, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " p";
  if (stack1 = helpers.priority) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.priority; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"checkbox\" title=\"";
  if (stack1 = helpers.checkboxalttext) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.checkboxalttext; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n  <div class=\"name\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.addTags),stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "addTags", depth0.name, options)))
    + "</div>\n  <input type=\"text\" class=\"input-name\">\n  <div class=\"right-controls\">\n    ";
  stack2 = helpers['if'].call(depth0, depth0.date, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  stack2 = helpers['if'].call(depth0, depth0.listName, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    <div class=\"priority-button\">\n      <div data-id=\"1\" title=\"";
  if (stack2 = helpers.lowalttext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.lowalttext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"low\"></div>\n      <div data-id=\"2\" title=\"";
  if (stack2 = helpers.mediumalttext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.mediumalttext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"medium\"></div>\n      <div data-id=\"3\" title=\"";
  if (stack2 = helpers.highalttext) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.highalttext; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"high\"></div>\n    </div>\n    <div class=\"delete\"></div>\n  </div>\n  ";
  stack2 = helpers['if'].call(depth0, depth0.notes, {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</li>\n";
  return buffer;
  });
})();