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
		          "prompt" : "Place a barcode inside the scan area", // supported on Android only 
		          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
		          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device 
		      }
		   );
		} else{
			console.log("not Cordova, use qrScanner");
			IonPopup.alert({
		        title: 'QR Scanner not available',
		        template: 'Please download mobile app to use this feature.',
		        okText: 'OK'
		      });
		}
	},
});