/* eslint-disable */
import d3 from 'd3';

function render(eleContainer, data, options = {}) {
  const {
    width = 1470,
    height = 650,
    paddingTop = 30,
    paddingBottom = 30,
    paddingRight = 30,
    paddingLeft = 30,
  } = options;
  // 清除所有图形和定时器
  const remove = () => {
    d3.select(eleContainer).selectAll('svg').remove();
    d3.select(eleContainer).selectAll('div').remove();
  };
  remove();

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const everyW = chartWidth / (data.length || 1);
  const svg = d3.select(eleContainer)
    .append('svg')
    .attr({
      width,
      height,
    })
    .style({
      position: 'absolute',
      left: '0px',
      top: '0px',
    });
  // 处理数据
  const maxData = (Math.round(d3.max(data,(d) => d.rate_num))).toString();
  let title = '条';
  let num = 1;
  let littleNum = 0;
  if (maxData.length > 6) {
    title = '万条';
    num = 10000;
    littleNum = 2;
  } else if (maxData.length > 10) {
    title = '亿条';
    num = 100000000;
    littleNum = 2;
  }
  const rScale = d3.scale.linear()
    .domain([d3.min(data,(d) => d.rate_num), d3.max(data,(d) => d.rate_num)])
    .range([80, 145]);

  const groups = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .style({
      transform: `translate(${paddingTop}px, ${paddingLeft}px)`,
    });

  groups.append('text')
    .attr({
      x: (d, i) => (i + 0.5) * everyW,
      y: 0, 
      fill: '#fff',
      'font-size': 36,
      'text-anchor': 'middle',
    })
    .text(0)
    .transition()
    .duration(1000)
    .ease('linear')
    .tween('text', (d) => {
      const i = d3.interpolate(0, (d.rate_num / num));
      function count(t) {
        let content = 0;
        if (t === 1) {
          content = (d.rate_num / num).toFixed(littleNum);
        } else {
          content = (i(t)).toFixed(littleNum);
        }
        this.textContent = `${content}${title}`;
      }
      return count;
    });
  groups.append('circle')
    .attr({
      cx: (d, i) => (i + 0.5) * everyW,
      cy: 230,
      r: 0,
      fill: '#00B9F8',
      'fill-opacity': 0.3,
      stroke: '#00B9F8',
      'stroke-width': 2,
    })
    .transition()
    .duration(1000)
    .attr({
      r: (d) => rScale(d.rate_num),
    });
  groups.append('text')
    .attr({
      x: (d, i) => (i + 0.5) * everyW,
      y: 250, 
      fill: '#fff',
      'font-size': 40,
      'text-anchor': 'middle',
      opacity: 0,
    })
    .text((d) => d.rate)
    .transition()
    .delay(500)
    .duration(1000)
    .ease('linear')
    .attr({
      opacity: 1,
    });

  const divContent = d3.select(eleContainer)
    .append('div')
    .style({
      width: `${width}px`,
      height: `${height}px`,
      position: 'absolute',
      left: '0px',
      top: '0px',
    });
  const groupsDiv = divContent.selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .style({
      width: `${everyW - 30}px`,
      height: '200px',
      position: 'absolute',
      left: (d, i) => `${((i + 0.5) * everyW - (everyW / 2 - 15)) + paddingLeft}px`,
      top: '450px',
      'font-size': '28px',
      color: '#BCDBFF',
      opacity: 0.8,
    })
    .text((d) => d.department_name);
}
export default render;
