define(function(require, exports, module) {
	var msg = require('./msg');
	module.exports = function(str, type){
		console.log('exec result');

		type = type ? type: 'msg';

		return msg[type](str);
	}
})