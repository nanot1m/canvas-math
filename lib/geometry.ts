export class Point {
  static from(x: number, y: number): Point {
    return new Point(x, y)
  }
  private constructor(public x: number, public y: number) {}

  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y
  }

  public distanceTo(point: Point) {
    return Math.sqrt(this.squareDistanceTo(point))
  }

  public squareDistanceTo(point: Point) {
    return Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI)
    ctx.globalAlpha = 0.3
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.stroke()
  }
}

export class LineSegment {
  static from(start: Point, end: Point): LineSegment {
    return new LineSegment(start, end)
  }
  private constructor(public start: Point, public end: Point) {}

  get angle() {
    return Angle.fromRad(
      Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x),
    )
  }

  get length() {
    return Math.sqrt(this.squareLength)
  }

  get squareLength() {
    return (
      Math.pow(this.end.x - this.start.x, 2) +
      Math.pow(this.end.y - this.start.y, 2)
    )
  }
}

export interface ShapeStyles {
  fill?: string | null
  stroke?: string | null
  strokeWidth?: number | null
}

export interface TextStyles {
  fontSize?: string | null
  fontFamily?: string | null
  color?: string | null
}

export class Triangle {
  static from(a: Point, b: Point, c: Point): Triangle {
    return new Triangle(a, b, c)
  }
  private constructor(public a: Point, public b: Point, public c: Point) {}

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

  drawAngles(ctx: CanvasRenderingContext2D, shapeStyles: ShapeStyles = {}) {
    shapeStyles = {
      fill: 'pink',
      stroke: 'red',
      ...shapeStyles,
    }

    this.drawAngle(ctx, this.a, this.b, this.c, shapeStyles)
    this.drawAngle(ctx, this.b, this.c, this.a, shapeStyles)
    this.drawAngle(ctx, this.c, this.a, this.b, shapeStyles)

    return this
  }

  private drawAngle(
    ctx: CanvasRenderingContext2D,
    a: Point,
    b: Point,
    c: Point,
    shapeStyles: ShapeStyles,
  ) {
    const ba = LineSegment.from(b, a)
    const bc = LineSegment.from(b, c)

    ctx.beginPath()
    ctx.moveTo(b.x, b.y)
    let startAngle = ba.angle.rad
    let endAngle = bc.angle.rad

    if (normalizeRad(startAngle - endAngle) > Math.PI) {
      const t = startAngle
      startAngle = endAngle
      endAngle = t
    }

    ctx.arc(b.x, b.y, (ba.length + bc.length) / 10, endAngle, startAngle)

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
      ctx.fillText(`a`, this.a.x, this.a.y)
      ctx.fillText(`b`, this.b.x, this.b.y)
      ctx.fillText(`c`, this.c.x, this.c.y)
    }
    return this
  }
}

export class Angle {
  public static fromRad(angleInRad: number) {
    return new Angle(angleInRad)
  }

  public static fromDeg(angleInDeg: number) {
    return new Angle((angleInDeg * Math.PI) / 180)
  }

  private constructor(private angleInRad: number) {}

  get rad() {
    return normalizeRad(this.angleInRad)
  }

  get deg() {
    return radToDeg(this.rad)
  }
}

export function getAngleBetween(a: Point, b: Point, c: Point) {
  const ab = LineSegment.from(a, b)
  const bc = LineSegment.from(b, c)
  const ac = LineSegment.from(a, c)

  return Angle.fromRad(
    Math.acos(
      (ab.squareLength + bc.squareLength - ac.squareLength) /
        (2 * ab.length * bc.length),
    ),
  )
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI
}

function normalizeDeg(deg: number) {
  return (deg + 360) % 360
}

function normalizeRad(rad: number) {
  return (rad + 2 * Math.PI) % (Math.PI * 2)
}
