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
}
