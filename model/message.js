Message = new Mongo.Collection( 'message' );

Message.allow({
  insert: function() {return false},
  update: function() {return false},
  remove: function() {return false}
});

Message.deny({
  insert: function() {return true},
  update: function() {return true},
  remove: function() {return true}
});

Schemas.MessageSchema = new SimpleSchema({
  'channel': {
    type: String,
    label: 'The ID of the channel this message belongs to.',
    optional: true
  },
  'to': {
    type: String,
    label: 'The ID of the user this message was sent directly to.',
    optional: true
  },
  'owner': {
    type: String,
    label: 'The ID of the user that created this message.'
  },
  'timestamp': {
    type: Date,
    label: 'The date and time this message was created.',
    autoValue: function(){
        // console.log(this.field("lastUpdate").value);
        if(this.isInsert&&null==this.value)
        {
          return new Date();
        }
        else if(null!=this.value)
          return this.value;
        else
          this.unset();
      }
  },
  'message': {
    type: String,
    label: 'The content of this message.'
  },
  'isRead': {
    type: Boolean,
    label: 'The flag to show if this message is read'
  }
});

Message.attachSchema(Schemas.MessageSchema);