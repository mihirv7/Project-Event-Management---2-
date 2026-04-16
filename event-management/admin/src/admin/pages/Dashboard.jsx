import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from "axios";

import StatCard from '../components/StatCard'
import { chartData, recentActivities, users } from '../data/mockData'
import SimpleTable from '../components/SimpleTable'

export default function Dashboard() {

  // ✅ Now stats is ARRAY (important for UI)
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get("http://localhost:5000/api/users");
        const eventsRes = await axios.get("http://localhost:5000/api/events");
        const bookingsRes = await axios.get("http://localhost:5000/api/bookings");

        const totalUsers = usersRes.data.length;
        const totalEvents = eventsRes.data.length;
        const totalBookings = bookingsRes.data.length;
        const totalRevenue = bookingsRes.data.reduce(
          (sum, b) => sum + (b.amount || 0),
          0
        );

        // ✅ Convert into array for UI (StatCard uses map)
        setStats([
          {
            label: "Total Users",
            value: totalUsers,
          },
          {
            label: "Active Events",
            value: totalEvents,
          },
          {
            label: "Bookings",
            value: totalBookings,
          },
          {
            label: "Revenue",
            value: `₹${totalRevenue}`,
          },
        ]);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* ✅ Stats Cards */}
      <div className="grid-4">
        {stats.map((item, index) => (
          <StatCard key={item.label} item={item} index={index} />
        ))}
      </div>

      <div className="two-col">
        <motion.div
          className="card"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="section-title">
            <div>
              <h3>Revenue & Booking Trend</h3>
              <p>Monthly platform performance overview</p>
            </div>
          </div>

          <div className="chart-bars">
            {chartData.map((item) => (
              <div className="bar-col" key={item.month}>
                <div className="bar" style={{ height: `${item.value * 2.2}px` }} />
                <div className="bar-label">{item.month}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
        >
          <div className="section-title">
            <div>
              <h3>Recent Activities</h3>
              <p>Live admin-side actions</p>
            </div>
          </div>

          <div className="activity-list">
            {recentActivities.map((item) => (
              <div key={item.title} className="activity-item">
                <strong>{item.title}</strong>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ✅ Table (still using mock for now) */}
      <SimpleTable
        title="Latest Registered Users"
        subtitle="Quick access to newly onboarded users"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
        data={users}
      />
    </div>
  )
}