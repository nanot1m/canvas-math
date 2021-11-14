import { ShapeStyles } from './ShapeStyles'
import { Point } from './Point'

export class Circle {
  static from(position: Point, radius: number) {
    return new Circle(position, radius)
  }
  private constructor(public position: Point, public radius: number) {}

  public draw(ctx: CanvasRenderingContext2D, shapeStyles: ShapeStyles = {}) {
    shapeStyles = {
      stroke: 'black',
      ...shapeStyles,
    }
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    if (shapeStyles.fill) {
      ctx.fillStyle = shapeStyles.fill
      ctx.fill()
    }
    if (shapeStyles.stroke) {
      ctx.strokeStyle = shapeStyles.stroke
      ctx.lineWidth = shapeStyles.strokeWidth || 1
      ctx.stroke()
    }
  }
}
