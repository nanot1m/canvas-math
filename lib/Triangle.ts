import { getAngleBetween, normalizeRad } from './geometry'
import { ShapeStyles } from './ShapeStyles'
import { TextStyles } from './TextStyles'
import { Point } from './Point'
import { LineSegment } from './LineSegment'
import { Angle } from './Angle'

export class Triangle {
  static from(a: Point, b: Point, c: Point): Triangle {
    return new Triangle(a, b, c)
  }
  private constructor(public a: Point, public b: Point, public c: Point) {}

  contains(p: Point): boolean {
    const angleAPC = getAngleBetween(this.a, p, this.c)
    const angleBPC = getAngleBetween(this.b, p, this.c)
    const angleBPA = getAngleBetween(this.b, p, this.a)
    const angleSum = normalizeRad(angleAPC.rad + angleBPC.rad + angleBPA.rad)
    return (
      Math.abs(angleSum) < 0.001 || Math.abs(angleSum - Math.PI * 2) < 0.001
    )
  }

  drawShape(ctx: CanvasRenderingContext2D, shapeStyles: ShapeStyles = {}) {
    shapeStyles = {
      stroke: 'black',
      ...shapeStyles,
    }

    ctx.beginPath()
    ctx.moveTo(this.a.x, this.a.y)
    ctx.lineTo(this.b.x, this.b.y)
    ctx.lineTo(this.c.x, this.c.y)
    ctx.lineTo(this.a.x, this.a.y)
    if (shapeStyles.fill) {
      ctx.fillStyle = shapeStyles.fill
      ctx.fill()
    }
    if (shapeStyles.stroke) {
      ctx.strokeStyle = shapeStyles.stroke
      ctx.lineWidth = shapeStyles.strokeWidth || 1
      ctx.stroke()
    }
    return this
  }

  drawAngles(
    ctx: CanvasRenderingContext2D,
    shapeStyles: ShapeStyles = {},
    textStyles: TextStyles = {},
  ) {
    shapeStyles = {
      fill: 'pink',
      stroke: 'red',
      ...shapeStyles,
    }

    this.drawAngle(ctx, this.a, this.b, this.c, shapeStyles, textStyles)
    this.drawAngle(ctx, this.b, this.c, this.a, shapeStyles, textStyles)
    this.drawAngle(ctx, this.c, this.a, this.b, shapeStyles, textStyles)

    return this
  }

  private drawAngle(
    ctx: CanvasRenderingContext2D,
    a: Point,
    b: Point,
    c: Point,
    shapeStyles: ShapeStyles,
    textStyles: TextStyles,
  ) {
    const ba = LineSegment.from(b, a)
    const bc = LineSegment.from(b, c)

    let startAngle = bc.angle.rad
    let endAngle = ba.angle.rad

    if (normalizeRad(endAngle - startAngle) > Math.PI) {
      const t = endAngle
      endAngle = startAngle
      startAngle = t
    }

    if (endAngle < startAngle) {
      endAngle += Math.PI * 2
    }

    const radius = (ba.length + bc.length) / 10

    ctx.beginPath()
    ctx.moveTo(b.x, b.y)
    ctx.arc(b.x, b.y, radius, startAngle, endAngle)
    if (shapeStyles.fill) {
      ctx.fillStyle = shapeStyles.fill
      ctx.fill()
    }
    if (shapeStyles.stroke) {
      ctx.strokeStyle = shapeStyles.stroke
      ctx.lineWidth = shapeStyles.strokeWidth || 1
      ctx.stroke()
    }

    const midAngle = (endAngle + startAngle) / 2

    textStyles = {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: 'black',
      ...textStyles,
    }

    const delta = radius + 10
    const x = b.x + Math.cos(midAngle) * delta
    const y = b.y + Math.sin(midAngle) * delta
    const text = Angle.fromRad(endAngle - startAngle).deg.toFixed(0) + '??'

    ctx.beginPath()
    if (textStyles.fontSize) {
      ctx.font = `${textStyles.fontSize} ${textStyles.fontFamily ?? 'Arial'}`
    }
    if (textStyles.color) {
      ctx.fillStyle = textStyles.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, x, y)
    }
  }

  drawPoints(ctx: CanvasRenderingContext2D, textStyles: TextStyles = {}) {
    textStyles = {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: 'black',
      ...textStyles,
    }

    if (textStyles.fontSize) {
      ctx.font = `${textStyles.fontSize} ${textStyles.fontFamily ?? 'Arial'}`
    }
    if (textStyles.color) {
      ctx.fillStyle = textStyles.color
      ctx.textAlign = 'center'
      this.drawPoint(ctx, 'A', this.c, this.a, this.b, textStyles)
      this.drawPoint(ctx, 'B', this.a, this.b, this.c, textStyles)
      this.drawPoint(ctx, 'C', this.b, this.c, this.a, textStyles)
    }
    return this
  }

  private drawPoint(
    ctx: CanvasRenderingContext2D,
    label: string,
    a: Point,
    b: Point,
    c: Point,
    textStyles: TextStyles,
  ) {
    ctx.beginPath()
    ctx.arc(b.x, b.y, 3, 0, 2 * Math.PI)
    ctx.fillStyle = 'black'
    ctx.fill()

    const ba = LineSegment.from(b, a)
    const bc = LineSegment.from(b, c)

    let startAngle = bc.angle.rad
    let endAngle = ba.angle.rad

    if (normalizeRad(endAngle - startAngle) > Math.PI) {
      const t = endAngle
      endAngle = startAngle
      startAngle = t
    }

    if (endAngle < startAngle) {
      endAngle += Math.PI * 2
    }

    const midAngle = (endAngle + startAngle) / 2 - Math.PI

    const x = b.x + Math.cos(midAngle) * 12
    const y = b.y + Math.sin(midAngle) * 12

    if (textStyles.fontSize) {
      ctx.font = `${textStyles.fontSize} ${textStyles.fontFamily ?? 'Arial'}`
    }
    if (textStyles.color) {
      ctx.fillStyle = textStyles.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x, y)
    }
  }
}
