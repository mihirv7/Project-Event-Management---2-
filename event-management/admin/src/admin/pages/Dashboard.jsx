import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import StatCard from "../components/StatCard";
import SimpleTable from "../components/SimpleTable";

export default function Dashboard() {

  // =========================
  // STATES
  // =========================
  const [stats, setStats] = useState([]);

  const [upcomingBookings, setUpcomingBookings] = useState([]);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchDashboardData();

  }, []);

  // =========================
  // MAIN FUNCTION
  // =========================
  const fetchDashboardData = async () => {

    try {

      // =========================
      // API CALLS
      // =========================
      const usersRes = await axios.get(
        "http://localhost:5000/api/users"
      );

      const productsRes = await axios.get(
  "http://localhost:5000/api/products"
);

      const packagesRes = await axios.get(
        "http://localhost:5000/api/packages"
      );

      const bookingsRes = await axios.get(
        "http://localhost:5000/api/booking/admin"
      );

      const productBookingsRes = await axios.get(
        "http://localhost:5000/api/product-bookings/admin"
      );

      // =========================
      // TOTAL COUNTS
      // =========================
      const totalUsers = usersRes.data.length;

      const totalCustomEvents = productsRes.data.length;

      const totalPackages = packagesRes.data.length;

      const totalOrders =
        bookingsRes.data.length +
        productBookingsRes.data.length;

      // =========================
      // REVENUE
      // =========================
      const packageRevenue = bookingsRes.data.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );

      const productRevenue = productBookingsRes.data.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );

      const totalRevenue =
        packageRevenue + productRevenue;

      // =========================
      // 6 CARDS
      // =========================
      setStats([
        {
          label: "Total Users",
          value: totalUsers,
        },
        {
          label: "Custom Events",
          value: totalCustomEvents,
        },
        {
          label: "Total Packages",
          value: totalPackages,
        },
        {
          label: "Total Orders",
          value: totalOrders,
        },
        {
          label: "Revenue",
          value: `₹${totalRevenue}`,
        },
        {
          label: "Upcoming Bookings",
          value: bookingsRes.data.length,
        },
      ]);

      // =========================
      // UPCOMING BOOKINGS
      // =========================
      const today = new Date();

      const upcoming = bookingsRes.data
        .filter(
          (item) =>
            new Date(item.startingDate) >= today
        )
        .sort(
          (a, b) =>
            new Date(a.startingDate) -
            new Date(b.startingDate)
        )
        .slice(0, 5);

      setUpcomingBookings(upcoming);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div>

      {/* ========================= */}
      {/* 6 STAT CARDS */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        {stats.map((item, index) => (

          <StatCard
            key={item.label}
            item={item}
            index={index}
          />
        ))}

      </div>

      {/* ========================= */}
      {/* UPCOMING BOOKINGS TABLE */}
      {/* ========================= */}

      <SimpleTable

        title="Upcoming Package Bookings"

        subtitle="Next 5 upcoming package bookings"

        columns={[

          {
            key: "userName",
            label: "Customer"
          },

          {
            key: "packageName",
            label: "Package"
          },

          {
            key: "startingDate",
            label: "Start Date"
          },

          {
            key: "guestCount",
            label: "Guests"
          },

          {
            key: "location",
            label: "Location"
          },
        ]}

        data={upcomingBookings.map((item) => ({

          ...item,

          packageName:
            item.packageId?.name || "Package",

          startingDate:
            new Date(
              item.startingDate
            ).toLocaleDateString()

        }))}

      />

    </div>
  );
}