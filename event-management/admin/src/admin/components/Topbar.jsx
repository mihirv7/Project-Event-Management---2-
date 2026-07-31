import React from 'react'
import { Search, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const titles = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/users': 'Users Management',
  '/admin/events': 'Events Management',
  '/admin/packages': 'Packages Management',
  '/admin/bookings': 'Bookings Management',
  '/admin/vendors': 'Vendors Management',
  '/admin/payments': 'Payments Management',
  '/admin/reviews': 'Reviews Management',
  '/admin/reports': 'Reports & Analytics',
  '/admin/settings': 'Admin Settings',
}

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate();
  const title = titles[location.pathname] || 'Admin Panel'
  const handleLogout = () => {

  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");

  navigate("/admin/login");

};

  return (
    <motion.div
      className="topbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1>{title}</h1>
        <p>Manage your event platform with style, speed, and control.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-box">
          <Search size={18} />
          <input placeholder="Search anything..." />
        </div>
        <button
  className="logout-btn"
  onClick={handleLogout}
>
  <LogOut size={18} />
  <span>Logout</span>
</button>
      </div>
    </motion.div>
  )
}
