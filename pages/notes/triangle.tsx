import { useRef, useState } from 'react'
import { Canvas } from '../../components/canvas'
import Container from '../../components/container'
import Layout from '../../components/layout'
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
      Point.from(220, 150),
      Point.from(280, 310),
      Point.from(30, 280),
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
          return distance < 400
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
      hoveredPoint.draw(ctx)
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
        <div className={hoveredPoint ? 'cursor-move' : undefined}>
          <Canvas width={300} height={320} draw={draw} />
        </div>
      </Container>
    </Layout>
  )
}

export default TriangleNote
