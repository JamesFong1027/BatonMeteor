TicketSenderPanel = function(template) {
  this.template = template;
  this.offsetAngle = 0;
  this.circleVisible = false;
  // this.carouselSize = {
  //   w: this.carouselBoundingRect.width,
  //   h: this.carouselBoundingRect.height,
  //   radius: this.carouselBoundingRect.width / 2,
  //   circle: this.circles[0].getBoundingClientRect().width
  // };
  this.carouselConfig = {
    autoRotate: true,
    interval: null,
    turn: 'circle'
  };

  this.hidePanel = function() {
    template.$('.circle').css({
      "transform": "translate3d(-40px, -40px, 0px)"
    });
    // template.$('.circle').animate({opacity:0},800,null);  
    template.$('.circle').css({
      "opacity": 0
    });
  }

  this.togglePanel = function(toggler) {
    this.circleVisible = toggler;
    if (toggler) {
      this.setPosition();
      template.$("#viewTitle").text("Classroom participation");
    } else {
      this.hidePanel();
      template.$("#viewTitle").text("Send your request");
    }
  };

  this.setPosition = function() {
    this.carousel = template.$("#carousel")[0];
    this.circles = this.template.$(".circle");
    this.carouselBoundingRect = this.carousel.getBoundingClientRect();

    if(this.circles.length==0){
      return;
    }

    this.carouselSize = {
      w: this.carouselBoundingRect.width,
      h: this.carouselBoundingRect.height,
      radius: this.carouselBoundingRect.width / 2,
      circle: this.circles[0].getBoundingClientRect().width
    };

    for (var i = 0; i < this.circles.length; i++) {
      // console.log(this.offsetAngle);
      var angle = (360 / this.circles.length) * i + this.offsetAngle;

      var transformY = Math.sin(Math.radians(angle)) * this.carouselSize.radius - this.carouselSize.circle / 2 + "px";
      var transformX = Math.cos(Math.radians(angle)) * this.carouselSize.radius - this.carouselSize.circle / 2 + "px";

      window.getComputedStyle(this.circles[i]).transform;
      this.circles[i].style.transform = "translate3d(" + transformX + ", " + transformY + ", 0)";
      this.circles[i].style.opacity = this.circleVisible ? 1 : 0;
    }
  };
  this.update = function() {
    this.carouselConfig.interval = (function createInterval(sendPanel) {
      return setInterval(function() {
        if (sendPanel.carouselConfig.turn === "circle" && sendPanel.carouselConfig.autoRotate) {
          sendPanel.rotate();
          sendPanel.setPosition();
        }
        sendPanel.carouselConfig.turn = (sendPanel.carouselConfig.turn == 'circle') ? 'rotate' : 'circle';
      }, 1000);
    })(this);
  };
  this.rotate = function() {
    this.circles = this.template.$(".circle");
    // console.log(this.circles.length);
    // console.log(this.offsetAngle);
    this.offsetAngle += (360 / 60);

    if (this.offsetAngle > 360)
      this.offsetAngle -= 360;
  };

  this.addCircle = function(id, ticketInfo, isSelf) {
    var circleClass = "circle";
    if (isSelf)
      circleClass += " self";

    // console.log(template);
    this.container = template.$(".container")[0];
    // this.circlesCounter = template.$("#circles-counter")[0];
    this.container.innerHTML += "<div class='" + circleClass + "' id=" + id + "></div>";

    if (isSelf) {
      var backgroundColor = "#03A9F4";
      switch (ticketInfo.ticketContent) {
        case Schemas.talkTicketValue.buildOn:
          template.$("#" + id).append("<a class='icon stable " + GlobalVar.intentIcon.buildOn + "'></a>");
          break;
        case Schemas.talkTicketValue.newIdea:
          template.$("#" + id).append("<a class='icon stable " + GlobalVar.intentIcon.newIdea + "'></a>");
          break;
        case Schemas.talkTicketValue.challenge:
          template.$("#" + id).append("<a class='icon stable " + GlobalVar.intentIcon.challenge + "'></a>");
          break;
        case Schemas.talkTicketValue.question:
          template.$("#" + id).append("<a class='icon stable " + GlobalVar.intentIcon.question + "'></a>");
          break;
        case "1":
          backgroundColor = "rgba(0,255,0, 0.2)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "2":
          backgroundColor = "rgba(60,255,0, 0.3)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "3":
          backgroundColor = "rgba(120,255,0, 0.4)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "4":
          backgroundColor = "rgba(180,255,0, 0.5)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "5":
          backgroundColor = "rgba(240,255,0, 0.6)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "6":
          backgroundColor = "rgba(255,240,0, 0.6)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "7":
          backgroundColor = "rgba(255,180,0, 0.6)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "8":
          backgroundColor = "rgba(255,120,0, 0.7)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "9":
          backgroundColor = "rgba(255,60,0, 0.8)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
        case "10":
          backgroundColor = "rgba(255,0,0, 0.9)";
          template.$("#" + id).append("<a class='icon button-icon'>" + ticketInfo.ticketContent + "</a>");
          break;
      }
      template.$("#" + id).css("background", backgroundColor);
    } else{
      // add participation buddy icon
      template.$("#" + id).append("<a class='icon dark ion-ios-body-outline'></a>");
    }
  };

  this.removeCircle = function(id) {
      template.$("#" + id).remove();
  };

  this.addClassroomWatcher = function(ticketType, curClassroomId){
    this.runWhenViewReady(function(){
      console.log("addClassroomWatcher");
      // if user enter the classroom, set the classroom id and mode
      Session.set("curClassroomId", curClassroomId);
      Session.set("curMode", ticketType);

      // add a auto run to watch classroom status
      Tracker.autorun(function(c) {


        var curClassroom = ClassroomKicker.getClassroomInfo(curClassroomId);
        if (!!!curClassroom)
          return;

        if (curClassroom.status !== Schemas.classroomStatus.close && !!Session.get("curClassroomId")) {

            console.log("create buddyListWatcher");
            if(!!template.buddyListWatcher) return;

            console.log("create new watcher");
            var buddyList = TicketShutter.getClassroomBuddyList(ticketType, curClassroomId);
            template.buddyListWatcher = buddyList.observeChanges({
              added: function(id, ticketInfo) {
                console.log(ticketInfo);
                template.sender.get().addCircle(id, ticketInfo, ticketInfo.uid === Meteor.userId());
                if (template.$(".menu-toggler:checked").size() === 0) {
                  template.sender.get().setPosition();
                }
              },
              removed: function(id) {
                console.log(id);
                template.sender.get().removeCircle(id);
              },
              changed: function(id, fields) {
                console.log(fields);
                if (isTicketBelongTo(Meteor.userId(), id)) {
                  template.sender.get().removeCircle(id);
                  var ticketInfo = TicketShutter.getTicketInfoByID(id);
                  template.sender.get().addCircle(id, ticketInfo, ticketInfo.uid === Meteor.userId());
                }
              }
            });
        } else {
          // if class is closed, reset the session and redirect to inital page
          Session.set("curClassroomId", undefined);
          Session.set("curMode", undefined);
          Router.go("studentTalk");
          c.stop();
          template.buddyListWatcher = null;
        }
      });
    });
  }

  this.removeClassroomWatcher = function(){
    if(!!template.buddyListWatcher){
      template.buddyListWatcher.stop();
      template.buddyListWatcher = null;  
    }
  }

  /*
   * Utils
   */
  this.randomFlatColor = function() {
    var flatColors = ["#1abd9d", "#2ecc71", "#3498db", "#9b59b6", "#19b496", "#27ae60", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"];
    return flatColors[Math.floor(Math.random() * flatColors.length)];
  }

  this.runWhenViewReady =function(fn){
    if(template.view.isRendered){
      fn();
    } else{
      template.view.onViewReady(function(){
        fn();
      });  
    }
    
  }
}