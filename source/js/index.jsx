import preact from 'preact'
import Router from 'preact-router'

import authenticationStore from './stores/auth.js'

import Lists from './views/lists.jsx'
import Tasks from './views/tasks.jsx'
import NotFound from './views/notfound.jsx'

const App = () => (
  <div class="app">
    <Lists />
    <Router>
      <Tasks path="/" />
      <Tasks path="/lists/:list" />
      <Tasks path="/lists/:list/:task" />
      <NotFound default />
    </Router>
  </div>
)

window.auth = authenticationStore

document.addEventListener('DOMContentLoaded', function() {
  document.body.style.setProperty('--real-height', document.documentElement.clientHeight + 'px')
  window.addEventListener('resize', function() {
    document.body.style.setProperty('--real-height', document.documentElement.clientHeight + 'px')
  })

  let elem = document.getElementById('app-shell')
  elem.innerHTML = ''
  preact.render(App(), elem)

  setTimeout(function() {
    elem.className = ''
  }, 500)
})