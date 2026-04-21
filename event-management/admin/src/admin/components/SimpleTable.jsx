import React from 'react'
import { motion } from 'framer-motion'

function getBadgeClass(value = '') {
  const v = value.toLowerCase()

  if (
    ['active', 'approved', 'success', 'paid', 'published', 'confirmed', 'popular', 'premium'].includes(v)
  )
    return 'badge badge-success'

  if (['pending', 'upcoming', 'draft'].includes(v))
    return 'badge badge-warning'

  if (['blocked'].includes(v))
    return 'badge badge-danger'

  return 'badge badge-info'
}

export default function SimpleTable({ title, subtitle, columns, data }) {
  const BASE_URL = "http://localhost:5000"; // ✅ central URL

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
              <tr key={row._id || idx}>
                {columns.map((col) => {
                  const value = row[col.key]
                  const isStatus = col.key === 'status'

                  return (
                    <td key={col.key}>
  {
    /* ✅ ACTION BUTTONS */
    col.render ? col.render(row)

    /* ✅ CATERING WITH DESCRIPTION (YOUR ORIGINAL STYLE) */
    : col.key === 'catering' ? (
      <div>
        {value?.map((item, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <strong>{item.thaliName}</strong> - ₹{item.price}
            <br />
            <small style={{ opacity: 0.7 }}>
              {item.description}
            </small>
          </div>
        ))}
      </div>
    )

    /* ✅ IMAGES */
    : col.key === 'images' ? (
      <div style={{ display: 'flex', gap: '6px' }}>
        {value?.map((img, i) => (
          <img
            key={i}
            src={`http://localhost:5000/uploads/${img}`}
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              borderRadius: '6px'
            }}
          />
        ))}
      </div>
    )

    /* ✅ NORMAL FIELD */
    : value
  }
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