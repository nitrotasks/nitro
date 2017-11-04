export function log() {
  const args = Array.from(arguments)
  console.log(...args)
}
export function warn() {
  const args = Array.from(arguments)
  console.warn(...args)
}
export function error() {
  const args = Array.from(arguments)
  console.error(...args)
}