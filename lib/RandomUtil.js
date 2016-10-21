RandomUtil = {
	randomCharString:function(n){
		return (Math.random()+1).toString(36).replace(/[^a-z]+/g, '').substr(0,n);
	},
}