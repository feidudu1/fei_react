import React, { Component } from 'react';
import Item from '../Item';
import Cart from '../Cart';
import './App.css';

class App extends Component {
  lists = [
    {
      id: 1,
      name: '苹果',
      price: '10.99',
      img: 'http://www.lgstatic.com/i/image/M00/1A/4A/CgqKkVb583WABT4BAABM5RuPCmk968.png'
    },
    {
      id: 2,
      name: '香蕉',
      price: '10.99',
      img: 'http://www.lgstatic.com/i/image/M00/1A/4A/CgqKkVb583WABT4BAABM5RuPCmk968.png'
    },
    {
      id: 3,
      name: '橘子',
      price: '10.99',
      img: 'http://www.lgstatic.com/i/image/M00/1A/4A/CgqKkVb583WABT4BAABM5RuPCmk968.png'
    },
    {
      id: 4,
      name: '好啦开始觉得分开了',
      price: '10.99',
      img: 'http://www.lgstatic.com/i/image/M00/1A/4A/CgqKkVb583WABT4BAABM5RuPCmk968.png'
    },
    {
      id: 5,
      name: '橙子',
      price: '10.99',
      img: 'http://www.lgstatic.com/i/image/M00/1A/4A/CgqKkVb583WABT4BAABM5RuPCmk968.png'
    },
  ]
  state= {
    cartList: [],
    
  }
  addCart = (id) => {
    const carts = this.state.cartList    
    const cartItem = carts.find(cart => cart.id === id)
    let item
    if (cartItem) {
      cartItem.count = cartItem.count + 1
    } else {
      item  = this.lists.find(item => item.id === id)
      item.count = 1
    }
      this.setState({cartList: cartItem ? carts : [item, ...carts]})
  }
   
  delete = (id) => {
    let carts = this.state.cartList
    const cartItem = carts.find(cart => cart.id === id)
      if (cartItem.count === 1) {
        carts = carts.filter(item => item.id !== id)
      } else {
        cartItem.count = cartItem.count - 1
      }
      this.setState({cartList: carts})
  }
   
  render() {
    const {cartList} = this.state
    return (
      <div className="root">
        <div className="title">
          <div>购物天堂</div>
          <Cart datas={cartList} delete={(id) => this.delete(id)} 
          />
          </div>
        <div className="content">
          {this.lists.map(list => 
          <div className="itemWrapper" key={list.id}>
            <Item data={list} add={(id) => this.addCart(id)}/>
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
