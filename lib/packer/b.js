var bignum = require('bignum');

exports.unpack = function(msg, packager) {

	var chunk = msg;
	var chunkBin, data = '', bitmap = '';

	do {
		chunk = msg.substring(0, packager.length);
		chunkBitmap = bignum(chunk, 16).toString(2);
		while (chunkBitmap.length < (packager.length * 4)) {
			chunkBitmap = '0' + chunkBitmap;
		}
		data += chunk;
		bitmap += chunkBitmap;
		msg = msg.substr(packager.length);
	} while(chunkBitmap[0] > 0);

	var fieldIds = [];
	for(var i in bitmap) {
		if (i > 0 && bitmap[i] == 1) {
			fieldIds.push(parseInt(i) + 1);
		}
	}

	return {
		data: data,
		bitmap: bitmap,
		fieldIds: fieldIds,
		restData: msg
	};
};

exports.pack = function(data, packager) {
	var bitmap = '';

	var lastIndex = 0;
	for (var i in data) {
		if (i > 1) {
			var offset = i - lastIndex - 1;
			for(var j = 0; j < offset; j++) {
				bitmap += '0';
			}
			bitmap += '1';
			lastIndex = i;
		}
	}

	var blength = bitmap.length;
	var length = Math.ceil(blength / (packager.length * 4)) * (packager.length * 4);

	for(var i = 0; i < length - blength; i++) {
		bitmap += '0';
	}

	var msg = bignum(bitmap,2).toString(16).toUpperCase();

	return {
		msg: msg,
		bitmap: bitmap
	};
};
