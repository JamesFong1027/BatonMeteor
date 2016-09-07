GlobalVar = {
  androidDeviceTest: true,
  notificationType: {
    orderAccept: "OrderAccept",
    confirmPickup: "ConfirmPickup"
  },
  intentIcon: {
    newIdea: "ion-ios-lightbulb",
    challenge: "ion-alert",
    buildOn: "ion-android-contacts",
    question: "ion-help"
  }
};

Router.map(function() {
  this.route('s/talkPanel', {
    name: 'studentTalk',
    template: 'studentTalk',
    layoutTemplate: 'tabsLayout',
    action: function() {
      if(Session.get("curClassroomId")){
        this.redirect('studentTalkWithParam',{_id:Session.get("curClassroomId")});
      }
      else{
        this.render();
      }
    }
  });
  this.route('/s/talkPanel/:_id', {
    name: 'studentTalkWithParam',
    template: 'studentTalk',
    layoutTemplate: 'tabsLayout',
    data: function() {
      console.log(this.params._id);
      ClassroomKicker.attendClass(this.params._id);
      // if user enter the classroom, set the classroom id and mode
      Session.set("curMode", Schemas.ticketType.talkTicket);
      return this.params._id;
    },

  });

  this.route('/s/workPanel', {
    name: 'studentWork',
    template: 'studentWork',
    layoutTemplate: 'tabsLayout',
    action: function() {
      if(Session.get("curClassroomId")){
        this.redirect('studentWorkWithParam',{_id:Session.get("curClassroomId")});
      }
      else{
        this.render();
      }
    }
  });
  this.route('/s/workPanel/:_id', {
    name: 'studentWorkWithParam',
    template: 'studentWork',
    layoutTemplate: 'tabsLayout',
    data: function() {
      ClassroomKicker.attendClass(this.params._id); 
      Session.set("curMode", Schemas.ticketType.workTicket);
      return this.params._id;
    }
  });

  this.route('/t/talkPanel/:_id', function() {
    this.render('teacherTalk', {
      data: function() {
        Session.set("curClassroomId", this.params._id);
        Session.set("curMode", Schemas.ticketType.talkTicket);
      }
    });
  }, {
    name: 'teacherTalkWithParam',
    layoutTemplate: 'tabsLayout'
  });

  
  this.route('teacherTalk', {
    path: '/t/talkPanel',
    template: 'teacherTalk',
    layoutTemplate: 'tabsLayout'
  });

  this.route('teacherWork', {
    path: '/t/workPanel',
    template: 'teacherWork',
    layoutTemplate: 'tabsLayout'
  });
  this.route('classEntry', {
    path: '/s/classEntry',
    template: 'classEntry',
    layoutTemplate: 'mainLayout'
  });
  this.route('classroomHistoryList', {
    path: '/t/classroomHistoryList',
    template: 'classroomHistoryList',
    layoutTemplate: 'mainLayout'
  });
  this.route('classroomPickList', {
    path: '/s/classroomPickList',
    template: 'classroomPickList',
    layoutTemplate: 'mainLayout'
  });

  this.route('/profile', function() {
    this.render('profile', {
      subscriptions:function(){
        return Meteor.subscribe('userProfile');
      }
    });
  }, {
    name: 'profile',
    layoutTemplate: 'tabsLayout'
  });
});

Router.route('/', function() {
  var user = Meteor.user();
  if (user) {
    Router.go('home');
  } else {
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

    // this.render('myLogin');
    Router.go("/sign-in");
  }
  // Router.go("teacherTalk");
}, {
  name: 'login'
});

Router.route('/home', function() {
  // add the subscription handle to our waitlist
  this.wait([Meteor.subscribe('userProfile'),Meteor.subscribe('classroomsInfo'),Meteor.subscribe('classSession')]);

  if(this.ready()){
    if (!Meteor.user()) {
      Router.go('login');
    } else {
      if (Meteor.isCordova) {
        // StatusBar.overlaysWebView(false);
        // StatusBar.styleLightContent();
        if(Blaze._globalHelpers.isIOS()){
          StatusBar.backgroundColorByHexString("#EEEEEE");  
        } else {
          StatusBar.backgroundColorByHexString("#000000");
        }
      }
    }
  
    console.log(Meteor.userId());
    if (isTeacherAccount(Meteor.userId())) {
      var curClass = ClassroomKicker.getCurrentTeachingClassroom();
      console.log(curClass);
      if (curClass !== undefined) {
        console.log("teacher account, classId:" + curClass._id);
        Session.set("curClassroomId", curClass._id);
      }
      Session.set("curMode", Schemas.ticketType.talkTicket);
      Router.go("teacherTalk");
    } else {
      var curClass = ClassroomKicker.getCurrentAttendingClassroom();
      console.log(curClass);
      if(!!curClass){
        if(curClass.status !== Schemas.classroomStatus.close){
          // if student already in the classroom, enter that classroom
          Router.go("studentTalkWithParam", {_id: curClass._id});
          return;
        } else {
          // otherwise, flag as leave the classroom
          ClassroomKicker.leaveClass();
        }
      }
      Router.go("studentTalk");
    }

  }

}, {
  name: 'home'
});