import React from 'react'
import { motion } from 'framer-motion'

export default function Settings() {
  return (
    <motion.div
      className="page-card"
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="section-title">
        <div>
          <h3>Admin Settings</h3>
          <p>Configure platform preferences, profile details, notifications, and system behavior.</p>
        </div>
      </div>

      <div className="form-grid">
        <input className="input" placeholder="Admin Name" />
        <input className="input" placeholder="Admin Email" />
        <select className="select">
          <option>Notification Preference</option>
          <option>Email Alerts</option>
          <option>SMS Alerts</option>
          <option>All Alerts</option>
        </select>
        <select className="select">
          <option>Theme Mode</option>
          <option>Dark</option>
          <option>Light</option>
        </select>
        <div className="full">
          <textarea className="textarea" placeholder="System Notes / Custom Settings" />
        </div>
      </div>

      <button className="btn btn-primary">Save Settings</button>
    </motion.div>
  )
}
