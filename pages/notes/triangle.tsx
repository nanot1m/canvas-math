import { useRef, useState } from 'react'
import { Canvas } from '../../components/canvas'
import Container from '../../components/container'
import Layout from '../../components/layout'
import { getAngleBetween } from '../../lib/geometry'
import { Point } from '../../lib/Point'
import { Circle } from '../../lib/Circle'
import { Triangle } from '../../lib/Triangle'

const POINT_TOUCH_RADIUS = 20

function useForceUpdate() {
  const [, setTick] = useState(0)
  return () => setTick((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER)
}

function useMutable<T>(data: T) {
  const dataRef = useRef(data)
  return [dataRef.current, useForceUpdate()] as const
}

const TriangleNote: React.FC = () => {
  const [triangles, forceUpdate] = useMutable<Triangle[]>([
    Triangle.from(
      Point.from(190, 55),
      Point.from(240, 235),
      Point.from(30, 180),
    ),
  ])

  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null)

  function draw(ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx

    let isMouse = false

    function handleMouseDown() {
      isMouse = true
    }
    function handleMouseUp() {
      requestAnimationFrame(() => {
        isMouse = false
      })
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)

    function handlePointerDown(e: PointerEvent) {
      const { clientX, clientY } = e
      const x = clientX - canvas.offsetLeft
      const y = clientY - canvas.offsetTop

      let targetPoint: Point | undefined
      for (const triangle of triangles) {
        const points = [triangle.a, triangle.b, triangle.c]
        targetPoint = points.find((point) => {
          const distance = point.squareDistanceTo(Point.from(x, y))
          return distance < POINT_TOUCH_RADIUS * POINT_TOUCH_RADIUS
        })
        if (targetPoint) {
          break
        }
      }

      let prevX = x
      let prevY = y
      function handlePointerMove(e: PointerEvent) {
        if (!targetPoint) {
          return
        }
        e.preventDefault()
        const { clientX, clientY } = e
        const x = clientX - canvas.offsetLeft
        const y = clientY - canvas.offsetTop
        const dx = x - prevX
        const dy = y - prevY
        targetPoint.x += dx
        targetPoint.y += dy
        forceUpdate()
        prevX = x
        prevY = y
      }

      function handlePointerUp() {
        canvas.removeEventListener('pointermove', handlePointerMove)
        canvas.removeEventListener('pointerup', handlePointerUp)
        if (!isMouse) {
          setHoveredPoint(null)
        }
      }

      canvas.addEventListener('pointermove', handlePointerMove)
      canvas.addEventListener('pointerup', handlePointerUp)
    }

    canvas.addEventListener('pointerdown', handlePointerDown)

    function handlePointerMove(e: PointerEvent) {
      e.preventDefault()
      const { clientX, clientY } = e
      const x = clientX - canvas.offsetLeft
      const y = clientY - canvas.offsetTop

      let targetPoint: Point | undefined
      for (const triangle of triangles) {
        const points = [triangle.a, triangle.b, triangle.c]
        targetPoint = points.find((point) => {
          const distance = point.squareDistanceTo(Point.from(x, y))
          return distance < POINT_TOUCH_RADIUS * POINT_TOUCH_RADIUS
        })
        if (targetPoint) {
          break
        }
      }

      if (targetPoint) {
        if (hoveredPoint === null) {
          setHoveredPoint(targetPoint)
        }
      } else {
        setHoveredPoint(null)
      }
    }

    canvas.addEventListener('pointermove', handlePointerMove)

    triangles.forEach((triangle) => {
      triangle.drawAngles(ctx).drawShape(ctx).drawPoints(ctx)
    })

    if (hoveredPoint) {
      Circle.from(hoveredPoint, POINT_TOUCH_RADIUS).draw(ctx, {
        strokeWidth: 2,
        stroke: 'black',
      })
    }

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }

  return (
    <Layout>
      <Container>
        <h1 className="sm:text-4xl sm:mb-8 text-3xl mb-6">Triangle</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={hoveredPoint ? 'cursor-move' : undefined}>
            <Canvas width={300} height={320} draw={draw} />
          </div>
          <div>
            {triangles.map((triangle, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold mb-4">Triangle {idx + 1}</h3>

                <h4 className="text-base font-bold mb-2">Points</h4>
                <ul className="mb-4 font-mono">
                  <li>
                    A: ({triangle.a.x.toFixed(2)}
                    {', '}
                    {triangle.a.y.toFixed(2)})
                  </li>
                  <li>
                    B: ({triangle.b.x.toFixed(2)}
                    {', '}
                    {triangle.b.y.toFixed(2)})
                  </li>
                  <li>
                    C: ({triangle.c.x.toFixed(2)}
                    {', '}
                    {triangle.c.y.toFixed(2)})
                  </li>
                </ul>

                <h4 className="text-base font-bold mb-2">Angles</h4>
                <ul className="font-mono">
                  <li>
                    ∡BAC:{' '}
                    {getAngleBetween(
                      triangle.b,
                      triangle.a,
                      triangle.c,
                    ).deg.toFixed(2)}
                    °
                  </li>
                  <li>
                    ∡ABC:{' '}
                    {getAngleBetween(
                      triangle.a,
                      triangle.b,
                      triangle.c,
                    ).deg.toFixed(2)}
                    °
                  </li>
                  <li>
                    ∡ACB:{' '}
                    {getAngleBetween(
                      triangle.a,
                      triangle.c,
                      triangle.b,
                    ).deg.toFixed(2)}
                    °
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default TriangleNote
