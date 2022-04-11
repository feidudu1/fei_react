import React, { Component } from 'react';
import Item from '../Item';
import Cart from '../Cart';

import './index.css';

class List extends Component {
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
      img: 'https://lupic.cdn.bcebos.com/20220327/3086320759_14_566_404.jpg'
    },
    {
      id: 3,
      name: '橘子',
      price: '10.99',
      img: 'https://img-blog.csdnimg.cn/20210726121338338.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xCWFhfSEg=,size_16,color_FFFFFF,t_70'
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
   
  render() {
    return (
      <div className="root">
        <div className="title">
          <div>购物天堂</div>
          <Cart datas={this.lists} />
          </div>
        <div className="content">
          {this.lists.map(list => 
          <div className="itemWrapper" key={list.id}>
            <Item data={list}/>
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default List;
