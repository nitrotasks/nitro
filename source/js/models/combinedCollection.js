import { ListsCollection } from '../models/listsCollection.js'
import { TasksCollection } from '../models/tasksCollection.js'

// helpers
export class combined {
  deleteList(list) {
    TasksCollection.deleteAllFromList(list)
    ListsCollection.delete(list)
  }
}
export let CombinedCollection = new combined()