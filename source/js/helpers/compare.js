function shallowDiffers (a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}

export const propsCompare = function(instance, nextProps) {
  return shallowDiffers(instance.props, nextProps)
}

export const stateCompare = function(instance, nextState) {
  return shallowDiffers(instance.state, nextState)
}

export const shallowCompare = function(instance, nextProps, nextState) {
  return (
    shallowDiffers(instance.props, nextProps) ||
    shallowDiffers(instance.state, nextState)
  )
}