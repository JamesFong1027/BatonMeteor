Template.loginLayout.onRendered(function () {
	if (Meteor.isCordova) {
		// console.log("change StatusBar");
		// console.log(StatusBar);
		StatusBar.overlaysWebView(true);
		// StatusBar.styleDefault();
		StatusBar.backgroundColorByHexString("#03A9F4");
    }
	// Meteor.loginWithPassword("shenli570@gmail.com","123123");
	// Router.go('tabs.three');
	// console.log(this.$('#at-signUp'));
	// AccountsTemplates.removeField('insuranceNumber');
});

// work around to all ways allow login with google button enable
Template.loginLayout.events({
	"click #at-google": function(event, template){
		AccountsTemplates.setDisabled(false);
	}
})