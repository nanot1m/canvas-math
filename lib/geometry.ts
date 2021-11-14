import { Angle } from './Angle'
import { LineSegment } from './LineSegment'
import type { Point } from './Point'

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

export function radToDeg(rad: number) {
  return (rad * 180) / Math.PI
}

export function normalizeRad(rad: number) {
  return (rad + 2 * Math.PI) % (Math.PI * 2)
}
