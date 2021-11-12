import Footer from './footer'
import Header from './header'

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
