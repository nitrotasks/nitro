isMobile = !!('ontouchstart' of window) or !!('onmsgesturechange' of window)
module.exports = isMobile
