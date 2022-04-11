const debounce = (fn, during) => {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(function () {
      console.log(5555)
      fn.apply(this, arguments)
    }, during)    
  }
}

export {debounce}