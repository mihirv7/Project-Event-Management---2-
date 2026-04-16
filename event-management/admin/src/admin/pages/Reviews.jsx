import React from 'react'
import SimpleTable from '../components/SimpleTable'
import { reviews } from '../data/mockData'

export default function Reviews() {
  return (
    <SimpleTable
      title="Reviews & Feedback"
      subtitle="See what customers are saying about your events"
      columns={[
        { key: 'user', label: 'User' },
        { key: 'event', label: 'Event' },
        { key: 'rating', label: 'Rating' },
        { key: 'comment', label: 'Comment' },
        { key: 'status', label: 'Status' },
      ]}
      data={reviews}
    />
  )
}
