import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} /> Dark Mode
        </>
      ) : (
        <>
          <Sun size={16} /> Light Mode
        </>
      )}
    </button>
  )
}

export default ThemeToggle