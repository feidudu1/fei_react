const debounce = (fn, during) => {
  console.log(111, fn)
  return function () {
    clearTimeout(this.timer)
    console.log(222, fn)
    this.timer = setTimeout(function () {
      console.log(333, fn)
      fn.apply(this, arguments)
    }, during)    
  }
}

export {debounce}