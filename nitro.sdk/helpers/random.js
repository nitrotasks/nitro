export const createId = function(find) {
  let validId = false
  let id = null
  while (validId === false) {
    id = Math.round(Math.random()*100000).toString()
    if (find(id) === null) {
      validId = true
    }      
  }
  return id
}