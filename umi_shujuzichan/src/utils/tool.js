export const TransUnit = (num, limit) => {
  const numStr = num.toString()
  if (!limit) {
    return [num, '']
  }
  if (numStr.length > 8 && limit <= 9) {
    return [Number((num / 100000000).toFixed(1)), '亿']
  } else if (numStr.length > limit && limit <= 5) {
    if (limit < 3) {
      if (Number((num / 100000000).toFixed(1))) {
        return [Number((num / 100000000).toFixed(1)), '亿']
      }
      return [Number((num / 10000).toFixed(1)), '万']
    }
    return [Number((num / 10000).toFixed(1)), '万']
  }
  return [num, '']
}

export function transGT(num, limit) {
  const dataGT = [];
  const unit = ['B', 'KB', 'MB', 'GB', 'TB']
  if (num < 1024) {
    dataGT[0] = num;
    dataGT[1] = 'B';
  } else if (num >= 1024 && num < 1024 ** 2) {
    dataGT[0] = parseFloat((num / 1024).toFixed(1));
    dataGT[1] = 'KB';
  } else if (num >= 1024 ** 2 && num < 1024 ** 3) {
    dataGT[0] = parseFloat((num / (1024 ** 2)).toFixed(1));
    dataGT[1] = 'MB';
  } else if (num >= 1024 ** 3 && num < 1024 ** 4) {
    dataGT[0] = parseFloat((num / (1024 ** 3)).toFixed(1));
    dataGT[1] = 'GB';
  } else if (num >= 1024 ** 4 && num < 1024 ** 5) {
    dataGT[0] = parseFloat((num / (1024 ** 4)).toFixed(1));
    dataGT[1] = 'TB';
  }
  if (dataGT[0].toString().length > limit) {
    if (dataGT[0].toString().length >= 3) {
      dataGT[0] = (dataGT[0] / 1024).toFixed(1);
      dataGT[1] = unit[unit.indexOf(dataGT[1]) + 1]
    }
  }
  return dataGT;
}
export function transGTUnit(num) {
  const dataGT = [];
  const unit = ['B', 'KB', 'MB', 'GB', 'TB']
  if (num < 1024) {
    dataGT[0] = num;
    dataGT[1] = 'B';
  } else if (num >= 1024 && num < 1024 ** 2) {
    dataGT[0] = parseFloat((num / 1024).toFixed(1));
    dataGT[1] = 'KB';
  } else if (num >= 1024 ** 2 && num < 1024 ** 3) {
    dataGT[0] = parseFloat((num / (1024 ** 2)).toFixed(1));
    dataGT[1] = 'MB';
  } else if (num >= 1024 ** 3 && num < 1024 ** 4) {
    dataGT[0] = parseFloat((num / (1024 ** 3)).toFixed(1));
    dataGT[1] = 'GB';
  } else if (num >= 1024 ** 4 && num < 1024 ** 5) {
    dataGT[0] = parseFloat((num / (1024 ** 4)).toFixed(1));
    dataGT[1] = 'TB';
  }
  return dataGT;
}

export function TransToG(num) { // 把B转换为GB
  if (num) {
    return (num / (1024 ** 3)).toFixed(1);
  }
  const a = 0
  return a.toFixed(1)
}

// 集体转换，返回最多item使用的单位和需要除的数
export function TransMethods(type, arr, prop) {
  let len1 = 0 // 原数据返回 / b
  let len2 = 0 // 万/Mb
  let len3 = 0 // 亿/Kb
  let len4 = 0 // -/Gb
  let len5 = 0 // -/Tb
  let len6 = 0 // -/Pb
  if (type === 'size') { // 存储量G
    arr.map(t => {
      const val = t[prop]
      if (val >= (1024 ** 5)) {
        len6 += 1;
      } else if (val >= (1024 ** 4)) {
        len5 += 1;
      } else if (val >= (1024 ** 3)) {
        len4 += 1;
      } else if (val >= (1024 ** 2)) {
        len3 += 1;
      } else if (val >= (1024 ** 1)) {
        len2 += 1;
      } else {
        len1 += 1;
      }
    })
    const max = [{
      name: 'B',
      val: len1,
      divide: 1,
    }, {
      name: 'KB',
      val: len2,
      divide: 1024,
    }, {
      name: 'MB',
      val: len3,
      divide: 1024 ** 2,
    }, {
      name: 'GB',
      val: len4,
      divide: 1024 ** 3,
    }, {
      name: 'TB',
      val: len5,
      divide: 1024 ** 4,
    }, {
      name: 'PB',
      val: len6,
      divide: 1024 ** 5,
    }].sort((a, b) => b.val - a.val)[0]
    return max
  } else if (type === 'num') { // 条数
    arr.map(t => {
      const val = t[prop]
      if (val >= 100000000) {
        len3 += 1;
      } else if (val >= 10000) {
        len2 += 1;
      } else if (val < 10000) {
        len1 += 1;
      }
    })
    const max = [{
      name: '',
      val: len1,
      divide: 1,
    }, {
      name: '万',
      val: len2,
      divide: 10000,
    }, {
      name: '亿',
      val: len3,
      divide: 100000000,
    }].sort((a, b) => b.val - a.val)[0]
    return max
  }
}

// 用moment，不用该方法
// 获取当前日期是多少
// str = '2019-05-12'
export function GetWeek(dt) {
  const d1 = new Date(dt);
  const d2 = new Date(dt);
  d2.setMonth(0, 1);
  const rq = d1 - d2;
  const days = Math.ceil(rq / (24 * 60 * 60 * 1000));
  const num = Math.ceil(days / 7);
  return num;
}

export function TransToNormal(num) {
  if (num > 1e11) {
    return `${(num / 1e11).toFixed(1)}千亿`
  } else if (num > 1e10) {
    return `${(num / 1e10).toFixed(1)}百亿`
  } else if (num > 1e8) {
    return `${(num / 1e8).toFixed(1)}亿`
  } else if (num > 1e7) {
    return `${(num / 1e7).toFixed(1)}千万`
  } else if (num > 1e6) {
    return `${(num / 1e6).toFixed(1)}百万`
  } else if (num > 1e4) {
    return `${(num / 1e4).toFixed(1)}万`
  }
  return num
}
