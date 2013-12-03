chrome.app.runtime.onLaunched.addListener(function () {

  chrome.app.window.create('app/index.html', {
    bounds: {
      width: 800,
      height: 600,
      left: 100,
      top: 100
    },
    minWidth: 800,
    minHeight: 600
  });

});
