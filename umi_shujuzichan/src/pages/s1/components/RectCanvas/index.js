import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

let intervalCanvas
class RectCanvas extends Component {
  static propTypes = {
    // opts: PropTypes.opts,
  };
  constructor(props) {
    super(props);
    this.width = 1800;
    this.height = 202;
    this.size1 = 150; // 矩形宽
    this.size2 = 80; // 矩形高
    this.canvas = null;
    this.ctx = null
    this.state = {
      lines: [],
      tick: 0,
    };
    this.rand = this.rand.bind(this)
    this.randInt = this.randInt.bind(this)
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.init()
  }

  componentWillUnmount() {
    cancelAnimationFrame(intervalCanvas);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state)));
  }
  componentDidUpdate() {
  }

  rand(min, max) {
    return (Math.random() * (max - min)) + min; // 在min和max之间，不包含max
  }
  randInt(min, max) {
    return Math.floor(min + (Math.random() * ((max - min) + 1))) // 在min和max之间，包含max
  }

  init() {
    this.loop();
  }
  loop = () => {
    const { tick } = this.state;
    intervalCanvas = requestAnimationFrame(this.loop);
    this.create();
    this.step();
    this.clear();
    this.draw();
    this.setState({ tick: tick + 1 })
  }

  create() {
    const { tick, lines } = this.state;
    const newLine = lines.slice(0)
    const that = this
    class Line {
      constructor() {
        this.path = [];
        this.speed = that.rand(20, 40);
        this.count = that.randInt(20, 60);
        this.start = that.rand(that.width / 5, (that.width / 5) * 4)
        this.x = this.start + 1;
        this.y = (that.height / 5) + 1;
        this.target = {
          x: this.start,
          y: that.height / 5,
        };
        this.dist = 0;
        this.angle = 0;
        this.life = 1;
        this.updateAngle();
        this.updateDist();
      }
      updateDist() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        this.dist = Math.sqrt((dx * dx) + (dy * dy)); // 平方根 这是得到三角形第三边长？
      }
      updateAngle() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        this.angle = Math.atan2(dy, dx);
      }
      step(i) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.updateDist();
        if (this.dist < this.speed) {
          this.x = this.target.x;
          this.y = this.target.y;
          this.changeTarget();
        }
        this.path.push({
          x: this.x,
          y: this.y,
        });
        if (this.path.length > this.count) {
          this.path.shift();
        }
        this.life -= 0.001;
        if (this.life <= 0) {
          this.path = [];
          const lin = lines.slice(0)
          lin.splice(i, 1)
          that.setState({ lines: lin })
        }
      }
      changeTarget() {
        const randStart = that.randInt(0, 3);
        switch (randStart) {
          case 0: // up
            this.target.y = this.y - that.randInt(10, that.size2);
            break;
          case 1: // right
            this.target.x = this.x + that.randInt(30, that.size1);
            break;
          case 2: // down
            this.target.y = this.y + that.randInt(60, that.size2);
            break;
          case 3: // left
            this.target.x = this.x - that.randInt(30, that.size1);
            break;
          default:
            this.target.x = this.x + that.size1;
        }
        this.updateAngle();
      }
      draw() {
        that.ctx.beginPath();
        const rando = that.rand(0, 10);
        // eslint-disable-next-line prefer-destructuring
        for (let j = 0, length = this.path.length; j < length; j += 1) {
          that.ctx[(j === 0) ? 'moveTo' : 'lineTo'](this.path[j].x + that.rand(-rando, rando), this.path[j].y + that.rand(-rando, rando));
        }
        that.ctx.strokeStyle = `hsla(${that.rand(210, 220)}, 80%, 55%, ${this.life / 2})`;
        that.ctx.lineWidth = that.rand(0, 2);
        that.ctx.stroke();
      }
    }
    if (tick % 8 === 0) {
      newLine.push(new Line());
      this.setState({ lines: newLine })
    }
  }

  step() {
    const { lines } = this.state;
    let i = lines.length;
    // eslint-disable-next-line no-plusplus
    while (i--) {
      lines[i].step(i);
    }
  }

  clear() {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'lighter';
  }
  draw() {
    const { lines } = this.state;
    this.ctx.save();
    let i = lines.length;
    // eslint-disable-next-line no-plusplus
    while (i--) {
      lines[i].draw(i);
    }
    this.ctx.restore();
  }

  render() {
    // const { opts } = this.props;
    return (
      <div className="RectCanvas" style={{ width: '1800px', height: '100px', overflow: 'hidden' }}>
        <canvas id="canvas" width="1800" height="100"/>
      </div>
    );
  }
}

export default RectCanvas;
