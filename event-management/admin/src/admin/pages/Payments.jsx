import React from 'react'
import SimpleTable from '../components/SimpleTable'
import { payments } from '../data/mockData'

export default function Payments() {
  return (
    <SimpleTable
      title="Payments Management"
      subtitle="Monitor all incoming transactions and payment statuses"
      columns={[
        { key: 'id', label: 'Payment ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'amount', label: 'Amount' },
        { key: 'method', label: 'Method' },
        { key: 'status', label: 'Status' },
      ]}
      data={payments}
    />
  )
}
