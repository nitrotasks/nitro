function escapeObj(obj) {

	//Regexes a bunch of shit that breaks the Linux & Mac versions
	function escapeStr(str) {
		if (typeof str === 'string') {
			str = str.replace(/\\/g, "&#92;") // Backslash
			.replace(/\|/g, "&#124") // Pipe
			.replace(/\"/g, "&#34;") // Quote
			.replace(/\'/g, "&#39;"); // Apostrophe
			return str;
		} else {
			return str;
		}
	}

	//Because typeof is useless here
	function isArray(obj) {
		return obj.constructor == Array;
	}

	var out = {};

	for (var key in obj) {
		if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
			out[key] = escapeObj(obj[key]);
		} else {
			out[key] = escapeStr(obj[key]);
		}
	}
	return out;
}