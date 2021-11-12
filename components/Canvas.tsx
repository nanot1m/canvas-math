import { useEffect, useRef } from 'react'

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void | (() => void)
  width: number
  height: number
}

function scaleCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const ratio = window.devicePixelRatio || 1

  if (ratio !== 1) {
    const canvas = context.canvas
    canvas.width = width * ratio
    canvas.height = height * ratio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.scale(ratio, ratio)
  }
}

export function Canvas({ draw, width, height }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      scaleCanvas(ctx, width, height)
    }
  }, [])

  useEffect(() => {
    console.log('running effect')
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      console.log('has context, clearing canvas')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      const destroy = draw(ctx)
      return () => {
        console.log('destroying')
        destroy?.()
      }
    }
  }, [width, height, draw])

  return (
    <div>
      <canvas
        className="border bg-white mb-4"
        width={width}
        height={height}
        ref={canvasRef}
      />
      <textarea
        className="font-mono w-full text-sm resize-none bg-red-50"
        readOnly
        value={draw.toString()}
        rows={10}
      />
    </div>
  )
}
