import Link from 'next/link'
import Container from './container'

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <Container>
        <div className="flex justify-between align-baseline">
          <div className="md:-mx-8">
            <Link href="/">
              <a className="inline-block text-lg md:px-8 md:py-4 px-2 py-2 uppercase font-bold hover:text-blue-600 hover:bg-gray-200 sm:px-2">
                Canvas Maths
              </a>
            </Link>
          </div>
          <div className="flex justify-end">
            <span className="md:px-8 md:py-4 px-2 py-2">Content</span>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
