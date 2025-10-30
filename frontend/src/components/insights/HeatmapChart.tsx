import { motion } from 'framer-motion'

interface HeatmapData {
  day: string
  hour: number
  value: number
}

interface HeatmapChartProps {
  data: HeatmapData[]
  title: string
}

const HeatmapChart = ({ data, title }: HeatmapChartProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-200 dark:bg-gray-700'
    if (value < 25) return 'bg-green-200 dark:bg-green-900 hover:bg-green-300 dark:hover:bg-green-800'
    if (value < 50) return 'bg-yellow-200 dark:bg-yellow-900 hover:bg-yellow-300 dark:hover:bg-yellow-800'
    if (value < 75) return 'bg-orange-200 dark:bg-orange-900 hover:bg-orange-300 dark:hover:bg-orange-800'
    return 'bg-red-200 dark:bg-red-900 hover:bg-red-300 dark:hover:bg-red-800'
  }

  const getIntensity = (value: number) => Math.min(value / 100, 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3>{title}</h3>

      <div>
        <div>
          {/* Hour labels */}
          <div>
            <div>
              {hours.map((hour) => (
                <div key={hour}>{hour}</div>
              ))}
            </div>

            {/* Heatmap grid */}
            {days.map((day, dayIndex) => (
              <div key={day}>
                <div>{day}</div>
                {hours.map((hour) => {
                  const dataPoint = data.find((d) => d.day === day && d.hour === hour)
                  const value = dataPoint?.value || 0
                  return (
                    <motion.div
                      key={`${day}-${hour}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (dayIndex * 24 + hour) * 0.001 }}
                      className={`flex-1 aspect-square ${getColor(
                        value
                      )} mx-0.5 rounded cursor-pointer transition-all`}
                      style={{ opacity: 0.3 + getIntensity(value) * 0.7 }}
                      title={`${day} ${hour}:00 - ${value}% risk`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div>
        <span>Less</span>
        <div>
          {[0, 25, 50, 75, 100].map((value) => (
            <div key={value}></div>
          ))}
        </div>
        <span>More</span>
      </div>
    </motion.div>
  )
}

export default HeatmapChart