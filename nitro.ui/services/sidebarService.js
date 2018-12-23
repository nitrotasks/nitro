import { Events } from '../../nitro.sdk'

class _sidebar extends Events {
  currentFocus = null

  focusSearchBox() {
    this.trigger('focus-search-box')
  }
  focusSearchItemFirst() {
    this.trigger('focus-search-item-first')
  }
  hideSearchResults() {
    this.trigger('hide-search-results')
  }
}
export const SidebarService = new _sidebar()
