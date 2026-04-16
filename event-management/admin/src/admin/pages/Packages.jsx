import React from 'react'
import EntityForm from '../components/EntityForm'
import SimpleTable from '../components/SimpleTable'
import { packages } from '../data/mockData'

export default function Packages() {
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <EntityForm
        title="Add New Package"
        buttonText="Add Package"
        fields={[
          { name: 'name', placeholder: 'Package Name' },
          { name: 'price', placeholder: 'Price' },
          { name: 'eventType', placeholder: 'Suitable For' },
          { name: 'status', type: 'select', placeholder: 'Select Status', options: ['Active', 'Popular', 'Premium'] },
          { name: 'description', placeholder: 'Package Description', type: 'textarea', full: true },
        ]}
      />

      <SimpleTable
        title="Event Packages"
        subtitle="Create and manage packages for bookings"
        columns={[
          { key: 'name', label: 'Package Name' },
          { key: 'price', label: 'Price' },
          { key: 'events', label: 'Best For' },
          { key: 'status', label: 'Status' },
        ]}
        data={packages}
      />
    </div>
  )
}
