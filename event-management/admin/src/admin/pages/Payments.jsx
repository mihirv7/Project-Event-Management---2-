import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductPayments() {

  // =========================
  // STATES
  // =========================
  const [packagePayments, setPackagePayments] = useState([]);

  const [productPayments, setProductPayments] = useState([]);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchPackagePayments();

    fetchProductPayments();

  }, []);

  // =========================
  // PACKAGE BOOKINGS
  // =========================
  const fetchPackagePayments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/booking/admin"
      );

      setPackagePayments(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // PRODUCT BOOKINGS
  // =========================
  const fetchProductPayments = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/product-bookings/admin"
      );

      setProductPayments(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // TOTAL REVENUE
  // =========================
  const totalRevenue =

    packagePayments.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    )

    +

    productPayments.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

  return (

    <div style={{ padding: "20px" }}>

      <h1>Payments Management</h1>

      <h2 style={{ marginTop: "10px" }}>
        Total Revenue : ₹ {totalRevenue}
      </h2>

      {/* ========================= */}
      {/* PACKAGE PAYMENTS */}
      {/* ========================= */}

      <div style={{ marginTop: "40px" }}>

        <h2>Package Payments</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}
        >

          <thead>

            <tr>

              <th>User</th>

              <th>Email</th>

              <th>Package</th>

              <th>Amount</th>

              <th>Status</th>

              <th>Payment ID</th>

            </tr>

          </thead>

          <tbody>

            {packagePayments.map((item) => (

              <tr key={item._id}>

                <td>{item.userName}</td>

                <td>{item.email}</td>

                <td>{item.packageId?.name}</td>

                <td>₹ {item.amount}</td>

                <td>

                  <span
                    style={{
                      color:
                        item.paymentStatus === "Success"
                          ? "green"
                          : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {item.paymentStatus}
                  </span>

                </td>

                <td>{item.paymentId}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* ========================= */}
      {/* PRODUCT PAYMENTS */}
      {/* ========================= */}

      <div style={{ marginTop: "60px" }}>

        <h2>Product Payments</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}
        >

          <thead>

            <tr>

              <th>User</th>

              <th>Email</th>

              <th>Product</th>

              <th>Amount</th>

              <th>Status</th>

              <th>Payment ID</th>

            </tr>

          </thead>

          <tbody>

            {productPayments.map((item) => (

              <tr key={item._id}>

                <td>{item.userName}</td>

                <td>{item.email}</td>

                <td>{item.productName}</td>

                <td>₹ {item.amount}</td>

                <td>

                  <span
                    style={{
                      color:
                        item.paymentStatus === "Success"
                          ? "green"
                          : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {item.paymentStatus}
                  </span>

                </td>

                <td>{item.paymentId}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}