Template.chatListing.onCreated(function() {
	if(!!!this.data) this.data = new Object();
});


Template.chatListing.helpers({
	people:function(){
		var people = ChatCat.getChatListingPeople(this.curUserId);
		return _.sortBy(people, function(peopleObj){
			return -peopleObj.unreadNum;
		});
	},
	timeFormat: function(timestamp) {
		if (timestamp) {
			var today = moment().format('YYYY-MM-DD'),
				datestamp = moment(timestamp).format('YYYY-MM-DD'),
				isBeforeToday = moment(today).isAfter(datestamp),
				isBeforeWeek = moment(today).isAfter(datestamp, 'week'),
				format = isBeforeToday ? 'ddd' : 'hh:mm a',
				format = isBeforeWeek ? 'YYYY-MM-DD' : format;
			return moment(timestamp).format(format);
		}
	},
});