import { connect } from 'dva';
import { Component } from 'react';
import { fromJS } from 'immutable';
import style from './index.less'

class SelectOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  componentDidMount() {

  }

  componentDidUpdate() {

  }

  handleShow = () => {
    this.setState({
      show: !this.state.show,
    })
  }
  getValue(d) {
    if (d.name !== this.props.item.name) {
      // this.props.history.push({
      //   pathname: '/s2',
      //   search: `?name=${d.name}&id=${d.id}`,
      // });
      this.props.handleSelect(d)
      this.setState({
        show: !this.state.show,
      })
    }
  }

  render() {
    const { menu, item, title, options={} } = this.props    
    return (
      <div className={style.main}>
        {title ?
          <span className={style.selectTitle}>{title}</span>
          :
          ''
        }
        <div className={style.wrap} onClick={this.handleShow} style={{width: options.width || '420px'}}>
          <div className={`${style.left} ${style.select}`} title={item.name || ''}>{item.name && item.name.slice(0, 8)}</div>
          <div className={`${style.right} ${style.select}`}>
            <span className={!this.state.show ? `${style.arrowsDown}` : `${style.arrowsUp}`}></span>
          </div>
          {menu.length ? (
            <div className={menu.length > 8 ? `${style.optionFa} ${style.optionHeight}` : `${style.optionFa}`} style={{ display: this.state.show ? 'block' : 'none', width: options.width || '420px' }}>
              <div className={menu.length > 8 ? `${style.option} ${style.optionHeight2}` : `${style.option}`}>
                <ul className={style.optionUl}>
                  {
                    menu.map((d, i) => <li key={`${d.id || d.name}`} className={style.optionLi}>
                      <button className={menu.length > 8 ? `${style.btnOption} ${style.btnWidth}` : `${style.btnOption}`} onClick={() => this.getValue(d)} title={d.name} >{d.name}</button>
                    </li>)
                  }
                </ul>
              </div>
            </div>)
            :
            ''
          }
        </div>
      </div>
    );
  }
}

export default SelectOption;