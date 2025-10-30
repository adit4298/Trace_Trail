interface ImpactIndicatorProps {
  level: 'low' | 'medium' | 'high'
}

const colors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
}

const ImpactIndicator = ({ level }: ImpactIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colors[level]}`} />
      <span className="capitalize text-sm">{level} impact</span>
    </div>
  )
}

export default ImpactIndicator