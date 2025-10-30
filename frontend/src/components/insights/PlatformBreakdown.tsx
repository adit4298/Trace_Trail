import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { PlatformBreakdown as PlatformData } from '@types/dashboard.types'
import { motion } from 'framer-motion'

interface PlatformBreakdownProps {
  data: PlatformData[]
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  default: '#6B7280',
}

const PlatformBreakdown = ({ data }: PlatformBreakdownProps) => {
  const chartData = data.map((item) => ({
    name: item.platform.charAt(0).toUpperCase() + item.platform.slice(1),
    value: item.connections,
    percentage: item.percentage,
    riskScore: item.risk_score,
  }))

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3>Platform Distribution</h3>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  PLATFORM_COLORS[entry.name.toLowerCase()] ||
                  PLATFORM_COLORS.default
                }
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F9FAFB',
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>

      {/* Platform Details */}
      <div>
        {data.map((platform, index) => (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
          >
            <div>
              <span>{platform.platform}</span>
            </div>
            <div>
              <span>{platform.connections} connections</span>
              <span>{platform.risk_score}% risk</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default PlatformBreakdown