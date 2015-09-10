define(function(require){
	var result = require('comp/format/result');
	var plus = require('comp/math/minus');
	console.log('minus', result(plus(1, 2)));
})
