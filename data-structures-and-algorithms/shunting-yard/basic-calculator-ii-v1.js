export default function calculator (s) {
  // 定义操作符
  const operatorMap = ['+:1', '-:1', '*:2', '/:2'].reduce((prev, cur) => {
    const [sign, priority] = cur.split(':')
    prev[sign] = priority
    return prev
  }, {})
  // 定义数字
  const numMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((prev, cur) => {
    prev[cur] = true
    return prev
  }, {})
  // 运算
  const compute = (a, op, b) => {
    let res
    switch (op) {
      case '+':
        res = a + b
        break
      case '-':
        res = a - b
        break
      case '*':
        res = a * b
        break
      case '/':
        // res = Math.floor(a / b)
        res = a / b
        break
    }
    return res
  }

  const len = s.length
  // 定义 俩个数 一个用来计算和 一个用来计算乘积
  let num, leftNum, rightNum
  // 定义两个操作符
  let leftOper, rightOper
  // 定义空格
  const space = ' '
  // 遍历字符串
  for (let i = 0; i < len; i++) {
    let c = s[i]
    // console.log(c)
    // 读取 token
    if (c === space) {
      // 跳过空格
    } else if (operatorMap[c]) {
      if (!leftOper) {
        leftOper = c
      } else if (!rightOper) {
        rightOper = c
      }
    } else {
      // 读取数字
      num = ''
      while (numMap[c]) {
        num += c
        i++
        c = s[i]
      }
      i--
      // 需要回退一位
      num = parseInt(num)
      if (!leftOper) {
        leftNum = num
      } else if (!rightOper) {
        rightNum = num
      } else {
        // 读取下一个操作数 开始进行计算
        if (operatorMap[leftOper] >= operatorMap[rightOper]) {
          leftNum = compute(leftNum, leftOper, rightNum)
          rightNum = num
          leftOper = rightOper
          rightOper = undefined
        } else {
          rightNum = compute(rightNum, rightOper, num)
          rightOper = undefined
        }
      }
      // console.log(leftNum, leftOper, rightNum, rightOper)
    }
  }
  // console.log(leftNum, leftOper, rightNum, rightOper, num)
  if (leftOper) {
    return compute(leftNum, leftOper, rightNum)
  } else {
    if (rightOper) {
      return compute(leftNum, rightOper, rightNum)
    } else {
      return leftNum
    }
  }
}
