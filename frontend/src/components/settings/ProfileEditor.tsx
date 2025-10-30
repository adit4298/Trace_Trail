import { motion } from 'framer-motion'

interface ProfileEditorProps {
  name: string
  email: string
  onSave: (data: { name: string; email: string }) => void
}

const ProfileEditor = ({ name, email, onSave }: ProfileEditorProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
    }
    onSave(data)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
      <div className="flex flex-col gap-3">
        <input
          name="name"
          defaultValue={name}
          placeholder="Full name"
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        />
        <input
          name="email"
          defaultValue={email}
          placeholder="Email"
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        />
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Save Changes
      </button>
    </motion.form>
  )
}

export default ProfileEditor