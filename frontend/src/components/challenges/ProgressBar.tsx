interface ProgressBarProps {
  progress: number
  color?: string
}

const ProgressBar = ({ progress, color = '#0ea5e9' }: ProgressBarProps) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
      <div
        className="h-3 rounded-full transition-all"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )
}

export default ProgressBar