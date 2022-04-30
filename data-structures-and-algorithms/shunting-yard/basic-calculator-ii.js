export default function calculator (s) {
  // 第一步移除空格
  const s1 = s.replace(/\s/g, '')
  const s1l = s1.length
  let num = ''
  let c
  const op = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  }
  const queue = []
  for (let i = 0; i < s1l; i++) {
    c = s1[i]
    if (op[c]) {
      queue.push(parseInt(num))
      num = ''
      queue.push(c)
    } else {
      num += c
    }
  }

  // console.log(num, queue)
  queue.push(parseInt(num))

  queue.reverse()
  // console.log(queue)
  let left, op1, middle, op2, right, top
  let isPointInLeft = true
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
  while (queue.length > 0) {
    top = queue.pop()
    if (op[top] === undefined) {
      // 是操作符
      if (left === undefined) {
        left = top
      } else if (middle === undefined) {
        middle = top
      } else {
        if (right === undefined) {
          right = top
          // console.log(s)
          // console.log(left, op1, middle, op2, right)
          // 第二个操作符要判断优先级
          if (op[op1] < op[op2]) {
            isPointInLeft = false
          } else {
            isPointInLeft = true
          }
          if (isPointInLeft) {
            left = compute(left, op1, middle)
            op1 = op2
            middle = right
            op2 = undefined
            right = undefined
          } else {
            middle = compute(middle, op2, right)
            op2 = undefined
            right = undefined
          }
        }
      }
    } else {
      // 是操作数
      if (op1 === undefined) {
        op1 = top
      } else {
        if (op2 === undefined) {
          op2 = top
        }
      }
    }
  }
  console.log(left, op1, middle, op2, right)
  // console.log('end', queue)
  // 处理最后的计算
  if (op1 === undefined) {
    return left
  } else {
    return compute(left, op1, middle)
  }
}
