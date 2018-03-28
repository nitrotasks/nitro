import { route } from 'preact-router'

let navigations = 0

export function go(url) {
  navigations++
  route(url)
}

export function back() {
  if (navigations > 0) {
    navigations -= 1
    window.history.back()
  } else {
    go(window.location.pathname.split('/').slice(0, -1).join('/'))
  }
}