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
	},
	groupBy: function(collection, field, query){
		var groupResult = new Array();
		var groupedData = _.groupBy(_.pluck(collection.find(query).fetch(), field));
		_.each(_.values(groupedData), function(results) {
			groupResult.push([results[0],results.length]);
		});
		return groupResult;
	}

}

