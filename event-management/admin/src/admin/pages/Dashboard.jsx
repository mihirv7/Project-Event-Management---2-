import React, { useEffect, useState } from "react";
import axios from "axios";

import StatCard from "../components/StatCard";
import SimpleTable from "../components/SimpleTable";

const API = "http://localhost:5000/api";

// Get the administrator's authentication token
const getAuthConfig = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found. Please log in again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const authConfig = getAuthConfig();

      // Fetch data
      const usersRes = await axios.get(
        `${API}/users`,
        authConfig
      );

      const productsRes = await axios.get(
        `${API}/products`,
        authConfig
      );

      const packagesRes = await axios.get(
        `${API}/packages`,
        authConfig
      );

      const bookingsRes = await axios.get(
        `${API}/booking/admin`,
        authConfig
      );

      const productBookingsRes = await axios.get(
        `${API}/product-bookings/admin`,
        authConfig
      );

      // Total counts
      const totalUsers = usersRes.data.length;
      const totalCustomEvents = productsRes.data.length;
      const totalPackages = packagesRes.data.length;

      const totalOrders =
        bookingsRes.data.length +
        productBookingsRes.data.length;

      // Revenue
      const packageRevenue = bookingsRes.data.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );

      const productRevenue = productBookingsRes.data.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );

      const totalRevenue = packageRevenue + productRevenue;

      // Dashboard cards
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

      // Upcoming package bookings
      const today = new Date();

      const upcoming = bookingsRes.data
        .filter(
          (item) =>
            item.startingDate &&
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
      console.error(
        "Error fetching dashboard data:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      {/* Dashboard cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "30px",
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

      {/* Upcoming package bookings */}
      <SimpleTable
        title="Upcoming Package Bookings"
        subtitle="Next 5 upcoming package bookings"
        columns={[
          {
            key: "userName",
            label: "Customer",
          },
          {
            key: "packageName",
            label: "Package",
          },
          {
            key: "startingDate",
            label: "Start Date",
          },
          {
            key: "guestCount",
            label: "Guests",
          },
          {
            key: "location",
            label: "Location",
          },
        ]}
        data={upcomingBookings.map((item) => ({
          ...item,
          packageName: item.packageId?.name || "Package",
          startingDate: new Date(
            item.startingDate
          ).toLocaleDateString("en-IN"),
        }))}
      />
    </div>
  );
}