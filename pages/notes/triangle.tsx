import { Canvas } from '../../components/Canvas'
import Container from '../../components/Container'
import Layout from '../../components/Layout'

const Triangle: React.FC = () => {
  return (
    <Layout>
      <Container>
        <h1 className="text-4xl mb-8">Triangle</h1>
        <Canvas
          width={640}
          height={320}
          draw={(ctx) => {
            const { canvas } = ctx

            const x = 50
            const y = 50
            const width = 400
            const height = 200

            ctx.moveTo(x, y)
            ctx.lineTo(x + width, y + height)
            ctx.lineTo(x, y + height)
            ctx.lineTo(x, y)
            ctx.strokeStyle = 'blue'
            ctx.stroke()
          }}
        />
      </Container>
    </Layout>
  )
}

export default Triangle
