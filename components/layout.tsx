import Footer from './Footer'
import Header from './Header'

const Layout: React.FC<{}> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 py-8">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
