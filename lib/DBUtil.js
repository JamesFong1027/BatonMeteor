DBUtil = {
	distinct: function(collection, field, query, sorts) {
		var option = {};
		option.fields = {};
		if(!!sorts){
			option.sort = sorts;
		} else {
			option.sort = {};
		}
		option.sort[field] = 1;
		option.fields[field] = 1;
	  return _.uniq(collection.find(query, option).fetch().map(function(x){
	  	return x[field];
	  }),false);
	}

}

