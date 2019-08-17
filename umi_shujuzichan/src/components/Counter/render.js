import d3 from 'd3';

export default function playCounter(id, data, num, option) {
  const {
    fontSize = 16,
    fontColor = '#FFFFFF',
  } = option || {};
  (() => {
    d3.select(id).selectAll('div').remove();
  })();
  const duration = 3000;
  d3.select(id).append('div')
    .text(num)
    .style({ color: fontColor,
      display: 'inline-block',
      'font-size': `${fontSize}px` })
    .transition()
    .duration(duration)
    .ease('linear')
    .tween('text', () => {
      const i = d3.interpolate(num, data);
      function count(t) {
        let content = 0;
        if (t === 1) {
          content = data;
        } else {
          content = Math.round(i(t));
        }
        this.textContent = content;
      }
      return count;
    });
}
