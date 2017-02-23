Issue = new Mongo.Collection( 'issue' );

Issue.allow({
  insert: function() {return false},
  update: function() {return false},
  remove: function() {return false}
});

Issue.deny({
  insert: function() {return true},
  update: function() {return true},
  remove: function() {return true}
});
Schemas.IssueState={
  open:   "open",
  closed:   "closed"
}

Schemas.IssueSchema = new SimpleSchema({
  'uid': {
    type: String,
    label: 'The issue related users id'
  },
  'giid': {
    type: String,
    label: 'Github issue id'
  },
  'gitRepo': {
    type: String,
    label: 'git repository name',
    optional: true
  },
  'gitRepoOwnerName': {
    type: String,
    label: 'git repository owner user name',
    optional: true
  },
  'state': {
    type: String,
    label: 'The current state of this issue'
  },
  'description':{
    type: String,
    label: 'The description of this issue'
  },
  createDate:{
    type: Date,
    label: "the create time of this issue",
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
  updateDate:{
    type: Date,
    label: "the time this issue updated",
    autoValue: function(){
        // console.log(this.field("lastUpdate").value);
        if(this.isInsert&&null==this.value)
            {
                return new Date();
            }
            else if(this.isUpdate&&null==this.value)
                return new Date();
            else if(null!=this.value)
                return this.value;
            else
                this.unset();
      }
  },
});

Issue.attachSchema(Schemas.IssueSchema);
