import React from 'react'
import EntityForm from '../components/EntityForm'
import SimpleTable from '../components/SimpleTable'
import { vendors } from '../data/mockData'

export default function Vendors() {
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <EntityForm
        title="Add Vendor"
        buttonText="Add Vendor"
        fields={[
          { name: 'name', placeholder: 'Vendor Name' },
          { name: 'service', placeholder: 'Service Type' },
          { name: 'city', placeholder: 'City' },
          { name: 'status', type: 'select', placeholder: 'Select Status', options: ['Approved', 'Pending'] },
        ]}
      />

      <SimpleTable
        title="Vendors Management"
        subtitle="Manage DJs, decorators, caterers, and more"
        columns={[
          { key: 'name', label: 'Vendor Name' },
          { key: 'service', label: 'Service' },
          { key: 'city', label: 'City' },
          { key: 'status', label: 'Status' },
        ]}
        data={vendors}
      />
    </div>
  )
}
