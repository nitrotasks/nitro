translate = require '../utils/translate'

mex = module.exports = {}

translate.ready ->

  tls =
    special: translate('No tasks could be found.')
    standard: translate('You haven\'t added any tasks to this list.')
    empty: translate('There are no tasks in here.')

  mex.special  = """<div class="message">#{ tls.special }</div>"""
  mex.standard = """<div class="message">#{ tls.standard }</div>"""
  mex.empty    = """<div class="message">#{ tls.empty }</div>"""
