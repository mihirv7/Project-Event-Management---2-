import React from 'react'
import { motion } from 'framer-motion'

export default function Reports() {
  return (
    <motion.div
      className="page-card"
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="section-title">
        <div>
          <h3>Reports & Analytics</h3>
          <p>Advanced admin insights for bookings, revenue, user growth, and event performance.</p>
        </div>
      </div>

      <div className="placeholder-center">
        <div>
          <h2>Analytics Ready 🚀</h2>
          <p>
            This page is prepared for charts, exportable reports, downloadable summaries,
            revenue breakdowns, booking trends, top-performing packages, and city-wise event analytics.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
