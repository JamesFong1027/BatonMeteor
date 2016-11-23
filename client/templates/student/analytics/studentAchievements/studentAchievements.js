Template.studentAchievements.onCreated(function(){

});

Template.studentAchievements.onRendered(function(){
  Tracker.autorun(function(c) {
    initSummaryInfo();
  });
});

Template.studentAchievements.helpers({
  "afterRenderTrigger":function(){
    var data = [];
    var goalNum = this.target;
    var totalTimes = this.participation.attendTimes;
    var acceptedTimes = this.participation.selectedTimes;
    var chartCssId = this._id;
    var chartSelector = "#"+chartCssId;
    if(goalNum===0) return;
    var chartTotalNum = goalNum;

    BlazeTemplateHelper.fireWhenReady(function(template){
      if(totalTimes > goalNum) {
        chartTotalNum = totalTimes;
      }
      data = [acceptedTimes, totalTimes - acceptedTimes, chartTotalNum - totalTimes];

      template.$(chartSelector).empty();
      
      var classPie = new Chartist.Pie(chartSelector, {
        series: data
      }, {
        donut: true,
        total: chartTotalNum,
        startAngle: 0,
        showLabel: true,
        labelInterpolationFnc: function(value,index) {
            var total = classPie.data.series.reduce(function(pv, cv) { return pv + cv; }, 0);
            // return value+ " "+ Math.round(classPie.data.series[index]/total*100)+"%"
            if(index===0)
              return Math.round(totalTimes/goalNum*100)+"%";
            else
              return "Completed";
        }
      });

      classPie.on('draw', function(ctx) {
        if(ctx.type === 'label') {
            ctx.element.addClass("ct-label-pie");
            if(ctx.index === 0){
              ctx.element.attr({
                  dx: ctx.element.root().width() / 2,
                  dy: ctx.element.root().height() / 2,
                  "id": "ct-label-pie-"+ctx.index
              });  
            } else {
              ctx.element.addClass("ct-label-subtitle");
              ctx.element.attr({
                  dx: ctx.element.root().width() / 2,
                  dy: (ctx.element.root().height()/2) + ctx.element.height()/1.2,
                  "id": "ct-label-pie-"+ctx.index
              });  
            }
            
        }else if(ctx.type === 'slice'){
            ctx.element.attr({
                'id' : "ct-slice-pie-"+ctx.index
            });

            // if(ctx.index === 2) return;
            // donutDisplayAnimation(ctx,800);
        }
      });
    },Template.instance(),chartSelector, 500);
  },
  studentClassAchievements: function () {
    return fetchClassAchievements();
  },
  summaryInfo: function(){
    return fetchSummaryAchievement();
  },
  hasUntrackedClassroom: function(){
    return AnalyticSpider.getUntrackedClassroomList().count() !== 0;
  },
  moreopId: function(id){
    return "more-op-"+id;
  }
});

Template.studentAchievements.events({
  "click .more-op":function(){
    console.log(this._id);
    IonPopover.show("classAchievementMenu", this, "#more-op-"+this._id);
  },
  "click .add_goal":function(event,template){
    var achievementId = this._id;
    IonPopup.prompt({
      title: TAPi18n.__("set_goal_popup_title"),
      template: TAPi18n.__("set_goal_popup_content"),
      okText: TAPi18n.__("popup_submit_button"),
      cancelText:TAPi18n.__("popup_cancel_button"),
      inputType: 'number',
      inputPlaceholder: TAPi18n.__("set_goal_popup_placeholder"),
      onOk: function(event, value) {
        AnalyticSpider.editClassAchievement(achievementId, value);
      }
    });
  },
  "click .add_class": function(event, template){
    IonModal.open("classroomPickList");
  },
})

Template.studentAchievements.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});

function fetchClassAchievements(){
  // right now we fetch all the participation info
  return AnalyticSpider.getAchievementsWithRelativeInfo();
}

function fetchSummaryAchievement(){
  var achievements = fetchClassAchievements();
  var summaryInfo = new Object();
  var attendTimes = 0;
  var selectedTimes = 0;
  var totalTarget = 0;
  for (var i = achievements.length - 1; i >= 0; i--) {
    attendTimes += achievements[i].participation.attendTimes;
    selectedTimes += achievements[i].participation.selectedTimes;
    totalTarget += parseInt(achievements[i].target);
  }
  summaryInfo.attendTimes = attendTimes;
  summaryInfo.selectedTimes = selectedTimes;
  summaryInfo.target = totalTarget;
  return summaryInfo;
}

function initSummaryInfo(){
  var summaryInfo = fetchSummaryAchievement();
  if(!!!summaryInfo) return;

  if(summaryInfo.target === 0 && summaryInfo.attendTimes === 0 && summaryInfo.selectedTimes === 0){
    summaryInfo.target = 1;
  } else if(summaryInfo.target === 0 && (summaryInfo.attendTimes !== 0 || summaryInfo.selectedTimes !== 0)){
    summaryInfo.target = summaryInfo.attendTimes + summaryInfo.selectedTimes;
  }

  var data = [summaryInfo.selectedTimes, summaryInfo.attendTimes - summaryInfo.selectedTimes, summaryInfo.target-summaryInfo.attendTimes];
  if(!!summaryInfo && (summaryInfo.target < summaryInfo.attendTimes)){
    data = [summaryInfo.target,0];
  }

  console.log(data);
  var donutWidth = $(".general_summary_chart").height()*0.3;
  var summaryPie = new Chartist.Pie('.general_summary_chart', {
    series: data
  }, {
    height:'200%',
    donutWidth: donutWidth,
    donut: true,
    startAngle: 270,
    total: summaryInfo.target * 2,
    showLabel: true,
    labelInterpolationFnc: function(value,index) {
        var total = summaryPie.data.series.reduce(function(pv, cv) { return pv + cv; }, 0);
        if(index===0)
          return Math.round(summaryInfo.attendTimes/summaryInfo.target*100)+"%";
    }
  });

  // summaryPie.on('created', function() {
  //   var chartEl = $('.ct-chart-donut');
  //   chartEl.removeAttr('style');
  //   chartEl.height(chartEl.height() / 1.5);
  // });

  summaryPie.on('draw', function(ctx) {
    if(ctx.type === 'label') {
        ctx.element.addClass("ct-label-pie");
        if(ctx.index === 0){
          ctx.element.attr({
              dx: ctx.element.root().width() / 2,
              dy: ctx.element.root().height() / 2,
              "id": "ct-label-pie-"+ctx.index
          });  
        }
    }else if(ctx.type === 'slice'){
        ctx.element.attr({
            'id' : "ct-slice-pie-"+ctx.index
        });
        donutDisplayAnimation(ctx,800);
    }
  });
}

function donutDisplayAnimation(ctx, duration){
  if(!!!duration) duration = 1000;
  // Get the total path length in order to use for dash array animation
  var pathLength = ctx.element._node.getTotalLength();

  // Set a dasharray that matches the path length as prerequisite to animate dashoffset
  ctx.element.attr({
    'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
  });

  // Create animation definition while also assigning an ID to the animation for later sync usage
  var animationDefinition = {
    'stroke-dashoffset': {
      id: 'anim' + ctx.index,
      dur: duration,
      from: -pathLength + 'px',
      to:  '0px',
      easing: Chartist.Svg.Easing.easeOutQuint,
      // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
      fill: 'freeze'
    }
  };

  // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
  if(ctx.index !== 0) {
    animationDefinition['stroke-dashoffset'].begin = 'anim' + (ctx.index - 1) + '.end';
  }

  // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
  ctx.element.attr({
    'stroke-dashoffset': -pathLength + 'px'
  });

  // We can't use guided mode as the animations need to rely on setting begin manually
  // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
  ctx.element.animate(animationDefinition, false);
}
