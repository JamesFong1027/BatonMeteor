Meteor.startup(function() {
	// BrowserPolicy.content.allowOriginForAll("http://meteor.local");
	// WebApp.connectHandlers.use(function(req, res, next) {
	// 	console.log("in connectHandlers");
	//   res.setHeader("Access-Control-Allow-Origin", "*");
	//   return next();
	// });
	// on client sides startup code

	AutoForm.setDefaultTemplate('ionic');

	Meteor.subscribe('classroomsInfo');
	Meteor.subscribe('schoolsInfo');
	Tracker.autorun(function() {
		if (Session.get("curClassroomId") && Session.get("curMode")) {
			console.log("start subscribe ticketsInfoDetail");
			Meteor.subscribe("ticketsInfoDetail", Session.get("curClassroomId"));
			Meteor.subscribe('userProfile');
		}
	});

	Tracker.autorun(function(){
		if(Reload.isWaitingForResume()){
			IonLoading.show({
		      customTemplate: '<h3>New Version Available</h3><br/><p>We are making Baton better</p><p>Restart the app to update</p>',
		      duration: 3000,
		      backdrop: true
		    });
		    // Meteor.setTimeout(function(){
		    //    window.location.replace(window.location.href);
		    // }, 3000);
		    // window.location.replace(window.location.href);
		}
	});

	if (Meteor.isCordova) {
		document.addEventListener("backbutton", function() {
			console.log("on backbutton press");
			if (IonPopover.view && !IonPopover.view.isDestroyed) {
				IonPopover.hide();
			} else if (IonModal.views && IonModal.views.length > 0) {
				IonModal.close();
			} else if (~document.location.pathname.indexOf("classEntry") || ~document.location.pathname.indexOf("talkPanel") || ~document.location.pathname.indexOf("sign-in")) {
				console.log("backbutton");
				navigator.app.exitApp();
				// window.plugins.Suspend.suspendApp();
			} else {
				history.go(-1);
			}

		});
	}

	// window.onpopstate = function () {
	//        if (history.state && history.state.initial === true){
	//            navigator.app.exitApp();

	//            //or to suspend meteor add cordova:org.android.tools.suspend@0.1.2
	//            //window.plugins.Suspend.suspendApp();
	//        }
	//    };


	// Meteor.subscribe("ticketsInfoDetail", Session.get("curClassroom"),Session.get("CurMode"));		
	// Meteor.subscribe('userProfile');
	//push notification setup
	Push.addListener('message', function(notification) {
		// Called on every message
		// console.log(JSON.stringify(notification))

		LocalNotifHelper.fireAlert();

	});

	// Push.addListener('token', function(token) {
	// 	console.log("save token to device");
	//      if (token.apn) {
	//        var tokenObj = Object.create(null);
	//        tokenObj.token = token.apn;
	//        tokenObj.tokenType = "apn";
	//        Meteor.call("someMethod", tokenObj);
	//      }
	//      else if (token.gcm) {
	//        var tokenObj = Object.create(null);
	//        tokenObj.token = token.gcm;
	//        tokenObj.tokenType = "gcm";
	//        Meteor.call("someMethod", tokenObj);
	//      }
	//    });

	//start schedule pickup reminder
	// initialReminder();

	// IonKeyboard.enableScroll();
	// IonKeyboard.hideKeyboardAccessoryBar();

	Template.registerHelper('formatDate', function(date) {
		if (undefined === date)
			return "Not Ready";
		return moment(date).format('hh:mm MMM-DD');
	});

	Template.registerHelper('pathTo', function(path) {
		Router.go(path);
	});

	// Converts from degrees to radians.
	Math.radians = function(degrees) {
		return degrees * Math.PI / 180;
	}
});