Template.feedbackAndIssue.onCreated(function() {
	Meteor.subscribe("issue");

	var template = this;
	template.channel = new ReactiveVar(null);
});

Template.feedbackAndIssue.events({
	"click .person":function(event, template){
		$(".person").removeClass("active");
		$(event.currentTarget).addClass("active");
    	template.channel.set(this.userObj._id);
    	$("#issueManage").attr("data", this.userObj._id);
    	$("#issueManage").toggleClass("disable-button", false);
	},
});

Template.feedbackAndIssue.helpers({
	chatListArg: function() {
		return {
			curUserId: GlobalVar.feedbackAdminID,
			withIssueNum: true
		};
	},
	chatRoomArg:function(){
		// console.log(Template.instance().channel.get());
		return {
			channel: Template.instance().channel.get(),
			isDirect: true,
			curUserId: GlobalVar.feedbackAdminID
		};
	}
});
