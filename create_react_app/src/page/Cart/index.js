import React, { Component } from "react";
import {debounce} from '../utils/tool'
import CartStore from '../singleService/CartStore';

import "./index.css";

class Cart extends Component {
  state = {
    showCart: false,
    cartList: []
  };

  componentDidMount() {
    CartStore.subscribe(this)
  }

  update(data) {
    this.setState({
      [data.key]:data.val
    })
  }

  getList() {
    const { datas } = this.props;
    const {cartList} = this.state
    return cartList.map(cart => {
      const result = datas.find(data => data.id === cart.id)
      result.count = cart.count
      return result
    })
  }

  debounceHide = debounce(CartStore.hide, 500)

  render() {
    const { showCart } = this.state;
    const cartList = this.getList()

    return (
      <div className="cart">
        <div onMouseOver={CartStore.show}>
          购物车
        </div>
        {showCart && <div className="list" onMouseLeave={this.debounceHide}>
          {
            cartList.length ? (
              <div>
                {cartList.map((data) => (
                  <div className="bottomWrapper" key={data.id}>
                    <div className="name">{data.name}</div>
                    <div className="bottomRightWrapper">
                      <div className="price">
                        {data.price} * {data.count}
                      </div>
                      <button
                        className="cart"
                        onClick={() => CartStore.deleteGood(data.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
                <div className="submit" onClick={() => CartStore.submit(cartList)}>购买</div>
              </div>
            ) : <div>购物车为空，请选购商品</div>
          }
          </div>
  }
      </div>
    );
  }
}

export default Cart;
