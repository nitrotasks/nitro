export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const cb = (data) => {
      let error = new Error(response.status)
      error.status = response.status
      error.response = data
      throw error
    }
    return response.json().then(function(data) {
      cb(data)
    })
  }
}