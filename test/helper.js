// define localstorage
global.localStorage = {
	getItem: () => null,
	setItem: () => null,
}

// define requestAnimationFrame
global.requestAnimationFrame = process.nextTick

console.log('Created localStorage & requestAnimationFrame hacks')