import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { RiskHistory } from '@types/dashboard.types'
import { motion } from 'framer-motion'

interface RiskChartProps {
  data: RiskHistory[]
  title?: string
}

const RiskChart = ({ data, title = 'Risk Score Trend' }: RiskChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={{ stroke: '#9CA3AF' }}
            domain={[0, 100]}
            label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F9FAFB',
              padding: '12px',
            }}
            labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            itemStyle={{ color: '#0ea5e9' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
          <Line
            type="monotone"
            dataKey="score"
            name="Privacy Risk Score"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', r: 5 }}
            activeDot={{ r: 7, fill: '#0284c7' }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>

      <div>
        <div>
          <p>Current</p>
          <p>{data[data.length - 1]?.score || 0}</p>
        </div>
        <div>
          <p>Average</p>
          <p>{Math.round(data.reduce((acc, d) => acc + d.score, 0) / data.length)}</p>
        </div>
        <div>
          <p>Peak</p>
          <p>{Math.max(...data.map(d => d.score))}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default RiskChart