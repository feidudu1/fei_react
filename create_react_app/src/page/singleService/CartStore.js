
class Cart {

    showCart = false
    cartList = []

  subscriber = []
  

  subscribe = (Com) => {
    this.subscriber.push(Com)
  }

    notify(dataKey) {
      this.subscriber.map(sub => sub.update({val: this[dataKey], key: dataKey}))
    }

  addGood = (id) => {
    return () => {
      const carts = this.cartList 
    let targetCart 
    const restCarts = carts.filter(cart => {
      if (cart.id === id) {
        targetCart = cart
        return false
      } else {
        return true
      }
    })

    if (targetCart) {
      targetCart.count = targetCart.count + 1
    } else {
      targetCart = {id, count: 1}
    }
    this.cartList= [targetCart, ...restCarts]
    this.notify('cartList')
    }
    
  }
   
  deleteGood = (id) => {
    let carts = this.cartList
    const targetCart = carts.find(item => item.id === id)
    targetCart.count = targetCart.count - 1
    this.cartList = carts.filter(cart => cart.count > 0)
    this.notify('cartList')

  }

  show = () => {
      this.showCart = true
    this.notify('showCart')
  };

  hide = () => {
    this.showCart = false
    this.notify('showCart')
  };

  submit = (data) => {
    const result = data.reduce((pre, cur) => 
      pre + cur.count * (+cur.price)
    , 0)
    window.alert('商品总价为：' + result + '元')
  }

}
const CartStore = new Cart()

export default CartStore ;
