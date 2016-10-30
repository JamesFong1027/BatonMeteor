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

  /************************ student talk panel router **************************************/
  this.route('s/talkPanel', {
    name: 'studentTalk',
    template: 'studentTalk',
    layoutTemplate: 'tabsLayout',
    action: function() {
      this.render();
    },
    waitOn: function () {
      // subscribe ticket list and participation buddy's ticket list
      return [Meteor.subscribe("classSession"),Meteor.subscribe("classroomsInfo"),Meteor.subscribe("ticketsInfo")];
    },
  });
  /***************************************************************************************/


  /************************ student work panel router **************************************/
  this.route('/s/workPanel', {
    name: 'studentWork',
    template: 'studentWork',
    layoutTemplate: 'tabsLayout',
    action: function() {
      this.render();
    },
    waitOn: function () {
      // subscribe ticket list and participation buddy's ticket list
      return [Meteor.subscribe("classSession"),Meteor.subscribe("classroomsInfo"),Meteor.subscribe("ticketsInfo")];
    },
  });
  /***************************************************************************************/


  /************************ teacher talk panel router **************************************/
  this.route('/t/talkPanel', {
    name: 'teacherTalk',
    template: 'teacherTalk',
    layoutTemplate: 'tabsLayout',
    action: function() {
      this.render();
    },
    waitOn: function () {
      // subscribe ticket list and participation buddy's ticket list
      return [Meteor.subscribe("classSession"),Meteor.subscribe("classroomsInfo"),Meteor.subscribe("ticketsInfo")];
    },
  });
  /***************************************************************************************/


  /************************ teacher work panel router **************************************/
  this.route('/t/workPanel', {
    name: 'teacherWork',
    template: 'teacherWork',
    layoutTemplate: 'tabsLayout',
    action: function() {
      this.render();
    },
    waitOn: function () {
      // subscribe ticket list and participation buddy's ticket list
      return [Meteor.subscribe("classSession"),Meteor.subscribe("classroomsInfo"),Meteor.subscribe("ticketsInfo")];
    },
  });
  /***************************************************************************************/

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
  this.route('/t/classroomDetail/:_id', {
    name: 'classroomDetail',
    template: 'classroomDetail',
    layoutTemplate: 'mainLayout',
    data: function() {
      return this.params._id;
    }
  });

  /************************ Student Analytics **************************************/
  this.route('/s/studentAchievements', {
    name: 'studentAchievements',
    template: 'studentAchievements',
    layoutTemplate: 'mainLayout',
    waitOn:function(){
        return [Meteor.subscribe('achievement'),Meteor.subscribe('ticketsInfo')];
    }
  });
  this.route('/s/classParticipationHistoryChart/:_id', {
    name: 'classParticipationHistoryChart',
    template: 'classParticipationHistoryChart',
    layoutTemplate: 'mainLayout',
    waitOn:function(){
        return [Meteor.subscribe('achievement'),Meteor.subscribe('ticketsInfo')];
    },
    data: function() {
      return this.params._id;
    }
  });

  /************************ Teacher Analytics **************************************/
  this.route('/t/classParticipationRecords', {
    name: 'classParticipationRecords',
    template: 'classParticipationRecords',
    layoutTemplate: 'mainLayout',
    waitOn:function(){
        return [Meteor.subscribe('classroomsInfo'),Meteor.subscribe('ticketsInfo')];
    }
  });
  this.route('/t/classRecordHistory/:_id', {
    name: 'classRecordHistory',
    template: 'classRecordHistory',
    layoutTemplate: 'mainLayout',
    waitOn:function(){
        return [Meteor.subscribe('classroomsInfo'),Meteor.subscribe('ticketsInfo')];
    },
    data: function() {
      return this.params._id;
    }
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
    Router.go("/sign-in");
  }
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
        if(Blaze._globalHelpers.isIOS()){
          StatusBar.backgroundColorByHexString("#EEEEEE");  
        } else {
          StatusBar.backgroundColorByHexString("#000000");
        }
      }
    }

    console.log(Meteor.userId());
    if (isTeacherAccount(Meteor.userId())) {
      Router.go("teacherTalk");
    } else {
      Router.go("studentTalk");
    }
  }

}, {
  name: 'home'
});