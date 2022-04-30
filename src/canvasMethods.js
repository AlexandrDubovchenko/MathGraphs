import { calculateTreeValue } from "./formulaParcer";

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500

const GRAPH_START = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2
}
const STEP = 0.1
const SCALE = 25

export function drawLine(ctx, start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.closePath();
  ctx.stroke();
}

export function resetCanvas(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  initGraph(ctx)
}

export function initGraph(ctx) {
  const xAxisPoints = {
    start: {
      x: 0,
      y: CANVAS_HEIGHT / 2
    },
    end: {
      x: CANVAS_WIDTH,
      y: CANVAS_HEIGHT / 2
    }
  }
  const yAxisPoints = {
    start: {
      x: CANVAS_WIDTH / 2,
      y: 0
    },
    end: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT
    }
  }
  drawLine(ctx, xAxisPoints.start, xAxisPoints.end)
  drawLine(ctx, yAxisPoints.start, yAxisPoints.end)
}

export function drawGraph(ctx, tree) {
  let startPoint = null
  for (let i = -10; i <= 10; i += STEP) {
    const point = {
      x: GRAPH_START.x + i * SCALE,
      y: GRAPH_START.y - calculateTreeValue(tree, i) * SCALE
    }
    if (!startPoint) {
      startPoint = point
      continue
    }
    drawLine(ctx, startPoint, point)
    startPoint = point
  }
}
