GlobalVar = {
  androidDeviceTest:true,
  notificationType:{
    orderAccept:"OrderAccept",
    confirmPickup:"ConfirmPickup"
  },
  intentIcon : {
    newIdea:     "ion-ios-lightbulb",
    challenge:   "ion-alert",
    buildOn:     "ion-android-contacts",
    question:    "ion-help"
  }
};

Router.map(function() {


  this.route('/s/talkPanel/:_id', function () {
    this.render('studentTalk',{
      data: function () {
        var curClassroomId = this.params._id;
        // auto close the classroom
        Tracker.autorun(function (c) {
          var curClassroom = ClassroomKicker.getClassroomInfo(curClassroomId);
          if(undefined===curClassroom)
            return;

          if(curClassroom.status!==Schemas.classroomStatus.close)
          {
            //if status is open, set the cur classroom
            Session.set("curClassroomId",curClassroomId);
            Session.set("curMode",Schemas.ticketType.talkTicket);
            return;
          }
          else
          {
            //if status is close, reset cur classroom
            // and stop autorun
            Session.set("curClassroomId",undefined);
            Session.set("curMode",undefined);
            c.stop();
          }
        });
      }
    });
  }, {
    name: 'studentTalkWithParam',
    layoutTemplate:'tabsLayout'
  });
  this.route('/t/talkPanel/:_id', function () {
    this.render('teacherTalk',{
      data: function () {
        Session.set("curClassroomId",this.params._id);
        Session.set("curMode",Schemas.ticketType.talkTicket);
      }
    });
  }, {
    name: 'teacherTalkWithParam',
    layoutTemplate:'tabsLayout'
  });
  
  this.route('studentTalk',{path:'/s/talkPanel',template:'studentTalk', layoutTemplate: 'tabsLayout'});
  this.route('teacherTalk',{path:'/t/talkPanel',template:'teacherTalk', layoutTemplate: 'tabsLayout'});
  this.route('studentWork',{path:'/s/workPanel',template:'studentWork', layoutTemplate: 'tabsLayout'});
  this.route('teacherWork',{path:'/t/workPanel',template:'teacherWork', layoutTemplate: 'tabsLayout'});
  this.route('classroomHistoryList',{path:'/t/classroomHistoryList',template:'classroomHistoryList', layoutTemplate: 'tabsLayout'});
  this.route('classroomPickList',{path:'/s/classroomPickList',template:'classroomPickList', layoutTemplate: 'tabsLayout'});

  this.route('storeDetail',{path:'/storeDetail',template:'storeDetail', layoutTemplate: 'tabsLayout'});
  this.route('codeScan',{path:'/codeScan',template:'codeScan', layoutTemplate: 'tabsLayout'});

  this.route('map',{path:'/map',template:'myMap', layoutTemplate: 'tabsLayout'});
  // this.route('tabs.one', {path: '/map', template:"myMap", layoutTemplate: 'tabsLayout'});
  this.route('cameraToAdd', {path: '/cam', template:"myCam", layoutTemplate: 'tabsLayout'});
  this.route('orderPreview', {path: '/preview', template:"orderPreview", layoutTemplate: 'tabsLayout'});
  this.route('orderList', {path: '/list', template:"orderList", layoutTemplate: 'tabsLayout', 
    waitOn: function () {
      return Meteor.subscribe('ordersInfoDetail');
    }});
  // this.route('orderDetail', {path: '/list/:_id', template:"orderList", layoutTemplate: 'tabsLayout'});
  this.route('/order/:_id', function () {
    this.render('orderDetail',{
      data: function () {
        // get the order information with pharmacy store info
        var orderInfo = OrdersInfo.findOne({_id: this.params._id});
        orderInfo.pharmacyInfo = PharmacysInfo.findOne({_id:orderInfo.pid});
        return orderInfo;
      }
    });
  }, {
    name: 'orderDetail',
    layoutTemplate:'mainLayout'
  });
  this.route('/pad/:_id', function () {
    this.render('padDetail',{
      data: function () {
        // get the order information and the patient's profile
        var orderInfo = OrdersInfo.findOne({_id: this.params._id});
        orderInfo.user = Meteor.users.findOne({_id:orderInfo.uid});
        return orderInfo; 
      }
    });
  }, {
    name: 'padDetail',
    layoutTemplate:'mainLayout'
  });
  this.route('/profile', function () {
      this.render('profile',{
        data: function () {
          if(this.ready())
            return Meteor.user().profile;
        }
      });
    }, {
      name: 'userProfile',
      layoutTemplate:'tabsLayout'
    });
  });

Router.route('/', function () {
	var user = Meteor.user();
    if (user)
    {
        Router.go('home');
    }
    else
    {
      // if(GlobalVar.androidDeviceTest)
      // {
      //   Meteor.loginWithPassword("shenli570@gmail.com", "123123", function (error, result) {
      //     // should print no matter if the credentials are good or bad anyway
      //     console.log(error);
      //     console.log(result);
      //   });
      //   Router.go('home');
      // }
      // else
      this.render('myLogin');
    }
 // Router.go("teacherTalk");
},
{
  name:'login'
});

Router.route('/home', function () {
  console.log(Meteor.userId());
  if(isTeacherAccount(Meteor.userId()))
  {
    var curClass = ClassroomKicker.getCurrentClassroom();
    if(curClass!==undefined)
    {
      Session.set("curClassroomId",curClass._id);
      Session.set("curMode",Schemas.ticketType.talkTicket);
    }
    Router.go("teacherTalk");
  }
  else if(isStudentAccount(Meteor.userId()))
  {
    Router.go("studentTalk");
  }
  else {
    Router.render("moreInfo");
  }

},
{
  name:'home'
});
