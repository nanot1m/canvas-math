import Container from './container'

const Footer: React.FC = ({ children }) => {
  return (
    <footer className="py-4 bg-gray-600 text-white">
      <Container>Some footer notes will go here</Container>
    </footer>
  )
}

export default Footer
