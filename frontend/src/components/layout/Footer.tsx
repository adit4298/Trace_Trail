import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <img src="/logo.svg" alt="TraceTrail Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-white">TraceTrail</span>
          </div>
          <p className="text-sm">
            Your privacy companion. Track, analyze, and improve your digital privacy across all
            platforms.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-white font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/insights" className="hover:text-white">
                Insights
              </Link>
            </li>
            <li>
              <Link to="/challenges" className="hover:text-white">
                Challenges
              </Link>
            </li>
            <li>
              <Link to="/connections" className="hover:text-white">
                Connections
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#team" className="hover:text-white">
                Team
              </a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-white font-semibold mb-3">Connect</h3>
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Github size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        <p>
          © {currentYear} <span className="font-semibold text-white">TraceTrail</span>. All rights
          reserved. Built with privacy in mind.
        </p>
      </div>
    </footer>
  )
}

export default Footer
