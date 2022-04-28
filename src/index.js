import { drawGraph, initGraph, resetCanvas } from './canvasMethods'
import { parseFormula } from './formulaParcer'
import './index.css'

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const input = document.querySelector("#input")

const submitBtn = document.querySelector("#submit")

const resetBtn = document.querySelector("#reset")

submitBtn.addEventListener('click', onSubmit)
resetBtn.addEventListener('click', () => resetCanvas(ctx))

initGraph(ctx)

function onSubmit() {
  const formula = input.value
  const tree = parseFormula(formula)
  drawGraph(ctx, tree)
}



