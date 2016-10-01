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
    var achieveNum = this.participation.attendTimes;
    var chartCssId = this._id;
    var chartSelector = "#"+chartCssId;
    if(goalNum===0) return;    

    BlazeTemplateHelper.fireWhenReady(function(template){
      if(achieveNum > goalNum) {
        data = [100,0];
      } else {
        data = [achieveNum, goalNum - achieveNum];
      }

      template.$(chartSelector).empty();
      
      var classPie = new Chartist.Pie(chartSelector, {
        series: data
      }, {
        donut: true,
        total: goalNum,
        startAngle: 0,
        showLabel: true,
        labelInterpolationFnc: function(value,index) {
            var total = classPie.data.series.reduce(function(pv, cv) { return pv + cv; }, 0);
            // return value+ " "+ Math.round(classPie.data.series[index]/total*100)+"%"
            if(index===0)
              return Math.round(classPie.data.series[index]/total*100)+"%";
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
    return ClassroomKicker.getUntrackedClassroomList().count() !== 0;
  },
  moreopId: function(id){
    return "more-op-"+id;
  }
});

Template.studentAchievements.events({
  "click .more-op":function(){
    console.log(this._id);
    IonPopover.show("classAchievementMenu", this._id, "#more-op-"+this._id);
  },
  "click .add_goal":function(event,template){
    var achievementId = this._id;
    IonPopup.prompt({
      title: 'Setup goal',
      template: 'Please enter your weekly goal',
      okText: 'Submit',
      inputType: 'number',
      inputPlaceholder: 'Your goal in number',
      onOk: function(event, value){
        ClassroomKicker.editClassAchievement(achievementId,value);
      }
    });
  },
  "click .add_class": function(event, template){
    IonModal.open("classroomPickList");
  }
})

Template.studentAchievements.onDestroyed(function(){
	// console.log("onDestroyed");
	// console.log(Template.instance());
	// Template.instance().qrScanner.stopCapture();
});

function fetchClassAchievements(){
  // right now we only fetch current week data
  return ClassroomKicker.getAchievementsWithRelativeInfo(moment().startOf('week').toDate(),moment().endOf('week').toDate());
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

  var data = [summaryInfo.attendTimes, summaryInfo.target-summaryInfo.attendTimes];
  if(!!summaryInfo && (summaryInfo.target < summaryInfo.attendTimes)){
    data = [summaryInfo.target,0];
  }

  console.log(data);
  var donutWidth = $(".weekly_summary_chart").height()*0.3;
  var summaryPie = new Chartist.Pie('.weekly_summary_chart', {
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
          return Math.round(summaryPie.data.series[index]/total*100)+"%";
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

    }
  });
}
