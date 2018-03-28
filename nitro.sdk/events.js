// a simple class to do basic events
class Events {
  constructor() {
    this._events = {}
  }
  bind(event, fct) {
    this._events[event] = this._events[event] || []
    this._events[event].push(fct)
  }
  unbind(event, fct) {
    if (event in this._events === false) {
      return
    }
    this._events[event].splice(this._events[event].indexOf(fct), 1)
  }
  trigger(event /* , args... */) {
    if (event in this._events === false) {
      return
    }
    for(var i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
    }
  }
}
export default Events