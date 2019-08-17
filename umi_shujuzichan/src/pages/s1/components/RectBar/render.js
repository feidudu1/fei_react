import d3 from 'd3';
/* eslint-disable */
export default function render(id, data, option) {
  let {
    width,
    height,
    paddingTop,
    bgColor,
    color1,
    color2,
    left,
    top,
    maxData,
    unit,
    title,
    showAll,
  } = option || {};
  if (!maxData) {
    maxData = d3.max(data, d => {
      return d.v - 0
    })
  }
  // 清除所有图形和定时器
  const remove = () => {
    d3.select(id).selectAll('svg').remove();
  };
  remove();
  const svg = d3.select(id)
    .append('svg')
    .attr({
      width,
      height,
      // transform: `translate(${left},${top})`,
    })
    ;
  if (title && title[0]) {
    svg.append('text')
      .attr({
        x: 2,
        y: 40,
        fill: '#DCF4FD',
        'font-size': 28,
      })
      .text(title[0]);
  }
  if (title && title[1]) {
    svg.append('text')
    .attr({
      x: width - 10,
      y: 40,
      fill: '#DCF4FD',
      'font-size': 28,
      'text-anchor': 'end',
    })
    .text(title[1]);
  }
  const groups = svg.selectAll('.group')
    .data(data)
    .enter()
    .append('g')
    .attr({
      class: 'group',
    })
  function sliceNum(s, n) {
    if (s && s.length) {
      return s.slice(0, n).replace(/([^x00-xff])/g, '$1a').slice(0, n).replace(/([^x00-xff])a/g, '$1');
    }
  }
  const handleText = groups.append('text')
    .attr({
      x: 2,
      y: (d, i) => (paddingTop - 20) + (i * 102),
      fill: '#ffffff',
      'font-size': 28,
      'text-anchor': 'start',
    })
    .text((d) => sliceNum(d.x, 36) + (sliceNum(d.x, 36) === d.x ? '' : '...'))
  handleText.append('title')
    .text((d) => d.x);
  groups.append('text')
    .attr({
      x: width - 5,
      y: (d, i) => (paddingTop - 20) + (i * 102),
      fill: '#ffffff',
      'font-size': 28,
      'text-anchor': 'end',
    })
    .text(0)
    .transition()
    .duration(2000)
    .tween('text', (d) => {
      const i = d3.interpolate(0, d.y);
      const j = d3.interpolate(0, d.m);
      function count(t) {
        let content1 = 0;
        let content2 = 0;
        if (t === 1) {
          content1 = d.y;
          content2 = d.m;
        } else {
          content1 = Math.round(i(t));
          content2 = Math.round(j(t));
        }
        this.textContent = `${content1}${unit ? unit[0] : ''}${showAll ? '/' + content2 + (unit ? unit[1] ? unit[1] : '' : '') : ''}`;
      }
      return count;
    });
  // 背景矩形
  groups.append('rect')
    .attr({
      x: 0,
      y: (d, i) => paddingTop + (i * 102),
      width,
      height: 14,
      fill: bgColor,
      'fill-opacity': 0.17,
      stroke: 'none',
    })
  // 比例尺
  const xScale = d3.scale.linear()
    .domain([0, maxData])
    .range([0, width])
  // 渐变
  const defs = svg.append('defs');
  const linearGradient = [
    { offset: '0%', color: color1, opacity: 1 },
    { offset: '100%', color: color2, opacity: 1 },
  ];
  defs.append('linearGradient')
    .attr({
      id: 'areaColor',
      x1: '0',
      y1: '0',
      x2: '100%',
      y2: '0',
    })
    .selectAll('stop')
    .data(linearGradient)
    .enter()
    .append('stop')
    .attr({
      offset: (d) => d.offset,
      'stop-color': (d) => d.color,
      'stop-opacity': (d) => d.opacity,
    });
  groups.append('rect')
    .attr({
      x: 0,
      y: (d, i) => paddingTop + (i * 102),
      width: 0,
      height: 14,
      fill: 'url(#areaColor)',
      stroke: 'none',
    })
    .transition()
    .duration(2000)
    .delay((d, i) => i * 200)
    .attr({
      width: (d) => xScale(d.v),
    })
}
