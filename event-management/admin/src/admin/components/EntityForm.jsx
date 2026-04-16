import React from 'react'
import { motion } from 'framer-motion'

export default function EntityForm({ title, fields = [], buttonText = 'Save Item' }) {
  return (
    <motion.div
      className="page-card"
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="section-title">
        <div>
          <h3>{title}</h3>
          <p>Use this form to quickly add new records to your admin system.</p>
        </div>
      </div>

      <div className="form-grid">
        {fields.map((field) => {
          const commonProps = {
            className: field.type === 'textarea' ? 'textarea' : 'input',
            placeholder: field.placeholder,
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className={field.full ? 'full' : ''}>
                <textarea {...commonProps} />
              </div>
            )
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className={field.full ? 'full' : ''}>
                <select className="select">
                  <option>{field.placeholder}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )
          }

          return (
            <div key={field.name} className={field.full ? 'full' : ''}>
              <input {...commonProps} type={field.type || 'text'} />
            </div>
          )
        })}
      </div>

      <button className="btn btn-primary">{buttonText}</button>
    </motion.div>
  )
}
