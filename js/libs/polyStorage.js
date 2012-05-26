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

	out = {};

	for (var key in obj) {
		out[key] = escapeStr(obj[key]);
		if (typeof obj[key] === 'object' && isArray(obj[key]) == false) {
			out[key] = escapeObj(out[key]);
		} else {
			out[key] = escapeStr(out[key]);
		}
	}
	return out;
}