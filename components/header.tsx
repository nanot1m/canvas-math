import Link from 'next/link'
import Container from './Container'

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <Container>
        <div className="flex justify-between align-baseline">
          <div className="-ml-8">
            <Link href="/">
              <a className="inline-block text-lg px-8 py-4 uppercase font-bold hover:text-blue-600 hover:bg-gray-200">
                Canvas Maths
              </a>
            </Link>
          </div>
          <div className="flex justify-end -mr-8">
            <span className="px-8 py-4">Content</span>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
