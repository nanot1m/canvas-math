import Link from 'next/link'
import Container from '../components/container'
import Layout from '../components/layout'

export default function Index() {
  return (
    <Layout>
      <Container>
        <h1 className="text-4xl mb-8">Table of contents</h1>
        <ul className="flex flex-col">
          <li className="list-item list-disc list-inside">
            <Link href="notes/triangle">
              <a className="hover:text-blue-600">Triangle</a>
            </Link>
          </li>
        </ul>
      </Container>
    </Layout>
  )
}
