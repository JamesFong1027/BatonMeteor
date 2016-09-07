Schemas.userType={
  teacher:"Teacher",
  student:"Student"
};
Schemas.User = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    emails: {
        type: [Object]
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    profile: {
        type: Schemas.UserProfile,
    },
    participation:{
      type:Schemas.Participation,
      optional: true,
      blackbox: true
    },
    services:{
      type: Object,
      optional:true,
      blackbox:true
    }
});

Schemas.Participation = new SimpleSchema({
  attendTimes:{
    type:Number,
    optional: true
  },
  selectedTimes:{
    type:Number,
    optional:true
  }
});

Schemas.UserProfile = new SimpleSchema({
    userType: {
      type: String,
      optional: true
    },
    firstName: {
      type: String,
      optional: true
    },
    lastName: {
      type: String,
      optional: true
    },
    sid:{
      type: String,
      optional: true
    },
    firstTimeLogin:{
      type:Boolean,
      label:"is the first time login to the app",
      optional:true
    },
    curClassId:{
      type: String,
      optional:true
    }
});

Meteor.users.deny({  
  update: function (userId, docs, fields, modifier) {
    // can't change id
    if(userId !== docs._id) return true;
    // can't change userType
    if(_.contains(Object.keys(modifier.$set), "profile.userType")) return true;
  }
});

// Meteor.users.attachSchema(Schemas.User);
