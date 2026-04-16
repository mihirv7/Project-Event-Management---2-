import React from 'react'
import { Users, CalendarDays, BookOpenCheck, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

const iconMap = {
  users: Users,
  events: CalendarDays,
  bookings: BookOpenCheck,
  payments: Wallet,
}

export default function StatCard({ item, index }) {
  const Icon = iconMap[item.type] || Users

  return (
    <motion.div
      className="card stat-card"
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <div className="stat-top">
        <div className="icon-wrap">
          <Icon size={22} />
        </div>
      </div>
      <div className="stat-label">{item.label}</div>
      <div className="stat-value">{item.value}</div>
      <div className="stat-growth">{item.growth} from last month</div>
    </motion.div>
  )
}
