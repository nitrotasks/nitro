function SockJS (url) {
  var self = this;

  this.url = url;

  setTimeout(function () {
    self.open();
  }, 10);

  SockJS._ = this;
};


/**
 * SockJS methods
 */

SockJS.prototype.send = function (message) {
  SockJS.last = message;
  SockJS.read(message);
};


/**
 * Testing methods
 */

SockJS.reply = function (message) {
  this._.onmessage({data: message});
};

SockJS.read = function (message) {
  console.log('[SockJS]', message);
};


/**
 * Misc methods
 */

SockJS.prototype.open = function () {
  this.onopen();
};


/**
 * These methods should be overridden by Jandal
 */

SockJS.prototype.onopen = function () {};
SockJS.prototype.onmessage = function () {};
SockJS.prototype.onclose = function () {};

module.exports = SockJS;
