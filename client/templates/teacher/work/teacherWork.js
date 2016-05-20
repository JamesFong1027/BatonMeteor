Template.teacherWork.onCreated(function(){
  Session.set("curMode",Schemas.ticketType.workTicket);
  Session.set('ionTab.current', "teacherWork");
});

Template.teacherWork.onRendered(function(){
  // Tracker.afterFlush(function(){
  //   this.$(".avatar").css("background-color","red");
  //   console.log(this.$(".avatar"));  
  // });
});


function getRGB(workTicketValue){
  var red;
  var green;
  var blue = 0;
  if(workTicketValue<=5){
    red = Math.round(workTicketValue*51);
    green=255;
  }
  if(workTicketValue>5){
    green = 255 - Math.round((workTicketValue-5)*51);
    red = 255;
  }

  return "background-color: rgba("+red+","+green+","+blue+",0.8);"
}

Template.teacherWork.helpers({
  "afterRenderTrigger":function(){
  },
  "tickets": function () {

    return TicketShutter.getClassroomTicketList(Session.get("curMode"),Session.get("curClassroomId"));
  },
  "changeColor":function(ticketValue){
    return getRGB(ticketValue);
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

Template.teacherWork.events({
  "click #createClassroom": function(){
    
  },
});
