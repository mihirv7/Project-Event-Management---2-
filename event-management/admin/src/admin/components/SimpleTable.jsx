import React from 'react'
import { motion } from 'framer-motion'

function getBadgeClass(value = '') {
  const v = value.toLowerCase()
  if (['active', 'approved', 'success', 'paid', 'published', 'confirmed', 'popular', 'premium'].includes(v)) return 'badge badge-success'
  if (['pending', 'upcoming', 'draft'].includes(v)) return 'badge badge-warning'
  if (['blocked'].includes(v)) return 'badge badge-danger'
  return 'badge badge-info'
}

export default function SimpleTable({ title, subtitle, columns, data }) {
  return (
    <motion.div
      className="page-card"
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="section-title">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => {
                  const value = row[col.key]
                  const isStatus = col.key === 'status'
                  return (
                    <td key={col.key}>
                      {isStatus ? <span className={getBadgeClass(String(value))}>{value}</span> : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
