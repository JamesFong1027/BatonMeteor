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