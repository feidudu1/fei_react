/* eslint-disable */
import d3 from 'd3';
import pieIcon from '../../../../assets/img/s1/pieIcon.svg';

function render(eleContainer, data, options = {}) {
  // data = [
  //   {
  //     department: '杭州海关1',
  //     number: 200,
  //     ratio: 0.017752431,
  //   },
  //   {
  //     department: '作物2',
  //     number: 180,
  //     ratio: 0.001998883,
  //   },
  //   {
  //     department: '作物3',
  //     number: 160,
  //     ratio: -0.029863089,
  //   },
  //   {
  //     department: '作物4',
  //     number: 140,
  //     ratio: 0.101899027,
  //   },
  //   {
  //     department: '作物5',
  //     number: 120,
  //     ratio: 0.017752431,
  //   },
  //   {
  //     department: '作物6',
  //     number: 100,
  //     ratio: 0.001998883,
  //   },
  //   {
  //     department: '作物7',
  //     number: 80,
  //     ratio: -0.029863089,
  //   },
  //   {
  //     department: '省国税局8',
  //     number: 60,
  //     ratio: 0.101899027,
  //   },
  //   {
  //     department: '作物9',
  //     number: 40,
  //     ratio: -0.029863089,
  //   },
  //   {
  //     department: '作物10',
  //     number: 20,
  //     ratio: 0.101899027,
  //   },
  // ];
  const {
    paddingTop = 10,
    paddingRight = 5,
    paddingBottom = 10,
    paddingLeft = 20,
    width = 750,
    height = 700,
    rectPaddingLeft = 16,
  } = options || {};


  d3.select(eleContainer).select('svg').remove();

  const cw = width - paddingLeft - paddingRight;
  const ch = height - paddingTop - paddingBottom;
  const cr = Math.min(cw, ch) / 2;
  const innerR1 = 0.45 * cr;
  const outerR1 = 0.55 * cr;
  const radius = 0.35 * cr;

  const svg = d3.select(eleContainer)
    .append('svg')
    .attr({
      width: width,
      height: height,
    })
    .append('g')
    .attr({
      class: 'svg-container',
    });
  const chartContainer = svg.append('g')
    .attr({
      class: 'chart-container',
      fill: 'none',
      'stroke-linecap': 'round',
      transform: `translate(${paddingLeft + (cw / 2)}, ${paddingTop + (ch / 2)})`,
    });
  const defs = svg.append('defs');
  
  // 上下icon徽章--------------------------
  const iconWidth = 64 * 1.2
  const inconHeight = 50 * 1.2
  chartContainer.append('image')
    .attr({
      class: 'pieIcon1',
      'xlink:href': pieIcon,
      x: -iconWidth / 2,
      y: -inconHeight / 2,
      width: iconWidth,
      height: inconHeight,
      opacity: 0,
    })
    .style({
      'transform-origin': '50% 50%',
    })
    .transition()
    .duration(2000)
    .attr({
      transform: `translate(0,-${cw/2 - 90})`,
      opacity: 1,
    });
  chartContainer.append('image')
    .attr({
      class: 'pieIcon2',
      'xlink:href': pieIcon,
      x: -iconWidth / 2,
      y: -inconHeight / 2,
      width: iconWidth,
      height: inconHeight,
      opacity: 0,
      transform: 'rotate(180)',
    })
    .transition()
    .duration(2000)
    .attr({
      transform: `translate(0,${cw / 2 - 90}) rotate(180)`,
      opacity: 1,
    });

  // 画内部圈背后的晕光--------------------------
  chartContainer.append('foreignObject')
    .attr({
      class: 'blur',
    })
    .style({
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      'border-radius': '50%',
      'box-shadow': '0px 0px  40px rgba(0, 221, 252, .5), inset 0px 0px 40px rgba(0, 221, 252, .5)',
      transform: `translate(-${radius}px,-${radius}px)`,
    })
  // 画内部的圈--------------------------
  const gradient = [
    { offset: '0', color: '#06CBFF', opacity: 1 },
    { offset: '100%', color: '#2F50D2', opacity: 1 },
  ]
  defs.append('linearGradient')
    .attr({
      id: 'line-gradient',
      x1: '100%',
      y1: 0,
      x2: 0,
      y2: 0,
    })
    .selectAll('stop')
    .data(gradient)
    .enter()
    .append('stop')
    .attr({
      offset: d => d.offset,
      'stop-color': d => d.color,
      'stop-opacity': d => d.opacity,
    })
  chartContainer.append('circle')
    .attr({
      class: 'circle',
      r: radius,
      stroke: 'url(#line-gradient)',
      'stroke-width': 12,
    })
  // 画饼图--------------------------
  const pie = d3.layout.pie()
    .value(({ number }) => number)
    .sort(null);
  const pieData = pie(data);
  chartContainer.selectAll('path.arc-data')
    .data(pieData)
    .enter()
    .append('path')
    .attr({
      d: drawArc(innerR1, outerR1),
      fill: 'rgba(0, 185, 248, .2)'
    })

  // 画饼图active部分--------------------------
  let index = 0

  let arc1 = d3.svg.arc()
    .innerRadius(innerR1)
    .outerRadius(outerR1)
    .startAngle(({ startAngle }) => startAngle + 0.015) // 饼图的缝隙
    .endAngle(({ endAngle }) => endAngle - 0.015);
  let arc2 = d3.svg.arc()
    .innerRadius(innerR1 * 1.1)
    .outerRadius(outerR1 * 1.12)
    .startAngle(({ startAngle }) => startAngle + 0.015) // 饼图的缝隙
    .endAngle(({ endAngle }) => endAngle - 0.015);

  const active = chartContainer.append('g')
    .attr({
      class: 'active'
    })
  // active外圈
  const activePieOut = active
    .append('path')
    .attr({
      class: 'activePieOut',
      fill: 'red',
      fill: 'rgba(0, 185, 248, .2)',
      d: d => arc2(pieData[index])
    })
  //pie图的active部分
  const activePie = active
    .append('path')
    .attr({
      class: 'activePie',
      fill: '#00B9F8',
      d: d => arc1(pieData[index])
    })
  // 饼图中间变化的文字
  drawCenterText();
  function drawCenterText() {
    let dataItem = data[index]
    let dataArr = []
    for (const it in dataItem) {
      if (it === 'ratio') {
        dataArr.push({unit: dataItem.unit || '条'})
      } else if(it !== 'number') {
        dataArr.push({ [it]: dataItem[it] })
      }
    }
    svg.selectAll('.activeText').remove()
    active.append('g')
      .attr({
        class: 'activeText'
      })
      .selectAll('.activeTspan')
      .data(dataArr)
      .enter()
      .append('text')
      .attr({
        class: 'activeTspan',
        'text-anchor': 'middle',
        x: 0,
        dy: (d, i) => `${Object.keys(d)[0] === 'department' ? -45 : Object.keys(d)[0] === 'transNum' ? 35 : 80}`,
        fill: (d, i) => Object.keys(d)[0] === 'transNum' ? '#fff' : '#DCF4FD',
        'font-size': (d, i) => Object.keys(d)[0] === 'transNum' ? 76 : 36,
      })
      .text(d => Object.values(d)[0])
  }

  // 静态文字--------------------------
  const textGroup = svg.append('g')
    .attr({
      class: 'textGroup'
    })
  textGroup.selectAll('.textStatic')
    .data(data)
    .enter()
    .append('text')
    .attr({
      // class: (d, i) => `textStatic`,
      class: (d, i) => `textStatic${i} textStatic`,
      y: (d, i) => (ch / 5) * (i % 5) + paddingTop,
      'text-anchor': (d, i) => i > 4 ? 'end' : 'start',
    })
    .call((d, data) => {
      [1, 2].map(t => {
        d.append('tspan')
          .text((item, k) => {
            if (t === 1) {
              return item.department
            } else if (t === 2) {
              return item.ratio + '%'
            }
          })
          .attr({
            fill: t === 2 ? '#fff' : '#DCF4FD',
            class: 'textStaticTspan',
            x: (item, k) => k > 4 ? cw - paddingRight : paddingLeft,
            'font-size': t === 2 ? 40 : 28,
            dy: 50,
            dx: 0,
          })
      })
    }, data)
  // 移动的遮罩--------------------------
  const gradientCover = [
    { offset: '0', color: '#00B9F8', opacity: 0 },
    { offset: '100%', color: '#00B9F8', opacity: 0.2 },
  ]
  defs.append('linearGradient')
    .attr({
      id: 'gradientCover',
      x1: '100%',
      y1: 0,
      x2: 0,
      y2: 0,
    })
    .selectAll('stop')
    .data(gradientCover)
    .enter()
    .append('stop')
    .attr({
      offset: d => d.offset,
      'stop-color': d => d.color,
      'stop-opacity': d => d.opacity,
    })
  const coverWidth = (cw - cr * 2)
  const coverHeight = (ch / 5)
  const coverDash = 2 * coverWidth + coverHeight;

  var activeRect = svg.append('g')
    .append('rect')
    .attr({
      x: paddingLeft - rectPaddingLeft,
      y: paddingTop - 5,
      width: coverWidth,
      height: coverHeight,
      // fill: 'red',
      fill: 'url(#gradientCover)',
      stroke: '#00B9F8',
      'stroke-width': 4,
      'stroke-dasharray': `0, ${coverDash}, ${coverHeight}`,
    })
  // 动态效果--------------------------
  let clearInter
  if (index < data.length - 1) {
    clearInter = setInterval(change, 5000);
  }
  function change() {
    if (localStorage.getItem('s1pieinterval') === 'distory') {
      clearInterval(clearInter)
    }
    const currentIndex = index;
    index = (index + 1) % pieData.length;
    const nextIndex = index;
    drawCenterText();
    // 饼图轮询
    activePie.transition()
      .duration(2000)
      .attrTween('d', () => {
        const startAngleInterpolate = d3.interpolate(
          pieData[currentIndex].startAngle,
          (pieData[nextIndex].startAngle || 0) + (nextIndex ? 0 : 2 * Math.PI),
        );
        const endAngleInterpolate = d3.interpolate(
          pieData[currentIndex].endAngle,
          (pieData[nextIndex].endAngle || 0) + (nextIndex ? 0 : 2 * Math.PI),
        );
        return (t) => arc1({
          startAngle: startAngleInterpolate(t),
          endAngle: endAngleInterpolate(t),
        })
      })
    activePieOut.transition()
      .duration(2000)
      .attrTween('d', () => {
        const startAngleInterpolate = d3.interpolate(
          pieData[currentIndex].startAngle,
          (pieData[nextIndex].startAngle || 0) + (nextIndex ? 0 : 2 * Math.PI),
        );
        const endAngleInterpolate = d3.interpolate(
          pieData[currentIndex].endAngle,
          (pieData[nextIndex].endAngle || 0) + (nextIndex ? 0 : 2 * Math.PI),
        );
        return (t) => arc2({
          startAngle: startAngleInterpolate(t),
          endAngle: endAngleInterpolate(t),
        })
      })
    // 移动的方块
    let ddy
    if (nextIndex === 9) {
      ddy = - (ch / 5) * ((nextIndex) % 5 + 1) - 10
    } else if (nextIndex > 4) {
      ddy = - (ch / 5) * ((nextIndex) % 5 + 1) - 10
    } else if (nextIndex < 5) {
      ddy = (ch / 5) * ((nextIndex) % 5)
    }
    activeRect
      // .transition()
      // .duration(1000)
      // .attr({
      //   opacity: 0,
      // })
      // .transition()
      // .duration(500)
      .attr({
        transform: nextIndex > 4 ?
          `rotate(180) translate(-${cw - paddingRight + ((rectPaddingLeft - 5) * 2)}, ${ddy})`
          : `translate(${paddingLeft - ((rectPaddingLeft - 5) * 2)}, ${ddy})`,
          opacity: 0,
      })
      .transition()
      .duration(2000)
      .attr({
        opacity: 1,
      })
  }
}


function drawArc(inner, outer) {
  let arc = d3.svg.arc()
    .innerRadius(inner)
    .outerRadius(outer)
    .startAngle(({ startAngle }) => startAngle + 0.015)
    .endAngle(({ endAngle }) => endAngle - 0.015);
  return arc;
}

export default render;
