import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="main-panel">
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}
