export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    return response.json().then(function(data) {
      let error = new Error(response.status)
      error.response = data
      throw error
    })
  }
}