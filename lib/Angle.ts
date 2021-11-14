import { normalizeRad, radToDeg } from './geometry'

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
