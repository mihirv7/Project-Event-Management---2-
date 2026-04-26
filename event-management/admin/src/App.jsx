import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './admin/layout/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import Users from './admin/pages/Users'
import Events from './admin/pages/Events'
import Packages from './admin/pages/Packages'
import Bookings from './admin/pages/Bookings'
import Vendors from './admin/pages/Vendors'
import Payments from './admin/pages/Payments'
import Reviews from './admin/pages/Reviews'
import Reports from './admin/pages/Reports'
import Settings from './admin/pages/Settings'
import Categories from './admin/pages/Categories'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="events" element={<Events />} />
        <Route path="packages" element={<Packages />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/admin/categories" element={<Categories />} />
      </Route>
    </Routes>
  )
}
