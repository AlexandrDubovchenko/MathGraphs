import './index.css'

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

const symbolTypes = {
  number: 'number',
  operator: 'operator',
  func: 'func'
}

const specialSymbols = ['+', '-', '*', '/', '(', ')']

const canvas = document.querySelector('#canvas')
const input = document.querySelector("#input")
const button = document.querySelector("#button")

button.addEventListener('click', onSubmit)

function onSubmit() {
  const formula = input.value
  const tree = parseFormula(formula)
  console.log(tree)

  console.log(calculateTreeValue(tree, 1))
}

function parseFormula(formula, varValue) {
  const formulaTree = []
  let lastSpecialCharIndex = 0
  let lastFunc = null
  for (let i = 0; i < formula.length; i++) {
    const char = formula[i]
    if (specialSymbols.includes(char)) {
      const value = formula.substr(lastSpecialCharIndex, i - lastSpecialCharIndex).replace(whiteSpaceRegex, '')
      switch (char) {
        case '(':
          const func = {
            type: symbolTypes.func,
            value: mathFunctions[value],
            args: []
          }
          lastFunc = func
          formulaTree.push(func)
          break
        case ')':
          lastFunc.args.push({
            type: symbolTypes.number,
            value
          })
          lastFunc = null
          break
        case '*' || '/':
          if (value) {
            const preoritizeOperation = {
              type: symbolTypes.func,
              value: null,
              args: [{
                type: symbolTypes.number,
                value
              }, {
                type: symbolTypes.operator,
                value: char
              }]
            }
            const tree = lastFunc?.args || formulaTree
            tree.push(preoritizeOperation)
          } else {
            const tree = lastFunc?.args || formulaTree
            setDefaultSymbols(value, char, tree)
          }
          break
        default:
          const tree = lastFunc?.args || formulaTree
          setDefaultSymbols(value, char, tree)
          break
      }
      lastSpecialCharIndex = i + 1
    }
  }
  const rest = formula.substr(lastSpecialCharIndex)
  if (rest) {
    formulaTree.push({
      type: symbolTypes.number,
      value: rest
    })
  }
  return formulaTree
}

function calculateTreeValue(tree, x) {
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

function setDefaultSymbols(value, char, tree) {
  const number = {
    type: symbolTypes.number,
    value
  }
  const operator = {
    type: symbolTypes.operator,
    value: char
  }
  if (value) {
    tree.push(number)
  }
  tree.push(operator)
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
