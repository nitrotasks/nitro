translate = require '../utils/translate'

mex = module.exports = {}

translate.ready ->

  mex.special  = translate('No tasks could be found.')
  mex.standard = translate('You haven\'t added any tasks to this list.')
  mex.empty    = translate('There are no tasks in here.')

  mex.search   = translate 'What are you looking for?'
  mex.addTask  = translate 'What do you need to do?'

