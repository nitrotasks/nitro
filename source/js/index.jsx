import preact from 'preact'
import Router from 'preact-router'

// polyfill
import intersectionObserver from '../lib/intersection-observer.js'
import authenticationStore from './stores/auth.js'

import Lists from './views/lists.jsx'
import Tasks from './views/task/index.jsx'
import TasksEditor from './views/task/editormobile.jsx'
import NotFound from './views/notfound.jsx'
import Login from './views/login.jsx'
import ContextMenu from './views/contextmenu.jsx'
import DialogBox from './views/dialogbox.jsx'

const App = () => (
  <div class="app">
    <div class="desktop-grid">
      <Lists />
      <Router>
        <Tasks path="/" />
        <Tasks path="/lists/:list" />
        <Tasks path="/lists/:list/:task" />
        <NotFound default />
      </Router>
    </div>
    <Router>
      <TasksEditor path="/lists/:list" />
      <TasksEditor path="/lists/:list/:task" />
    </Router>
    <Login />
    <ContextMenu />
    <DialogBox />
  </div>
)

window.auth = authenticationStore

document.addEventListener('DOMContentLoaded', function() {
  document.body.style.setProperty('--real-height', document.documentElement.clientHeight + 'px')
  window.addEventListener('resize', function() {
    requestAnimationFrame(() => {
      document.body.style.setProperty('--real-height', document.documentElement.clientHeight + 'px')
    })
  })

  let elem = document.getElementById('app-shell')
  elem.innerHTML = ''
  preact.render(App(), elem)

  setTimeout(function() {
    elem.className = ''
  }, 500)
})