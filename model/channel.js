Channel = new Mongo.Collection( 'channel' );

Channel.allow({
  insert: function() {return false},
  update: function() {return false},
  remove: function() {return false}
});

Channel.deny({
  insert: function() {return true},
  update: function() {return true},
  remove: function() {return true}
});

Schemas.ChannelSchema = new SimpleSchema({
  'name': {
    type: String,
    label: 'The name of the channel.'
  }
});

Channel.attachSchema(Schemas.ChannelSchema);
