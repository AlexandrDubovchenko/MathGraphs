const symbolTypes = {
  number: 'number',
  operator: 'operator',
  func: 'func'
}

const whiteSpaceRegex = /\s/g
const STEP = 0.1
const VAR = 'x'
const PI = 'PI'
const mathFunctions = {
  sin: (v) => Math.sin(v),
  cos: (v) => Math.cos(v),
  tng: (v) => Math.tan(v),
  ctg: (v) => 1 / Math.tan(v),
}



const specialSymbols = ['+', '-', '*', '/', '(', ')']

export function parseFormula(formula, varValue) {
  const formulaTree = []
  let lastSpecialCharIndex = 0
  let lastFunc = null
  let lastOperation = null
  for (let i = 0; i < formula.length; i++) {
    const char = formula[i]
    if (specialSymbols.includes(char)) {
      const value = formula.substr(lastSpecialCharIndex, i - lastSpecialCharIndex).replace(whiteSpaceRegex, '')
      let tree = lastFunc?.args || formulaTree
      switch (char) {
        case '(':
          const func = {
            type: symbolTypes.func,
            value: mathFunctions[value],
            args: []
          }
          lastFunc = func;
          (lastOperation?.args || tree).push(func)
          lastOperation = null
          break
        case ')':
          (lastOperation?.args || lastFunc.args).push({
            type: symbolTypes.number,
            value
          })
          lastFunc = null
          break
        case '/':
          lastOperation = handlePreoritizeSymbols(tree, value, char, lastOperation)
          break
        case '*':
          lastOperation = handlePreoritizeSymbols(tree, value, char, lastOperation)
          break
        default:
          setDefaultSymbols(value, char, tree, lastOperation)
          lastOperation = null
          break
      }
      lastSpecialCharIndex = i + 1
    }
  }
  const rest = formula.substr(lastSpecialCharIndex)
  if (rest) {
    const tree = lastOperation?.args || lastFunc?.args || formulaTree
    tree.push({
      type: symbolTypes.number,
      value: rest
    })
  }
  return formulaTree
}

export function calculateTreeValue(tree, x) {
  let result = 0
  let currentOperator
  if (!tree?.length) {
    return result
  }
  tree.forEach((node) => {
    switch (node.type) {
      case symbolTypes.number:
        const nodeValue = +node.value.replace(VAR, x).replace(PI, Math.PI)
        result = binaryOperation(result, nodeValue, currentOperator)
        break
      case symbolTypes.operator:
        currentOperator = node.value
        break
      case symbolTypes.func:
        const funcArgsValue = calculateTreeValue(node.args, x)
        const funcValue = node.value ? node.value(funcArgsValue) : funcArgsValue
        result = binaryOperation(result, funcValue, currentOperator)
        break
      default:
        break
    }
  })

  return result
}

function setDefaultSymbols(value, char, tree, operation) {
  const number = {
    type: symbolTypes.number,
    value
  }
  const operator = {
    type: symbolTypes.operator,
    value: char
  }
  if (value) {
    if (operation) {
      operation.args.push(number)
    } else {
      tree.push(number)
    }
  }
  tree.push(operator)
}

function handlePreoritizeSymbols(tree, value, char, operation) {
  if (value) {
    const number = {
      type: symbolTypes.number,
      value
    }
    if (operation) {
      operation.args.push(number)
      operation = null
    } else {
      tree.push(number)
    }
  }
  const preoritizeOperation = {
    type: symbolTypes.func,
    value: null,
    args: [tree.pop(), {
      type: symbolTypes.operator,
      value: char
    }]
  }
  tree.push(preoritizeOperation)
  return preoritizeOperation
}

function binaryOperation(value1, value2, operator) {
  if (!operator) {
    return value1 + value2
  }
  switch (operator) {
    case '+':
      return value1 + value2
    case '-':
      return value1 - value2
    case '*':
      return value1 * value2
    case '/':
      return value1 / value2
  }
}
