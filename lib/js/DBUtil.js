DBUtil = {
	distinct: function(collection, field, query, sorts) {
		var option = {};
		option.fields = {};
		if (!!sorts) {
			option.sort = sorts;
		} else {
			option.sort = {};
		}
		option.sort[field] = 1;
		option.fields[field] = 1;
		return _.uniq(collection.find(query, option).fetch().map(function(x) {
			return x[field];
		}), false);
	},
	distinctMulti: function(collection, distinctField, fetchFields, query, sorts) {
		var option = {};
		option.fields = {};
		if (!!sorts) {
			option.sort = sorts;
		} else {
			option.sort = {};
		}
		option.sort[distinctField] = 1;
		option.fields[distinctField] = 1;

		for (var i = fetchFields.length - 1; i >= 0; i--) {
			option.fields[fetchFields[i]] = 1;
		}

		return _.uniq(collection.find(query, option).fetch(), false, function(x){
			return x[distinctField];
		}).map(function(y){
			var fetchObj = {};
			for (var i = fetchFields.length - 1; i >= 0; i--) {
				fetchObj[fetchFields[i]] = y[fetchFields[i]];
			}
			return fetchObj;
		});
	},
	groupBy: function(collection, field, query) {
		var groupResult = new Array();
		var groupedData = _.groupBy(_.pluck(collection.find(query).fetch(), field));
		_.each(_.values(groupedData), function(results) {
			groupResult.push([results[0], results.length]);
		});
		return groupResult;
	},
	search: function(collection, field, keyword, query, sorts){
		if(!!!query) query = {};
		var option = {};
		if (!!sorts) {
			option.sort = sorts;
		} else {
			option.sort = {};
		}
		// escape the search string
		keyword = keyword.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
		// default to match all the string
		keyword = keyword+".*";
		query[field] = {$regex:keyword, $options: "i"};
		return collection.find(query, option);
	}

}