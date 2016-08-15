Template.classroomCode.helpers({
  classroomsInfo:function(){
    return ClassroomKicker.getClassroomInfo(Session.get("curClassroomId"));
  },
});