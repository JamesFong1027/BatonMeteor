Template.dataTitleDonutCard.onCreated(function() {
	
});

Template.dataTitleDonutCard.onRendered(function() {
	console.log(Template.instance().data);
	initDonut(Template.instance().data);
});

Template.dataTitleDonutCard.helpers({
	"participationInfo":function(){
		return Template.instance().data;
	}
});


function initDonut(participationInfo) {
  if (!!!participationInfo) return;

  if (participationInfo.target === 0 && participationInfo.attendTimes === 0 && participationInfo.selectedTimes === 0) {
    participationInfo.target = 1;
  } else if (participationInfo.target === 0 && (participationInfo.attendTimes !== 0 || participationInfo.selectedTimes !== 0)) {
    participationInfo.target = participationInfo.attendTimes + participationInfo.selectedTimes;
  }

  var data = [participationInfo.selectedTimes, participationInfo.attendTimes - participationInfo.selectedTimes, participationInfo.target - participationInfo.attendTimes];
  if (!!participationInfo && (participationInfo.target < participationInfo.attendTimes)) {
    data = [participationInfo.target, 0];
  }

  console.log(data);
  var donutWidth = $(".general_summary_chart").height() * 0.3;
  var summaryPie = new Chartist.Pie('.general_summary_chart', {
    series: data
  }, {
    height: '200%',
    donutWidth: donutWidth,
    donut: true,
    startAngle: 270,
    total: participationInfo.target * 2,
    showLabel: true,
    labelInterpolationFnc: function(value, index) {
      var total = summaryPie.data.series.reduce(function(pv, cv) {
        return pv + cv;
      }, 0);
      if (index === 0)
        return Math.round(participationInfo.attendTimes / participationInfo.target * 100) + "%";
    }
  });

  // summaryPie.on('created', function() {
  //   var chartEl = $('.ct-chart-donut');
  //   chartEl.removeAttr('style');
  //   chartEl.height(chartEl.height() / 1.5);
  // });

  summaryPie.on('draw', function(ctx) {
    if (ctx.type === 'label') {
      ctx.element.addClass("ct-label-pie");
      if (ctx.index === 0) {
        ctx.element.attr({
          dx: ctx.element.root().width() / 2,
          dy: ctx.element.root().height() / 2,
          "id": "ct-label-pie-" + ctx.index
        });
      }
    } else if (ctx.type === 'slice') {
      ctx.element.attr({
        'id': "ct-slice-pie-" + ctx.index
      });
      donutDisplayAnimation(ctx, 800);
    }
  });
}

function donutDisplayAnimation(ctx, duration) {
  if (!!!duration) duration = 1000;
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
      to: '0px',
      easing: Chartist.Svg.Easing.easeOutQuint,
      // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
      fill: 'freeze'
    }
  };

  // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
  if (ctx.index !== 0) {
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