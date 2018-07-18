let history = []

export function log() {
  const args = Array.from(arguments)
  history.push([new Date(), 'log', args.join(' '), args])
  if (process.env.NODE_ENV !== 'test') {
    console.log('%c' + args.join(' '), 'background: #ececec; color: #3a7df8;')
  }
}
export function warn() {
  const args = Array.from(arguments)
  console.warn(...args)
  history.push([new Date(), 'warn', args.join(' '), args])
}
export function error() {
  const args = Array.from(arguments)
  console.error(...args)
  history.push([new Date(), 'error', args.join(' '), args])
}
export function logHistory() {
  return history
}
