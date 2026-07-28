import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, Package, BookOpenCheck, Truck, Wallet, Star, BarChart3, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpenCheck },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/vendors', label: 'Custom Events', icon: Truck },
  { to: '/admin/catering', label: 'Catering Categories', icon: Package },
  { to: '/admin/catering-menu', label: 'Catering Menu', icon: Package },
  { to: '/admin/payments', label: 'Payments', icon: Wallet },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="brand">
        <div className="brand-badge">EM</div>
        <div>
          <h2>Event Admin</h2>
          <p>Control Center</p>
        </div>
      </div>

      <div className="nav-list">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.to}
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          )
        })}
      </div>
    </motion.aside>
  )
}
