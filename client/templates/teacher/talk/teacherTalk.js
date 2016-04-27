Template.teacherTalk.onCreated(function(){
  Session.set("curMode",Schemas.ticketType.talkTicket);
  var curClassroomId = Session.get("curClassroomId");
  if(curClassroomId){
    Router.go("/t/talkPanel/"+curClassroomId);
  }

});

Template.teacherTalk.onRendered(function(){
  // Tracker.afterFlush(function(){
  //   this.$(".avatar").css("background-color","red");
  //   console.log(this.$(".avatar"));  
  // });
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

function pollFunc(fn, timeout, interval) {
    var startTime = (new Date()).getTime();
    interval = interval || 1000,
    canPoll = true;

    (function p() {
        canPoll = ((new Date).getTime() - startTime ) <= timeout;
        if (!fn() && canPoll)  { // ensures the function exucutes
            setTimeout(p, interval);
        }
    })();
}

Template.teacherTalk.helpers({
  "afterRenderTrigger":function(){
    (function(ticketInfo){
      pollFunc(function(){
        // console.log(ticketInfo.convertRate);
        if(1!=ticketInfo.convertRate.get())
          ticketInfo.convertRate.set(getConvertRate(ticketInfo.createDate));
        else
          return true;
      },2*60*1000, 1000)}
    )(this);
  },
  "tickets": function () {
    console.log(Session.get("curMode"));
    console.log(Session.get("curClassroomId"));
    return TicketShutter.getClassroomTicketList(Session.get("curMode"),Session.get("curClassroomId"));
  },
  "changeColor":function(){
    this.convertRate = new ReactiveVar(getConvertRate(this.createDate));
    // console.log(this.convertRate);
    // return "transition: background-color "+convertSecond+"s ease;";
    return getRGB(this.convertRate.get());
  },
  "getIntentIconClass":function(intent){
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
  },
  "classroomName":function(){
  	 return ClassroomKicker.getCurrentClassroom().name;
  },
  "hasCurClassroom":function(){
  	return ClassroomKicker.getCurrentClassroom();
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
