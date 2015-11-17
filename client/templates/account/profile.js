Template.profile.rendered = function() {
    var profile = this.data;
    
    Session.set("userProfile",profile);
};


Template.profile.helpers({
  userProfile:function(){
    return Session.get("userProfile");
  },
});