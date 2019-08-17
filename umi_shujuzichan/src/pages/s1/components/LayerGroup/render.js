/* eslint-disable */
import d3 from 'd3';
import layer1 from '../../../../assets/img/s1/layerGroup/layer1.svg';
import layer2 from '../../../../assets/img/s1/layerGroup/layer2.svg';
import layer3 from '../../../../assets/img/s1/layerGroup/layer3.svg';
import layer4 from '../../../../assets/img/s1/layerGroup/layer4.svg';

function render(eleContainer, data, options = {}) {
  const {
    paddingTop = 10,
    paddingRight = 5,
    paddingBottom = 10,
    paddingLeft = 50,
    width = 560,
    height = 550,
    iconWidth = 525,
    iconHeight = 106,
  } = options;

  d3.select(eleContainer).select('svg').remove();
  const svg = d3.select(eleContainer).select('.layers')
    .append('svg')
    .attr({
      width: width,
      height: height,
      fill: 'blue'
    });
  const layerGroup = svg.append('g')
  layerGroup.append('image')
    .attr({
      'xlink:href': layer1,
      x: paddingLeft,
      y: height - iconHeight * 2,
      width: iconWidth,
      height: iconHeight,
      opacity: 0,
    })
    .transition()
    .duration(500)
    .attr({
      opacity: 1,
    })
  layerGroup.append('image')
    .attr({
      'xlink:href': layer2,
      x: paddingLeft,
      y: height - iconHeight * 2,
      width: iconWidth,
      height: iconHeight,
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .delay(500)
    .attr({
      opacity: 1,
      y: height - iconHeight * 3,
    })
  layerGroup.append('image')
    .attr({
      'xlink:href': layer3,
      x: paddingLeft,
      y: height - iconHeight * 3,
      width: iconWidth,
      height: iconHeight,
      opacity: 0,
    })
    .transition()
    .duration(1000)
    .delay(1500)
    .attr({
      opacity: 1,
      y: height - iconHeight * 4,
    })
  layerGroup.append('image')
    .attr({
      'xlink:href': layer4,
      x: paddingLeft,
      y: height - iconHeight * 4,
      width: iconWidth,
      height: iconHeight,
      opacity: 0,
    })
    .transition()
    .duration(1500)
    .delay(2500)
    .attr({
      opacity: 1,
      y: height - iconHeight * 5,
    })

}

export default render;
