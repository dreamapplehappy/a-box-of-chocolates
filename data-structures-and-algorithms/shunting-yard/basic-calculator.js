export default function calculator (s) {
  const op = {
    '+': true,
    '-': true,
    '(': true,
    ')': true
  }
  const compute = (a, op, b) => {
    let sum
    switch (op) {
      case '+':
        sum = a + b
        break
      case '-':
        sum = a - b
        break
    }
    return sum
  }
  // 第一步读取 token
  function readToken (s) {
    const tokens = []
    // 除去空格
    s = s.replace(/\s/g, '')
    let num = ''
    for (const c of s) {
      if (op[c]) {
        if (num.length > 0) {
          tokens.push(parseInt(num))
          num = ''
        }
        if (c === '-') {
          const last = tokens[tokens.length - 1]
          if (last === '(' || last === undefined) {
            tokens.push(0, '-')
          } else {
            tokens.push(c)
          }
        } else {
          tokens.push(c)
        }
      } else {
        num += c
      }
    }
    if (num) {
      tokens.push(parseInt(num))
    }
    // console.log(tokens)
    return tokens
  }
  // 处理 tokens
  function computeTokens (tokens) {
    tokens = tokens.reverse()
    // console.log(tokens)
    const stack = []
    let token, stackLen, top, oper, left, right
    while (tokens.length > 0) {
      token = tokens.pop()
      // 数字
      if (!op[token]) {
        // console.log('数字 运算符')
        if (stack.length === 0) {
          stack.push(token)
        } else {
          stackLen = stack.length
          top = stack[stackLen - 1]
          if (op[top]) {
            oper = stack.pop()
            left = stack.pop()
            // console.log(left, oper, token)
            stack.push(compute(left, oper, token))
          }
        }
      } else if (token === '(') {
        // console.log('(+ -) 运算符')
        // 左括号；遇到左括号，判断下一个token 是否还是(, 如果不是直接把下一个值入栈
        const nextToken = tokens[tokens.length - 1]
        if (nextToken === '(') {
          tokens.pop()
          stack.push(0, '+')
        } else {
          token = tokens.pop()
          stack.push(token)
        }
      } else if (token === ')') {
        // console.log(') 运算符')
        if (stack.length >= 3) {
          // 右括号
          right = stack.pop()
          oper = stack.pop()
          left = stack.pop()
          stack.push(compute(left, oper, right))
        }
      } else {
        // console.log('+ - 运算符')
        // + - 运算符
        stack.push(token)
      }
      // console.log(stack)
    }
    // console.log(stack)
    return stack[0]
  }

  return computeTokens(readToken(s))
}
