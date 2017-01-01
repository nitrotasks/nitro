import preact from 'preact'
import Router from 'preact-router'

import Home from './views/home.jsx'
import Lists from './views/lists.jsx'
import Tasks from './views/tasks.jsx'
import NotFound from './views/notfound.jsx'

const App = () => (
  <div class="app">
    <Lists />
    <Router>
      <Home path="/" />
      <Tasks path="/lists/:list" />
      <NotFound default />
    </Router>
  </div>
)

let elem = document.getElementById('app-shell')
elem.innerHTML = ''
preact.render(App(), elem)