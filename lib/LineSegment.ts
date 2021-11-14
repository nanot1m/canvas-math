import { Angle } from './Angle'
import { Point } from './Point'

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
