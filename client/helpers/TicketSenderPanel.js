TicketSenderPanel = function (template){
  this.template = template;
  this.offsetAngle = 0;
  // this.carouselSize = {
  //   w: this.carouselBoundingRect.width,
  //   h: this.carouselBoundingRect.height,
  //   radius: this.carouselBoundingRect.width / 2,
  //   circle: this.circles[0].getBoundingClientRect().width
  // };
  // this.carouselConfig = {
  //   autoRotate: true,
  //   autoAddCircle: true,
  //   interval: null,
  //   turn: 'circle'
  // };
  this.init=function(){    
    this.circles = template.$('.circle');
    
    if(0===this.circles.length)
      return;
    this.setPosition();
    // this.update();

    // Set random colors
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].style.background = this.randomFlatColor();
    };
  };

  this.setPosition=function() {
    this.carousel = template.$("#carousel")[0];
    this.circles = this.template.$(".circle");
    this.carouselBoundingRect = this.carousel.getBoundingClientRect();

    this.carouselSize = {
      w: this.carouselBoundingRect.width,
      h: this.carouselBoundingRect.height,
      radius: this.carouselBoundingRect.width / 2,
      circle: this.circles[0].getBoundingClientRect().width
    };

    for (var i = 0; i < this.circles.length; i++) {

      var angle = (360 / this.circles.length) * i + this.offsetAngle;

      var transformY = Math.sin(Math.radians(angle)) * this.carouselSize.radius - this.carouselSize.circle / 2 + "px";
      var transformX = Math.cos(Math.radians(angle)) * this.carouselSize.radius - this.carouselSize.circle / 2 + "px";
      
      window.getComputedStyle(this.circles[i]).transform;
      this.circles[i].style.transform = "translate3d(" + transformX + ", " + transformY + ", 0)";
      this.circles[i].style.opacity = 1;
    }
  };
  // this.update=function() {
  //   this.carouselConfig.interval = (function createInterval(rotate,carouselConfig,circles) {
  //     return setInterval(function() {
  //       if (carouselConfig.turn === "circle" && carouselConfig.autoRotate) {
  //         rotate();
  //       } else if (carouselConfig.autoAddCircle && circles.length < 150) {
  //         addCircle();
  //       }
  //       carouselConfig.turn = (carouselConfig.turn == 'circle') ? 'rotate' : 'circle';

  //     }, 1000);
  //  })(this.rotate,this.carouselConfig,this.circles);
  // };
  this.rotate=function() {

    this.offsetAngle += (360 / this.circles.length);

    if (this.offsetAngle > 360)
      this.offsetAngle -= 360;

    this.setPosition();
  };
  this.addCircle=function(id,ticketInfo,isSelf) {
    var circleClass = "circle";
    if(isSelf)
      circleClass+= " self";

    this.container = template.$(".container")[0];
    this.circlesCounter = template.$("#circles-counter")[0];
    this.container.innerHTML += "<div class='"+circleClass+"' id="+id+"></div>";

    if(isSelf)
    {
      switch(ticketInfo.ticketContent){
        case Schemas.talkTicketValue.buildOn:
          template.$("#"+id).append("<a class='icon "+GlobalVar.intentIcon.buildOn+"'></a>");
          break;
        case Schemas.talkTicketValue.newIdea:
          template.$("#"+id).append("<a class='icon "+GlobalVar.intentIcon.newIdea+"'></a>");
          break;
        case Schemas.talkTicketValue.challenge:
          template.$("#"+id).append("<a class='icon "+GlobalVar.intentIcon.challenge+"'></a>");
          break;
        case Schemas.talkTicketValue.question:
          template.$("#"+id).append("<a class='icon "+GlobalVar.intentIcon.question+"'></a>");
          break;
      }
      template.$("#"+id).css("background-color","#33CD5F");
    }

    
    this.circlesCounter.innerHTML = "<span style='color :" + this.randomFlatColor() + "'>" + (this.circles.length + 1) + " circles</span>"
    this.setPosition();
  };
  this.removeCircle=function(id){
    template.$("#"+id).remove();
  }
  this.onKeyDown=function(ev) {
    if (ev.keyCode === 13) {
      this.addCircle();
    } else if (ev.keyCode === 32) {
      this.rotate();
    }

    clearTimeout(this.carouselConfig.interval);
    this.update();
  };
  /*
 * Utils
 */

  this.randomFlatColor=function() {
    var flatColors = ["#1abd9d", "#2ecc71", "#3498db", "#9b59b6", "#19b496", "#27ae60", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"];
    return flatColors[Math.floor(Math.random() * flatColors.length)];
  }
}











