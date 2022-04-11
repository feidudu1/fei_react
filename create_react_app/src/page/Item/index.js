import React, { Component } from 'react';
import CartStore from '../singleService/CartStore';
import {debounce} from '../utils/tool'
import './index.css';

class Item extends Component {
  debounceAdd = debounce(CartStore.addGood(this.props.data.id), 500)

  render() {
    const {img, name, price} = this.props.data
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
                <button className="cart" onClick={this.debounceAdd}>加入购物车</button>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
