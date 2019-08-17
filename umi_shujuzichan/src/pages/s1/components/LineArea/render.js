import d3 from 'd3';
import moment from 'moment';
// import { isAbsolute } from 'path';

const drawChart = (container, data, chooseNum, option) => {
  const {
    width = 1300,
    height = 460,
    top = 1600,
    left = 100,
    paddingTop = 40,
    paddingBottom = 50,
    paddingRight = 80,
    textColor = '#DCF4FD',
    axisLeft = 10,
    circleY = 26,
    id = 1,
    limit = 7,
  } = option || {};
  let {
    paddingLeft = 100,
  } = option || {};

  const max = d3.max(data, d => Number(d.y)) || 0;
  const len = max.toString().length;
  paddingLeft = len * 29 > paddingLeft ? len * 29 : paddingLeft;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  d3.select(container).select(`.svgBlock${id}`).remove();

  // 处理数据
  const wScale = d3.scale.linear()
    .domain([0, data.length - 1])
    .range([0, chartWidth - 0]);

  // 创建svg------------------------------
  const svg = d3.select(container)
    .append('div')
    .attr({
      class: `svgBlock${id}`,
    })
    .append('svg')
    .attr({
      width,
      height,
    });

  // 创建复用元素----------------------------
  const defs = svg.append('defs');
  const linearGradient2 = [
    { offset: '0', color: '#0266FF', opacity: 1 }, // 右边
    { offset: '50%', color: '#06CBFF', opacity: 1 },
    { offset: '100%', color: '#72E3A7', opacity: 1 },
  ];
  defs.append('linearGradient')
    .attr({
      id: 'sentiment-line-gra4',
      x1: '100%',
      y1: 0,
      x2: 0,
      y2: 0,
    })
    .selectAll('stop')
    .data(linearGradient2)
    .enter()
    .append('stop')
    .attr({
      offset: d => d.offset,
      'stop-color': d => d.color,
      'stop-opacity': d => d.opacity,
    });
  // 制作rect以完成动效加载
  defs.append('clipPath')
    .attr({
      id: `se-transition${id}`,
    })
    .append('rect')
    .attr({
      x: 0,
      y: 0,
      width: 0,
      height: chartHeight,
    })
    .transition()
    .ease('linear')
    .duration(2000)
    .attr({
      width: chartWidth,
    });

  // 创建y轴-------------------------------
  const hScale = d3.scale.linear()
    .domain([0, max * 1.2])
    .range([chartHeight, 0]);
  const yAxis = d3.svg.axis()
    .scale(hScale)
    .ticks(6)
    .orient('left');
  const yAxisG = svg.append('g')
    .attr({
      class: 'yAxis',
      transform: `translate(${paddingLeft}, ${paddingTop})`,
    })
    .call(yAxis);
  yAxisG.selectAll('.tick')
    .select('line') // y轴背景虚线
    .attr({
      x1: 0,
      y1: 0,
      x2: chartWidth,
      y2: 0,
      stroke: '#AFE1FF',
      'stroke-width': 2,
      opacity: 0.2,
      'stroke-dasharray': 8,
    });
  yAxisG.selectAll('.yAxis text') // 移动y轴label位置
    .attr({
      // dy: '-.5em',
      dx: -axisLeft,
    });
  // y轴单位
  svg.append('text')
    .attr({
      x: width - paddingRight,
      y: paddingTop - 12,
      'font-size': 28,
      fill: '#BCDBFF',
      'text-anchor': 'end',
    })
    .text(`单位：${data[0].unit}`);
  // 创建x轴-------------------------------
  const xAxis = d3.svg.axis()
    .scale(wScale)
    .orient('top')
    .tickValues(d3.range(data.length))
    // .tickPadding(-margin)
    .tickFormat(d => {
      const divide = Math.ceil(data.length / limit);
      if ((data.length > limit && !(d % divide)) || data.length <= limit) {
        // if (data[d].num === 1) {
        //   return data[d].w
        // } else if (data[d].num === 2) {
        //   return moment(data[d].x).format('YY/MM')
        // }
        return data[d].num === 2 ? moment(data[d].x).format('YY/MM') : moment(data[d].x).format('YY/MM/DD');
      }
    }); // 为周的时候显示第几周，其他显示日期
  svg.append('g')
    .attr({
      class: 'xAxis',
      transform: `translate(${paddingLeft}, ${height})`,
    })
    .call(xAxis);
  // 折线图area部分-------------------------------------------
  const linearGradient = [
    { offset: '0', color: '#2F50D2', opacity: 0 },
    { offset: '100%', color: '#06CBFF', opacity: 0.4 },
  ];
  defs.append('linearGradient')
    .attr({
      id: 'sentiment-line-gra3',
      x1: 0,
      y1: '100%',
      x2: 0,
      y2: 0,
    })
    .selectAll('stop')
    .data(linearGradient)
    .enter()
    .append('stop')
    .attr({
      offset: d => d.offset,
      'stop-color': d => d.color,
      'stop-opacity': d => d.opacity,
    });
  const area = d3.svg.area()
    .interpolate('monotone')
    .x((d, i) => wScale(i))
    .y0(chartHeight)
    .y1(d => hScale(d.y));
  svg.append('g')
    .attr({
      class: 'area',
      transform: `translate(${paddingLeft}, ${paddingTop})`,
    })
    .append('path')
    .attr({
      d: area(data),
      fill: 'url(#sentiment-line-gra3)',
      'clip-path': `url(#se-transition${id})`,
    });
  // 黑色线条-----------------------------------
  svg.selectAll('.isolateLine')
    .data(data)
    .enter()
    .append('rect')
    .attr({
      class: 'isolateLine',
      x: (d, i) => (wScale(i) + paddingLeft) - 2,
      y: (d) => hScale(d.y) + paddingTop,
      width: 4,
      height: (d) => chartHeight - hScale(d.y),
      fill: '#000',
      opacity: 0.2,
    })
  // 折线图曲线-------------------------------------------
  const line = d3.svg.line()
    .interpolate('monotone')
    .x((d, i) => wScale(i))
    .y(d => hScale(d.y));
  const aa = svg.append('g')
    .attr({
      class: 'line',
      transform: `translate(${paddingLeft}, ${paddingTop})`,
    });
  const lines = aa.append('path')
    .attr({
      d: line(data),
      fill: 'none',
      stroke: 'url(#sentiment-line-gra4)',
      'stroke-width': 8,
      'clip-path': `url(#se-transition${id})`,
    });
  console.log(lines, lines.node());
  // trigger线和遮罩-------------------------------------------
  const groups = svg.append('g')
    .attr({
      class: `iconInfo${id}`,
    });
  // trigger线右边方块渐变遮罩-------------------------------------------
  const linearGradientTrigger = [
    { offset: '0', color: '#00B9F8', opacity: 0 },
    { offset: '100%', color: '#00B9F8', opacity: 1 },
  ];
  defs.append('linearGradient')
    .attr({
      id: 'lineAreaTrigger',
      x1: '100%',
      y1: 0,
      x2: 0,
      y2: 0,
    })
    .selectAll('stop')
    .data(linearGradientTrigger)
    .enter()
    .append('stop')
    .attr({
      offset: d => d.offset,
      'stop-color': d => d.color,
      'stop-opacity': d => d.opacity,
    });
  groups.append('rect')
    .attr({
      x: 4 + wScale(chooseNum) + paddingLeft,
      y: paddingTop,
      width: chooseNum === data.length ? 0 : wScale(1),
      height: height - paddingBottom - paddingTop,
      fill: 'url(#lineAreaTrigger)',
      opacity: 0.2,
      class: 'triggerarea',
    })
  // trigger线-------------------------------------------
  groups.append('path')
    .attr({
      d: `M${wScale(chooseNum) + paddingLeft},${paddingTop} L${wScale(chooseNum) + paddingLeft},${(height - paddingBottom)}`,
      fill: 'none',
      stroke: textColor,
      'stroke-width': 4,
      class: 'triggerline',
    });
  groups.append('circle')
    .attr({
      cy: hScale(data[chooseNum].y) + circleY,
      cx: wScale(chooseNum) + paddingLeft,
      r: 20,
      fill: textColor,
      stroke: '#333',
      'stroke-width': 6,
      class: 'triggerCircle',
    });
  // tooltip-----------------------------------
  d3.select(`.svgBlock${id}`).selectAll('.tooltip').remove();
  let tooltip;
  const createTooltip = (index) => {
    const dy = hScale(data[index].y) > (chartHeight / 5) * 2 ? -110 : 90;
    tooltip = d3.select(`.svgBlock${id}`)
      .append('div')
      .attr({
        class: 'tooltip',
        'text-anchor': 'middle',
      })
      .style({
        position: 'absolute',
        opacity: 0,
        top: `${hScale(data[index].y) + paddingTop + dy}px`,
        left: `${wScale(index) + paddingLeft}px`,
        transform: 'translate(-50%, -50%)',
        'white-space': 'nowrap',
        'font-size': '28px',
        background: 'rgba(0, 0, 0, .4)',
        padding: '10px 24px',
        color: '#fff',
      })
      .html(() => {
        const statics = `数据：${data[index].y}${data[index].unit}<br/>`;
        let time
        if (data[index].num === 1) {
          // if (index === 0 && data.length > 1) {
          //   const lastDay = moment(data[index].x).subtract(6, 'days').format('YYYY-MM-DD');
          //   time = `时间：${lastDay}~${data[index].x}`
          // } else if (moment(data[index].x).weekday() !== 0) {
          //   time = `时间：${data[index].x}`
          // } else {
          //   time = `${data[index - 1].x}~${data[index].x}`
          // }
          time = `时间：${data[index].x}`
        } else if (data[index].num === 0) {
          time = `时间：${data[index].x}`
        } else if (data[index].num === 2) {
          time = `时间：${data[index].x}`
        }
        return `${statics}${time}`
      })
    return tooltip
  }
  createTooltip(chooseNum).style('opacity', 1);
  // 交互，轴线移动-----------------------------------
  svg.selectAll('.triggerRect')
    .data(data)
    .enter()
    .append('rect')
    .attr({
      class: 'triggerRect',
      x: (d, i) => (wScale(i) + paddingLeft) - (chartWidth / data.length / 2),
      y: paddingTop,
      width: chartWidth / data.length,
      height: height - paddingTop,
      // fill: 'red',
      // opacity: 0.5,
      fill: 'transparent',
    })
    .style({
      cursor: 'pointer',
    })
    .on('mouseover', () => {
      const index = d3.event.offsetX >= (chartWidth + paddingLeft) ? wScale.invert(chartWidth) : wScale.invert(d3.event.offsetX - paddingLeft)
      const indexNum = Math.round(index)
      d3.select(`.iconInfo${id} .triggerline`)
        .transition()
        .ease('linear')
        .duration(500)
        .attr({
          d: `M${wScale(indexNum) + paddingLeft},${paddingTop} L${wScale(indexNum) + paddingLeft},${(height - paddingBottom)}`,
        });
      d3.select(`.iconInfo${id} .triggerarea`)
        .transition()
        .ease('linear')
        .duration(500)
        .attr({
          x: 2 + wScale(indexNum) + paddingLeft,
          y: paddingTop,
        });
      d3.select(`.iconInfo${id} .triggerCircle`)
        .transition()
        .ease('linear')
        .duration(500)
        .attr({
          cy: hScale(data[indexNum].y) + circleY,
          cx: wScale(indexNum) + paddingLeft,
        });
      tooltip.remove()
      createTooltip(indexNum)
        .transition()
        .delay(500)
        .ease('linear')
        .duration(500)
        .style({
          opacity: 1,
        })
    });
};

export default drawChart;
