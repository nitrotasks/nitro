isMobile = !!('ontouchstart' of window) or navigator.msMaxTouchPoints
module.exports = isMobile
