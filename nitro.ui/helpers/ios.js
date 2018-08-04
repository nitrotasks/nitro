let iostest = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
export class ios {
  // ensures the rubber banding is in the correct place,
  // if they are already at the top of the div
  detect() {
    return iostest
  }
  triggerStart(event, mode) {
    if (!iostest) {
      return true
    }
    const e = event.currentTarget
    const top = e.scrollTop
    const totalScroll = e.scrollHeight
    const currentScroll = top + e.offsetHeight

    if (top === 0 && mode !== 'bottom') {
      e.scrollBy(0, 1)
    } else if (currentScroll === totalScroll && mode !== 'top') {
      e.scrollBy(0, -1)
    }
  }
}
export let iOS = new ios()