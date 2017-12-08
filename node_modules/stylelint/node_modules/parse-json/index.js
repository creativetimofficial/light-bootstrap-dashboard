'use strict';
const errorEx = require('error-ex');
const fallback = require('./vendor/parse');

function appendPosition(message) {
	const posRe = / at (\d+:\d+) in/;
	const numbers = posRe.exec(message);
	return message.replace(posRe, ' in') + ':' + numbers[1];
}

const JSONError = errorEx('JSONError', {
	fileName: errorEx.append('in %s'),
	appendPosition: {
		message: (shouldAppend, original) => {
			if (shouldAppend) {
				original[0] = appendPosition(original[0]);
			}
			return original;
		}
	}
});

module.exports = (input, reviver, filename) => {
	if (typeof reviver === 'string') {
		filename = reviver;
		reviver = null;
	}

	try {
		try {
			return JSON.parse(input, reviver);
		} catch (err) {
			fallback.parse(input, {
				mode: 'json',
				reviver
			});

			throw err;
		}
	} catch (err) {
		const jsonErr = new JSONError(err);

		if (filename) {
			jsonErr.fileName = filename;
			jsonErr.appendPosition = true;
		}

		throw jsonErr;
	}
};
