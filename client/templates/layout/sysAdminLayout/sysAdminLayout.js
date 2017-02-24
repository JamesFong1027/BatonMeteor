Template.sysAdminLayout.onRendered(function() {});

Template.sysAdminLayout.events({
	"click #issueManage": function(events, template) {
		var userId = !!events.target.attributes["data"] ? events.target.attributes["data"].value : undefined;
		if (!!userId) {
			console.log("show ", userId, " issues");
			IonModal.open("issueManagement", {
				userId: userId
			});
		} else {
			console.log("show all issues");
			IonModal.open("issueManagement");
		}
	},
	"click #logout": function(event) {
		console.log("logout");
		AccountsTemplates.logout();
	},
});