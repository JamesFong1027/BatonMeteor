Template.chatListing.onCreated(function() {
	if (!!!this.data) this.data = new Object();
	this.searchStr = new ReactiveVar("");
});


Template.chatListing.helpers({
	people: function() {
		var people = ChatCat.getChatListingPeople(this.curUserId, this.withIssueNum);
		return _.sortBy(_.filter(people, function(pp) {
			var searchField = (pp.userObj.profile.firstName + " " + pp.userObj.profile.lastName).toLowerCase();
			return (searchField.indexOf(Template.instance().searchStr.get().toLowerCase()) !== -1);
		}), function(peopleObj) {
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
	withIssueNum: function(){
		return Template.instance().data.withIssueNum;
	}
});


Template.chatListing.events({
	"input #peopleSearch": function(event, template) {
		// console.log(event.target.value);
		var searchStr = event.target.value.trim();
		template.searchStr.set(searchStr);
	}
});