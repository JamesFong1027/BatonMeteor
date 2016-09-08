DBUtil = {
	distinct: function(collection, field, query) {
		var option = {};
		option.sort = {};
		option.fields = {};
		option.sort[field] = 1;
		option.fields[field] = 1;
	  return _.uniq(collection.find(query, option).fetch().map(function(x){
	  	return x[field];
	  }),true);
	}

}

