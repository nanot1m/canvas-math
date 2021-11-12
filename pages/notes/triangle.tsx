import { useRef, useState } from 'react'
import { Canvas } from '../../components/Canvas'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import { Point, Triangle } from '../../lib/geometry'

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
      Point.from(20, 30),
      Point.from(120, 30),
      Point.from(120, 130),
    ),
    Triangle.from(
      Point.from(170, 30),
      Point.from(170, 130),
      Point.from(320, 210),
    ),
    Triangle.from(
      Point.from(420, 30),
      Point.from(320, 130),
      Point.from(420, 130),
    ),
  ])

  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null)

  function draw(ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx

    function handlePointerDown(e: PointerEvent) {
      e.preventDefault()
      const { clientX, clientY } = e
      const x = clientX - canvas.offsetLeft
      const y = clientY - canvas.offsetTop

      let targetPoint: Point | undefined
      for (const triangle of triangles) {
        const points = [triangle.a, triangle.b, triangle.c]
        targetPoint = points.find((point) => {
          const distance = point.squareDistanceTo(Point.from(x, y))
          return distance < 15 ** 2
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
          return distance < 400
        })
        if (targetPoint) {
          break
        }
      }

      if (targetPoint) {
        setHoveredPoint(targetPoint)
      } else {
        setHoveredPoint(null)
      }
    }

    canvas.addEventListener('pointermove', handlePointerMove)

    triangles.forEach((triangle) => {
      triangle.drawAngles(ctx).drawShape(ctx).drawPoints(ctx)
    })

    if (hoveredPoint) {
      hoveredPoint.draw(ctx)
    }

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
    }
  }

  return (
    <Layout>
      <Container>
        <h1 className="text-4xl mb-8">Triangle</h1>
        <div className={hoveredPoint ? 'cursor-move' : undefined}>
          <Canvas width={640} height={320} draw={draw} />
        </div>
      </Container>
    </Layout>
  )
}

export default TriangleNote