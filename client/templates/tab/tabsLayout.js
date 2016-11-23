Template.tabsLayout.onRendered(function () {
  console.log("on rendered");
  // if(!Blaze._globalHelpers.isIOS()){
  // 	this.$(".content").addClass("has-tabs-top");
  // }
  
});

Template.tabsLayout.helpers({
  isTeacher: function () {
    return isTeacherAccount(Meteor.userId());
  }
});

Template.tabsLayout.events({
  "click #editClass":function(){
    console.log("editClass");
    IonModal.open("editClassroom",Template.instance().data);
  },
  "click #scanQRCode":function(event){
		event.preventDefault();
		if (Meteor.isCordova) {
			console.log("isCordova use cordova barcodeScanner");
			cordova.plugins.barcodeScanner.scan(
		      function (result) {
		          if(result.cancelled==0) {
		          	IonModal.open("scanResult", result.text);
		          }
		      }, 
		      function (error) {
		          alert("Scanning failed: " + error);
		      },
		      {
		          "preferFrontCamera" : false, // iOS and Android 
		          "showFlipCameraButton" : true, // iOS and Android 
		          "prompt" : TAPi18n.__("qr_scanner_prompt"), // supported on Android only 
		          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
		          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device 
		      }
		   );
		} else{
			console.log("not Cordova, use qrScanner");
			IonPopup.alert({
		        title: TAPi18n.__("qr_scanner_popup_title"),
		        template: TAPi18n.__("qr_scanner_popup_content"),
		        okText: 'OK'
		      });
		}
	},
	"click #teacherMenu": function(event, template) {
		var curClassroom = ClassroomKicker.getCurrentHostingClassroom();
		if (!!curClassroom) {
			IonPopover.show("teacherMenu", {
				classroomId: curClassroom._id,
				classMode: event.target.attributes["data"].value
			}, event.target);
		}
	},
	"click #studentMenu": function(event, template) {
		var curClassroom = ClassroomKicker.getCurrentAttendingClassroom();
		if (!!curClassroom) {
			IonPopover.show("studentMenu", {
				classroomId: curClassroom._id,
				classMode: event.target.attributes["data"].value
			}, event.target);
		}
	},
});