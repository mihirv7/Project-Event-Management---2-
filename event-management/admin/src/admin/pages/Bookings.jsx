import React from 'react'
import SimpleTable from '../components/SimpleTable'
import { bookings } from '../data/mockData'

export default function Bookings() {
  return (
    <SimpleTable
      title="Bookings Management"
      subtitle="Track all customer bookings and statuses"
      columns={[
        { key: 'customer', label: 'Customer' },
        { key: 'event', label: 'Event' },
        { key: 'package', label: 'Package' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
      ]}
      data={bookings}
    />
  )
}
