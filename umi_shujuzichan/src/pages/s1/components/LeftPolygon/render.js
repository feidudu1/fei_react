import d3 from 'd3';
import bgIcon1 from '../../../../assets/img/s1/bgIcon1.svg';
import bgIcon2 from '../../../../assets/img/s1/bgIcon2.svg';
import bgIcon3 from '../../../../assets/img/s1/bgIcon3.svg';
import bgIcon4 from '../../../../assets/img/s1/bgIcon4.svg';
import bgIcon5 from '../../../../assets/img/s1/bgIcon5.svg';
import bgIcon6 from '../../../../assets/img/s1/iconBg.png';
import down from '../../../../assets/img/down.png';
import fair from '../../../../assets/img/fair.png';
import up from '../../../../assets/img/up.png';

const render = (containerId, data, option) => {
  const {
    width,
    height,
    color1,
    color2,
    color3,
    circleColor1,
    circleColor2,
    rectColor1,
    // rectColor2,
  } = option || {};
  // 移除之前的svg
  const remove = () => {
    d3.select(containerId).select('svg').remove();
  };
  remove();

  // 创建svg
  const svg = d3.select(containerId)
    .append('svg')
    .attr({
      width,
      height,
    });
  svg.append('image')
    .attr({
      'xlink:href': bgIcon1,
      x: width / 2,
      y: 0,
      width: 0,
      height,
      opacity: 0,
    })
    .transition()
    .duration(2000)
    // .delay(500)
    .attr({
      x: 90,
      width: width - 180,
      opacity: 1,
    });
  svg.append('image')
    .attr({
      'xlink:href': bgIcon2,
      x: -50,
      y: -66,
      width: 1327,
      height: 1066,
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .attr({
      opacity: 0.6,
    });
  svg.append('image')
    .attr({
      'xlink:href': bgIcon3,
      x: -50,
      y: -66,
      width: 1327,
      height: 1046,
      opacity: 0,
      class: 'bgIcon3',
    })
    .style({
      'transform-origin': '50% 50%',
    })
    .transition()
    .duration(2000)
    .delay(3000)
    .attr({
      opacity: 1,
    });
  svg.append('image')
    .attr({
      'xlink:href': bgIcon4,
      x: -13,
      y: -63,
      width: width + 26,
      height: height + 26,
      opacity: 0,
      class: 'bgIcon4',
    })
    .style({
      'transform-origin': `${width / 2}px ${(height + 18) / 2}px`,
    })
    .transition()
    .duration(2000)
    .delay(3000)
    .attr({
      opacity: 1,
    });
  svg.append('image')
    .attr({
      class: 'bgIcon5',
      'xlink:href': bgIcon5,
      x: -50,
      y: -66,
      width: 1327,
      height: 1046,
      opacity: 0,
    })
    .style({
      'transform-origin': '50% 50%',
    })
    .transition()
    .duration(2000)
    .delay(3000)
    .attr({
      opacity: 1,
    });
  // 绘制雷达图
  // 设定一些方便计算的常量
  const radius = 360;
  // 指标的个数，即data的长度
  const total = data.length;
  const level = 4;
  const arc = 2 * Math.PI;
  // 每项指标所在的角度
  const onePiece = arc / total;
  // 计算网轴的正多边形的坐标
  const polygons = {
    webs: [],
    webPoints: [],
  };
  // 渐变
  const gradientColor = [
    { offset: '0%', color: color1, opacity: 1 },
    { offset: '30%', color: color2, opacity: 1 },
    { offset: '100%', color: color3, opacity: 1 },
  ];
  const groups = svg.append('g')
    .data(data)
    .style({
      transform: `translate(${width / 2}px, ${(height / 2) + 10}px) rotate(180deg)`,
    });
  for (let k = level; k > 0; k -= 1) {
    let webs = '';
    const webPoint = [];
    const r = (radius / level) * k; // 雷达网各层半径
    // 计算雷达网各层顶点坐标
    for (let i = 0; i < total; i += 1) {
      const x = r * Math.sin(i * onePiece);
      const y = r * Math.cos(i * onePiece);
      webs += `${x}, ${y} `;
      webPoint.push({
        x: r * Math.sin(i * onePiece),
        y: r * Math.cos(i * onePiece),
      });
    }
    polygons.webs.push(webs);
    polygons.webPoints.push(webPoint);
  }
  // 添加纵轴
  groups.selectAll('line')
    .data(polygons.webPoints[0])
    .enter()
    .append('line')
    .attr({
      x1: 0,
      y1: 0,
      x2: (d) => d.x * 1.1,
      y2: (d) => d.y * 1.1,
      stroke: '#00B9F8',
      'stroke-width': '3px',
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .delay(2000)
    .attr({
      opacity: 0.3,
    });
  // 添加rect
  const rectG1 = svg.append('g')
    .attr({
      class: 'rectG1',
      transform: `translate(${(width / 2) - 10}, 328)`,
    })
  const rectG2 = svg.append('g')
    .attr({
      class: 'rectG2',
      transform: `translate(${(width / 2) + 181}, 620) rotate(120)`,
    })
  const rectG3 = svg.append('g')
    .attr({
      class: 'rectG3',
      transform: `translate(${(width / 2) - 180}, 631) rotate(240)`,
    })
  for (let i = 0; i < 6; i += 1) {
    rectG1.append('rect')
      .attr({
        x: 0,
        y: ((5 - i) * 17.5),
        width: 16,
        height: 7,
        rx: 4,
        ry: 4,
        fill: rectColor1,
        stroke: 'none',
      })
      .style({
        display: 'none',
      })
      .transition()
      .duration(i * 500)
      .delay(1000 + (i * 300))
      .style({
        display: 'block',
      })
  }
  for (let i = 0; i < 6; i += 1) {
    rectG2.append('rect')
      .attr({
        x: 0,
        y: ((5 - i) * 17.5),
        width: 16,
        height: 7,
        rx: 4,
        ry: 4,
        fill: rectColor1,
        stroke: 'none',
      })
      .style({
        display: 'none',
      })
      .transition()
      .duration(i * 500)
      .delay(1000 + (i * 300))
      .style({
        display: 'block',
      })
  }
  for (let i = 0; i < 6; i += 1) {
    rectG3.append('rect')
      .attr({
        x: 0,
        y: ((5 - i) * 17.5),
        width: 16,
        height: 7,
        rx: 4,
        ry: 4,
        fill: rectColor1,
        stroke: 'none',
      })
      .style({
        display: 'none',
      })
      .transition()
      .duration(i * 500)
      .delay(1000 + (i * 300))
      .style({
        display: 'block',
      })
  }
  // 比例尺
  const scale = d3.scale.linear()
    .domain([0, 100])
    .range([80, radius]);
  // 计算雷达图表的坐标
  const areasData = [];
  let rArr = [];
  rArr = data.map((d) => scale(d.y));
  let area = '';
  const points1 = [];
  for (let k = 0; k < rArr.length; k += 1) {
    const x = rArr[k] * Math.sin(k * onePiece);
    const y = rArr[k] * Math.cos(k * onePiece);
    area += `${x}, ${y} `;
    points1.push({
      x: rArr[k] * Math.sin(k * onePiece),
      y: rArr[k] * Math.cos(k * onePiece),
    });
  }
  areasData.push({
    polygon: area,
    points: points1,
  });
  const groups2 = svg.append('g')
    .style({
      transform: `translate(${width / 2}px, ${(height / 2) + 10}px) rotate(180deg)`,
    })
    .attr({
      class: 'groups2',
    })
  groups2.selectAll('g')
    .data(areasData)
    .enter()
    .append('g')
    .attr('class', (d, i) => `area${i + 1}`);
  // for (let i = 0; i < areasData.length; i += 1) {
  // 依次循环每个雷达图区域
  const area2 = groups2.select('.area1');
  const areaData = areasData[0];
  // 绘制渐变
  area2.append('defs')
    .append('linearGradient')
    .attr({
      id: 'polygonGradient',
      x1: '0',
      y1: '0',
      x2: '100%',
      y2: '100%',
    })
    .selectAll('stop')
    .data(gradientColor)
    .enter()
    .append('stop')
    .attr({
      offset: (d) => d.offset,
      'stop-opacity': (d) => d.opacity,
      'stop-color': (d) => d.color,
    });
  // 绘制雷达图区域下的多边形
  let polyPath = '';
  for (let i = 0; i < data.length; i += 1) {
    polyPath += '0, 0 ';
  }
  area2.append('polygon')
    .attr({
      points: polyPath,
      stroke: 'none',
      'stroke-width': 2,
      fill: 'url(#polygonGradient)',
      'fill-opacity': 0.9,
    })
    // .style('mix-blend-mode', 'screen')
    .transition()
    .duration(2000)
    .delay(2000)
    .attr({
      points: areaData.polygon,
    });
  // }
  // 圆
  for (let i = 0; i < data.length; i += 1) {
    svg.append('circle')
      .style({
        transform: `translate(${width / 2}px, ${(height / 2) + 10}px) rotate(180deg)`,
      })
      .attr({
        cx: areaData.points[i].x,
        cy: areaData.points[i].y,
        r: 0,
        fill: circleColor1,
        stroke: circleColor2,
        'stroke-width': 0,
      })
      .transition()
      .duration(2000)
      .delay(3500)
      .attr({
        r: 18,
        'stroke-width': 6,
      });
  }
  svg.append('circle')
    .attr({
      cx: width / 2,
      cy: (height / 2) + 10,
      r: 50,
      fill: '#072A4D',
      stroke: '#00B9F8',
      'stroke-width': 3,
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .delay(1300)
    .attr({
      opacity: 1,
    });
  svg.append('circle')
    .attr({
      class: 'circle1',
      'transform-origin': `${width / 2} ${(height / 2) + 10}`,
      cx: width / 2,
      cy: (height / 2) + 10,
      r: 36,
      fill: 'none',
      stroke: '#00B9F8',
      'stroke-width': 2,
      'stroke-dasharray': [65, 10],
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .delay(1300)
    .attr({
      opacity: 1,
    });
  svg.append('circle')
    .attr({
      class: 'circle2',
      'transform-origin': `${width / 2} ${(height / 2) + 10}`,
      cx: width / 2,
      cy: (height / 2) + 10,
      r: 25,
      fill: 'none',
      stroke: color3,
      'stroke-width': 4,
      'stroke-dasharray': [65, 10],
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .delay(1300)
    .attr({
      opacity: 1,
    });
  // 计算文字标签坐标
  const textPoints = [];
  const textRadius = radius + 140;
  for (let i = 0; i < total; i += 1) {
    textPoints.push({
      x: textRadius * Math.sin(i * onePiece),
      y: textRadius * Math.cos(i * onePiece),
    });
  }
  // 绘制文字
  groups.selectAll('.imageBg')
    .data(textPoints)
    .enter()
    .append('image')
    .attr({
      class: 'imageBg',
      'xlink:href': bgIcon6,
      x: (d) => d.x - 150,
      y: (d) => d.y - 150,
      width: 300,
      height: 242,
      opacity: 0,
    })
    .transition()
    .duration(2000)
    .delay(3500)
    .attr({
      opacity: 1,
    });
  groups.selectAll('.imageBg1')
    .data(textPoints)
    .enter()
    .append('image')
    .attr({
      class: 'imageBg1',
      'xlink:href': (d, i) => {
        if (data[i].z && Number(data[i].z)) {
          if (Number(data[i].z) === -1) {
            return down;
          }
          return up;
        }
        return fair;
      },
      x: (d) => d.x + 60,
      y: (d, i) => {
        if (i === 0) {
          return d.y - 10;
        } else if (i === 3) {
          return d.y - 114;
        }
        return d.y - 30;
      },
      'transform-origin': (d) => `${d.x} ${d.y}`,
      width: (d, i) => (data[i].z ? 20 : 26),
      height: (d, i) => (data[i].z ? 32 : 6),
      opacity: 0,
    })
    .style({
      transform: 'rotate(180deg)',
    })
    .transition()
    .duration(2000)
    .delay(3500)
    .attr({
      opacity: 1,
    });
  groups.selectAll('text')
    .data(textPoints)
    .enter()
    .append('text')
    .attr({
      x: (d) => d.x,
      y: (d, i) => {
        if (i === 0) {
          return d.y + 20;
        } else if (i === 3) {
          return d.y - 80;
        } return d.y;
      },
      'text-anchor': 'middle',
      'font-size': 36,
      fill: '#DCF4FD',
      // 'font-weight': 'bold',
      'transform-origin': (d) => `${d.x} ${d.y}`,
      opacity: 0,
    })
    .style({
      transform: 'rotate(180deg)',
    })
    .text((d, i) => data[i].x)
    .transition()
    .duration(2000)
    .delay(3500)
    .attr({
      opacity: 1,
    });
  groups.selectAll('.text2')
    .data(textPoints)
    .enter()
    .append('text')
    .attr({
      class: 'text2',
      x: (d) => d.x,
      y: (d, i) => {
        if (i === 0) {
          return d.y + 100;
        } else if (i === 3) {
          return d.y;
        } return d.y + 80;
      },
      'text-anchor': 'middle',
      'font-size': 76,
      fill: '#fff',
      // 'font-weight': 'bold',
      'transform-origin': (d) => `${d.x} ${d.y}`,
      opacity: 0,
    })
    .style({
      transform: 'rotate(180deg)',
    })
    .text(0)
    .transition()
    .duration(2000)
    .delay(3500)
    .attr({
      opacity: 1,
    })
    .tween('text', (d, j) => {
      const i = d3.interpolate(0, data[j].y);
      function count(t) {
        let content = 0;
        if (t === 1) {
          content = data[j].y;
        } else {
          content = Math.round(i(t));
        }
        this.textContent = `${Math.round(content)}%`;
      }
      return count;
    });
  console.log(groups.selectAll('.text2'));
};
export default render;
