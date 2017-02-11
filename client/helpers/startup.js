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
	Meteor.subscribe('ticketsInfo');
	Meteor.subscribe('classSession');
	Meteor.subscribe('achievement');
	Meteor.subscribe('userProfile');

	// for waiting for resume, when update available
	// Tracker.autorun(function(){
	// 	console.log(Reload.isWaitingForResume());
	// 	if(Reload.isWaitingForResume()){
	// 		reloadFlag = false;
	// 		IonLoading.show({
	// 	      customTemplate: '<h3>New Version Available</h3><br/><p>Updating...</p><p>We are making Baton better</p>',
	// 	      duration: 3000,
	// 	      backdrop: true
	// 	    });

	// 	    Meteor.setTimeout(function(){
	// 	       window.location.replace(window.location.href);
	// 	    }, 3000);
	// 	}
	// });


	// add session control loading component
	Tracker.autorun(function(){
		if(Session.get("showLoading")){
			IonLoading.show({
		      duration: 3000,
		      backdrop: true
		    });
		    Session.set("showLoading", false);
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

		document.addEventListener("deviceready", function() {
			StatusBar.overlaysWebView(true);
		}, false);

		window.addEventListener('native.keyboardshow', function(event) {
			console.log("keyboardshow");
			console.log($('.content.overflow-scroll').data());

			var keyboardHeight = event.keyboardHeight;

			// Move the bottom of the popup area(s) above the top of the keyboard (IOS only)
			if (Blaze._globalHelpers.isIOS()) {
				$('.popup-container.popup-showing.active').each(function(index, el) {
					$(el).data('ionkeyboard.bottom', $(el).css('bottom'));
					$(el).css({
						bottom: keyboardHeight
					});
				});
			}


		});

		window.addEventListener('native.keyboardhide', function(event) {
			console.log("keyboardhide");
			console.log($('.content.overflow-scroll').data());

			if (Blaze._globalHelpers.isIOS()) {
				// Reset the content area(s)
				$('.popup-container.popup-showing.active').each(function(index, el) {
					$(el).css({
						bottom: $(el).data('ionkeyboard.bottom')
					});
				});
			}

			// keyboard workaround for login screen
			$('.content.login-screen.overflow-scroll').each(function(index, el) {
				$(el).css({
					bottom: "0px"
				});
			});
		});
	}

	// window.onpopstate = function () {
	//        if (history.state && history.state.initial === true){
	//            navigator.app.exitApp();

	//            //or to suspend meteor add cordova:org.android.tools.suspend@0.1.2
	//            //window.plugins.Suspend.suspendApp();
	//        }
	//    };


	// Meteor.subscribe('userProfile');
	//push notification setup
	// Push.addListener('message', function(notification) {
	// 	// Called on every message
	// 	// console.log(JSON.stringify(notification))

	// 	LocalNotifHelper.fireAlert();

	// });

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

	Template.registerHelper('i18n_ClassStatus', function(classStatus) {
		return TAPi18n.__("classroom_status", {
			context: classStatus.toLowerCase()
		});
	});

	Template.registerHelper('i18n_UserType', function(userType) {
		return TAPi18n.__("user_type", {
			context: userType.toLowerCase()
		});
	});

	Template.registerHelper('i18n_CurLanguageName', function() {
		return TAPi18n.getLanguages()[TAPi18n.getLanguage()].name;
	});

	Template.registerHelper('messageTimestamp', function(timestamp) {
		if (timestamp) {
			var today = moment().format('YYYY-MM-DD'),
				datestamp = moment(timestamp).format('YYYY-MM-DD'),
				isBeforeToday = moment(today).isAfter(datestamp),
				format = isBeforeToday ? 'MMMM Do, YYYY hh:mm a' : 'hh:mm a';
			return moment(timestamp).format(format);
		}
	});

	Template.ionModal.helpers({
		title: function() {
			// use i18T for title
			return TAPi18n.__(this.title);
		}
	});

	Template.ionTab.helpers({
		title: function() {
			// use i18T for title
			return TAPi18n.__(this.title);
		}
	});

	// Converts from degrees to radians.
	Math.radians = function(degrees) {
		return degrees * Math.PI / 180;
	}

	// language setup
	getUserPreferLanguage = function() {
		// Put here the logic for determining the user language
		if (!!Meteor.user() && !!Meteor.user().profile.defaultLangCode) {
			return Meteor.user().profile.defaultLangCode;
		} else {
			return Meteor.settings.public.defaultLanguage.langCode;
		}
	};

	setUserLanguage = function(langCode) {
		console.log(langCode);
		TAPi18n.setLanguage(langCode);
		if (langCode === 'zh') {
			T9n.setLanguage('zh-CN');
			moment.locale('zh-cn');
		} else {
			T9n.setLanguage(langCode);
			moment.locale(langCode);
		}
	}

	if (Meteor.isClient) {
		setUserLanguage(getUserPreferLanguage());
	}
});