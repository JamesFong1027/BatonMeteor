PushHelper = {
    sendNotification : function (text,title,userId) {
        var badge = 1;
        Push.send({
            from: 'push',
            title: title,
            text: text,
            badge: badge,
            query: {
                userId: userId //this will send to a specific Meteor.user()._id
            },
            // payload:{
            //   type:
            // }
            //TODO add a random int
            notId:_.random(0,100000),
        });
        console.log("notification sent");
    }    
}

  

