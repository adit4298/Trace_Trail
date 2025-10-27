import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { useAuth } from '@hooks/useAuth'

const Layout = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
