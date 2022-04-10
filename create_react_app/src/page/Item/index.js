import React, { Component } from 'react';
import './index.css';

class Item extends Component {

  addCart = (item) => {
    this.props.add(item)
  }

  render() {
    const {img, name, id, price} = this.props.data
    console.log(111, id)
    return (
      <div className="wrapper">
        <div>
          <div className="imgWrapper"><img src={img} /></div>
          <div className="bottomWrapper">
            <div className="name">{name}</div>
            <div className="bottomRightWrapper">
              <div className="price">
                {price}
                </div>
                <button className="cart" onClick={() => this.addCart(id)}>加入购物车</button>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
