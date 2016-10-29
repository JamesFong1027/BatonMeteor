Template.teacherTalk.onCreated(function(){
  this.curClassroomInfo = new ReactiveVar(null);
});

Template.teacherTalk.onRendered(function(){
  Session.set('ionTab.current', "teacherTalk");
  this.curClassroomInfo.set(ClassroomKicker.checkCurrentClassBySessionType(Meteor.userId,Schemas.sessionType.hosting));
});

function getConvertRate(createDate){
  var totalConvertTime = 2*60;
  // console.log((new Date()).getTime()-this.createDate.getTime());
  var passSecond = ((new Date()).getTime()-createDate.getTime())/1000;
  // console.log(passSecond);
  passSecond = Math.min(totalConvertTime,passSecond);
  var convertRate = passSecond/totalConvertTime;
  // console.log(convertRate);
  return convertRate;
}

function getRGB(convertRate){
  var red;
  var green;
  var blue = 0;
  if(convertRate<=0.5){
    red = Math.round(convertRate*510);
    green=255;
  }
  if(convertRate>0.5){
    green = 255 - Math.round((convertRate-0.5)*2*255);
    red = 255;
  }

  return "background-color: rgba("+red+","+green+","+blue+",0.8);"
}

Template.registerHelper('getIntentIconClass', function(intent) {
  var iconClass="icon ";
  switch(intent){
      case Schemas.talkTicketValue.buildOn:
        iconClass+= GlobalVar.intentIcon.buildOn;
        break;
      case Schemas.talkTicketValue.newIdea:
        iconClass+= GlobalVar.intentIcon.newIdea;
        break;
      case Schemas.talkTicketValue.challenge:
        iconClass+= GlobalVar.intentIcon.challenge;
        break;
      case Schemas.talkTicketValue.question:
        iconClass+= GlobalVar.intentIcon.question;
        break;
    }
    return iconClass;
});

Template.teacherTalk.helpers({
  "afterRenderTrigger":function(){
    (function(ticketInfo){
      TicketShutter.pollFunc(function(){
        // console.log(ticketInfo.convertRate);
        if(1!=ticketInfo.convertRate.get())
          ticketInfo.convertRate.set(getConvertRate(ticketInfo.createDate));
        else
          return true;
      },2*60*1000, 1000)}
    )(this);
  },
  "tickets": function () {
    return TicketShutter.getClassroomTicketList(Schemas.ticketType.talkTicket,Template.instance().curClassroomInfo.get()._id, ClassroomKicker.getCurrentClassSession(Template.instance().curClassroomInfo.get()._id));
  },
  "changeColor":function(){
    this.convertRate = new ReactiveVar(getConvertRate(this.createDate));
    // console.log(this.convertRate);
    // return "transition: background-color "+convertSecond+"s ease;";
    return getRGB(this.convertRate.get());
  },
  "classroomName":function(){
  	 return Template.instance().curClassroomInfo.get().name;
  },
  "hasCurClassroom":function(){
    // show first time user guide
    if(!!Template.instance().curClassroomInfo.get()){
      ClassroomKicker.showFirstTimeGuide();
    }
  	return !!Template.instance().curClassroomInfo.get();
  },
  longHoldGesture:{
    'press .avatar': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template */
      console.log(event);
      var ticketId = event.target.id;
      TicketShutter.selectTicket(ticketId);
    },
  }
});

Template.teacherTalk.events({
  "click #createClassroom": function(){
    
  },
});
