import React, { Component } from "react";
import {debounce} from '../utils/tool'
import "./index.css";

class Cart extends Component {
  state = {
    showCart: true,
  };

  deleteCart = (id) => {
    this.props.delete(id);
  };

  show = () => {
    this.setState({ showCart: true });
  };
  debounceShow = debounce(this.show, 2000)

  hide = () => {
    this.setState({ showCart: false });
  };

  submit = () => {
    const data = this.props.datas
    const result = data.reduce((pre, cur) => 
      pre + cur.count * (+cur.price)
    , 0)
    window.alert('商品总价为：' + result + '元')
  }

  render() {
    const { datas } = this.props;
    const { showCart } = this.state;

    return (
      <div className="cart">
        <div onMouseOver={this.show}>
          购物车
        </div>
        {showCart && <div className="list" onMouseOut={this.hide}>
          {
            datas.length ? (
              <div>
                {datas.map((data) => (
                  <div className="bottomWrapper" key={data.id}>
                    <div className="name">{data.name}</div>
                    <div className="bottomRightWrapper">
                      <div className="price">
                        {data.price} * {data.count}
                      </div>
                      <button
                        className="cart"
                        onClick={() => this.deleteCart(data.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
                <div className="submit" onClick={this.submit}>购买</div>
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
