import authenticationStore from '../source/js/stores/auth.js'
import { CombinedCollection } from '../source/js/models/combinedCollection.js'

describe('syncGet', function() {
	before(function(done) {
		done()
	})
	it('should do something', function(done) {
		CombinedCollection.syncGet.downloadLists().then(function(data) {
			done()
		}).catch(done)
	})
})