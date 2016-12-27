import preact from 'preact'

document.addEventListener('DOMContentLoaded', () => {
  preact.render((
    <div id="foo">
      <span>Nitro 3. It's happening.</span>
      <button onClick={ e => alert("hi!") }>Click Me</button>
    </div>
  ), document.getElementById('app-shell'))
})