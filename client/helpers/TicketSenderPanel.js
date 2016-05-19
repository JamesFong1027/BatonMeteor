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
  this.init = function() {
    this.circles = template.$('.circle');

    if (0 !== this.circles.length) {
      console.log(this.circles.length);
    }
    // this.setPosition();
    // this.update();

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
    } else {
      this.hidePanel();
    }
  };

  this.setPosition = function() {
    this.carousel = template.$("#carousel")[0];
    this.circles = this.template.$(".circle");
    this.carouselBoundingRect = this.carousel.getBoundingClientRect();

    // if(this.circles.length==0){
    //   return;
    // }

    this.carouselSize = {
      w: this.carouselBoundingRect.width,
      h: this.carouselBoundingRect.height,
      radius: this.carouselBoundingRect.width / 2,
      circle: this.circles[0].getBoundingClientRect().width
    };

    for (var i = 0; i < this.circles.length; i++) {
      console.log(this.offsetAngle);
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
    console.log(this.circles.length);
    console.log(this.offsetAngle);
    this.offsetAngle += (360 / 60);

    if (this.offsetAngle > 360)
      this.offsetAngle -= 360;
  };

  this.addCircle = function(id, ticketInfo, isSelf) {
    var circleClass = "circle";
    if (isSelf)
      circleClass += " self";

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
    }
  };

  this.removeCircle = function(id) {
      template.$("#" + id).remove();
    }
    /*
     * Utils
     */

  this.randomFlatColor = function() {
    var flatColors = ["#1abd9d", "#2ecc71", "#3498db", "#9b59b6", "#19b496", "#27ae60", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"];
    return flatColors[Math.floor(Math.random() * flatColors.length)];
  }
}