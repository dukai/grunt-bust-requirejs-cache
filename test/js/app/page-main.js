require(['comp/format/result', 'comp/math/plus'],function(result, plus){

	var $ = require('jquery');
	console.log('add', result(plus(1, 2)));

	console.log(result($, 'warning'));
})
