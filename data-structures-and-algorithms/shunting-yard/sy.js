// 左结合
const LEFT_ASSOCIATIVITY = -1
// 右结合
// eslint-disable-next-line no-unused-vars
const RIGHT_ASSOCIATIVITY = 1

// 定义操作符的优先级以及结合性
// 参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table
const OPERATOR_PRECEDENCE_AND_ASSOCIATIVITY = {
  '+': { precedence: 12, associativity: LEFT_ASSOCIATIVITY },
  '-': { precedence: 12, associativity: LEFT_ASSOCIATIVITY },
  '*': { precedence: 13, associativity: LEFT_ASSOCIATIVITY },
  '/': { precedence: 13, associativity: LEFT_ASSOCIATIVITY },
  '(': { precedence: 19, associativity: LEFT_ASSOCIATIVITY },
  ')': { precedence: 19, associativity: LEFT_ASSOCIATIVITY }
}

// 获取输入字符串的 tokens， 返回 tokens 数组
function extractTokens (expression) {
  // 过滤掉空格
  const tokensStr = expression.replace(/\s/g, '')
  const tokens = []
  let number = ''
  for (const char of tokensStr) {
    // TODO 当前只需要处理数字就好，以后可以优化
    if (/\d/.test(char)) {
      number += char
    } else {
      // 获取数字
      if (number !== '') {
        // TODO 当前暂时只考虑整数
        tokens.push(parseInt(number))
        // 重置
        number = ''
      }
      tokens.push(char)
    }
  }
  // 如果 number 有值
  if (number !== '') {
    tokens.push(parseInt(number))
  }
  console.log(`获取的tokens数组内容是：${tokens}`)
  return tokens
}

// 获取栈顶的元素
const stackTopEle = (stack) => stack[stack.length - 1]
// 栈是否为空
const isEmpty = (stack) => stack.length === 0
// 获取后缀表达式
function convert2PostfixExpr (tokens) {
  const opaa = OPERATOR_PRECEDENCE_AND_ASSOCIATIVITY
  const stack = []
  const queue = []
  for (const token of tokens) {
    if (typeof token === 'number') {
      queue.push(token)
    } else {
      // 左括号
      if (token === '(') {
        stack.push(token)
      } else if (token === ')') {
        // 确保操作符栈不为空
        while (!isEmpty(stack) && stackTopEle(stack) !== '(') {
          queue.push(stack.pop())
        }
        // 循环结束，找到了 ( 并且丢弃掉； TODO 异常判断
        stack.pop()
      } else {
        // 判断结合性和优先级
        let topEle = stackTopEle(stack)

        while (
        // 确保栈不为空
          (!isEmpty(stack)) &&
          // 栈顶元素不是 (
          (topEle !== '(') &&
          // 栈顶操作符的优先级 大于等于 当前操作符
            (opaa[topEle].precedence >= opaa[token].precedence) &&
          // 当前操作符的结合性是左结合的
            (opaa[token].associativity === LEFT_ASSOCIATIVITY)) {
          // 优先级高的操作符出栈
          queue.push(stack.pop())
          // 更新栈顶元素
          topEle = stackTopEle(stack)
        }
        // 循环结束可以入栈
        stack.push(token)
      }
    }
    console.log(`符号栈：[${stack}] --> 后缀表达式队列：[${queue}]`)
  }
  while (stackTopEle(stack) !== undefined) {
    queue.push(stack.pop())
  }
  console.log(`最终后缀表表达式：${queue}`)
  return queue
}

// 计算后缀表达式的值
function computePostfixExprVal (tokens) {
  const stack = []
  // 获取操作数
  const getOperands = () => {
    const right = stack.pop()
    const left = stack.pop()
    return {
      l: left,
      r: right
    }
  }
  // 定义左右操作数
  let operands
  while (tokens.length > 0) {
    const token = tokens.shift()
    console.log(token)
    switch (token) {
      case '+':
        operands = getOperands()
        stack.push(operands.l + operands.r)
        break
      case '-':
        operands = getOperands()
        stack.push(operands.l - operands.r)
        break
      case '*':
        operands = getOperands()
        stack.push(operands.l * operands.r)
        break
      case '/':
        operands = getOperands()
        stack.push(operands.l / operands.r)
        break
      default:
        stack.push(token)
    }
    console.log(`符号栈：${stack} -> 剩余后缀表达式：${tokens}`)
  }
  // 返回最后的值
  return stack[0]
}

// 导出简易版计算器
export default function calculator (str) {
  const tokens = extractTokens(str)
  const postfix = convert2PostfixExpr(tokens)
  return computePostfixExprVal(postfix)
}
