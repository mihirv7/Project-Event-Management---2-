import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import SimpleTable from '../components/SimpleTable'

export default function Packages() {

 
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
 const getNextDay = (date) => {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};
  // ✅ INLINE STYLES (NO CSS FILE NEEDED)
  const styles = {
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
      marginTop: "16px"
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      marginTop: "12px"
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
      outline: "none"
    },
    label: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#cbd5f5",
      marginBottom: "6px",
      display: "block"
    }
  };

  const [catering, setCatering] = useState([
  { thaliName: "", description: "", price: "" }
]);
  const handleCateringChange = (index, field, value) => {
  const updated = [...catering];
  updated[index][field] = value;
  setCatering(updated);
};
const addCatering = () => {
  setCatering([...catering, { thaliName: "", description: "", price: "" }]);
};

const removeCatering = (index) => {
  const updated = catering.filter((_, i) => i !== index);
  setCatering(updated);
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/packages/${id}`);
    alert("Package deleted");
    fetchPackages(); // refresh data
  } catch (error) {
    console.error(error);
  }
};
const [editId, setEditId] = useState(null);
const handleEdit = (pkg) => {
  setEditId(pkg._id);

  setFormData({
    name: pkg.name || "",
    description: pkg.description || "",
    price: pkg.price || "",
    venue: pkg.venue || "",
    startDate: pkg.startDate?.slice(0,10) || "",
    endDate: pkg.endDate?.slice(0,10) || "",
    guestCount: pkg.guestCount || "",
    coordinatorName: pkg.coordinatorName || "",
    coordinatorNumber: pkg.coordinatorNumber || ""
  });
   setCatering(
  pkg.catering && pkg.catering.length > 0
    ? pkg.catering
    : [{ thaliName: "", description: "", price: "" }]
);

  // optional (clear old images)
  
  setImages([null]);
};

  const fileInputRef = useRef();
  const [packageList, setPackageList] = useState([]);

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/packages");
      setPackageList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    venue: "",
    status: "",
    startDate: "",
    endDate: "",
    guestCount: "",
    coordinatorName: "",
    coordinatorNumber: ""
  });

  const [images, setImages] = useState([null]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

 const handleSubmit = async () => {
  const form = new FormData();

  Object.keys(formData).forEach(key => {
    form.append(key, formData[key]);
  });
  form.append("catering", JSON.stringify(catering));

  if (images) {
  for (let i = 0; i < images.length; i++) {
    form.append("images", images[i]);
  }
}

  try {

  if (editId) {

    await axios.put(
      `http://localhost:5000/api/packages/${editId}`,
      form
    );

  } else {

    await axios.post(
      "http://localhost:5000/api/packages",
      form
    );
  }

  await fetchPackages();

  alert(`Package ${editId ? "updated" : "added"}`);

  setEditId(null);

  setFormData({
    name: "",
    description: "",
    price: "",
    venue: "",
    startDate: "",
    endDate: "",
    guestCount: "",
    coordinatorName: "",
    coordinatorNumber: ""
  });

  setCatering([
    { thaliName: "", description: "", price: "" }
  ]);

  setImages([]);

} catch (error) {

  console.error(error);
}
};
  return (
    <div style={{ display: 'grid', gap: '18px' }}>

      {/* ================= FORM ================= */}
      <div className="card" style={{ padding: "24px" }}>

        <div className="section-title">
          <div>
            <h3>Add New Package</h3>
            <p>Use this form to quickly add new records to your admin system.</p>
          </div>
        </div>

        {/* TOP ROW */}
        <div style={styles.grid3}>
         <input style={styles.input} name="name" value={formData.name} placeholder="Package Name" onChange={handleChange} />
<input style={styles.input} name="price" value={formData.price} placeholder="Price" onChange={handleChange} />
<input style={styles.input} name="venue" value={formData.venue} placeholder="Venue" onChange={handleChange} />
        </div>

        {/* STATUS */}
        {/* <div style={{ marginTop: "12px", maxWidth: "250px" }}>
          <select style={styles.input} name="status" onChange={handleChange}>
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Popular</option>
            <option>Premium</option>
          </select>
        </div> */}

        {/* DESCRIPTION */}
        <textarea
  style={{ ...styles.input, marginTop: "12px" }}
  name="description"
  value={formData.description}
  placeholder="Package Description"
  onChange={handleChange}
/>

        {/* DATE ROW (HORIZONTAL FIXED) */}
        <div style={styles.grid2}>
          <div>
            <label style={styles.label}>Start Date</label>
           <input
  style={styles.input}
  type="date"
  name="startDate"
  value={formData.startDate}
  min={new Date().toISOString().split("T")[0]}
  onChange={handleChange}
/>
          </div>

          <div>
            <label style={styles.label}>End Date</label>
            <input
  style={styles.input}
  type="date"
  name="endDate"
  value={formData.endDate}
  min={getNextDay(formData.startDate)}
  onChange={handleChange}
/>
          </div>
        </div>

        {/* EXTRA FIELDS */}
        <div style={styles.grid3}>
         <input style={styles.input} name="guestCount" value={formData.guestCount} placeholder="Guest Count" onChange={handleChange} />
<input style={styles.input} name="coordinatorName" value={formData.coordinatorName} placeholder="Coordinator Name" onChange={handleChange} />
<input style={styles.input} name="coordinatorNumber" value={formData.coordinatorNumber} placeholder="Coordinator Number" onChange={handleChange} />
        </div>

        {/* IMAGE BUTTON */}
        <div style={{ marginTop: "16px" }}>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{
              background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {images.length > 0 ? `${images.length} file(s) selected` : "Upload Images"}
          </button><br></br>
          <span style={{ fontSize: "12px", opacity: 0.6 }}>
  Max 2 images allowed
</span>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      <div style={{ marginTop: "18px" }}>

  <label style={styles.label}>Catering Packages</label>

  {catering.map((item, index) => (
    <div key={index} style={{ marginBottom: "12px", borderBottom: "1px solid #333", paddingBottom: "10px" }}>

      <div style={styles.grid3}>

        <input
          style={styles.input}
          placeholder="Thali Name (e.g. Royal Thali)"
          value={item.thaliName}
          onChange={(e) => handleCateringChange(index, "thaliName", e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Description (Paneer, Dal...)"
          value={item.description}
          onChange={(e) => handleCateringChange(index, "description", e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Price"
          type="number"
          value={item.price}
          onChange={(e) => handleCateringChange(index, "price", e.target.value)}
        />

      </div>

      {catering.length > 1 && (
        <button
          type="button"
          onClick={() => removeCatering(index)}
          style={{
            marginTop: "8px",
            background: "red",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Remove
        </button>
      )}

    </div>
  ))}

  <button
    type="button"
    onClick={addCatering}
    style={{
      background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer"
    }}
  >
    + Add Catering Package
  </button>

</div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "18px",
            background: "linear-gradient(90deg, #6366f1, #06b6d4)",
            color: "#fff",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {editId ? "Update Package" : "Add Package"}
        </button>

          
      </div>

      {/* ================= TABLE ================= */}
      <SimpleTable
  title="Event Packages"
  subtitle="Create and manage packages for bookings"
  columns={[
    { key: 'name', label: 'Package Name' },
    { key: 'price', label: 'Price' },
    { key: 'venue', label: 'Best For' },

    // ✅ Catering (no change needed — handled inside SimpleTable)
    { key: 'catering', label: 'Catering' },

    // ✅ Images (no change needed — handled inside SimpleTable)
    { key: 'images', label: 'Images' },
    {
  key: "actions",
  label: "Actions",
  render: (row) => (
    <div style={{ display: "flex", gap: "10px" }}>
      
      {/* EDIT */}
      <button
        onClick={() => handleEdit(row)}
        style={{
          background: "#1677ff",
          color: "#fff",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Edit
      </button>

      {/* DELETE */}
      <button
        onClick={() => handleDelete(row._id)}
        style={{
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Delete
      </button>

    </div>
  )
}
    // ✅ Status badge (already handled)
    
  ]}
  data={packageList || []}   // ⭐ IMPORTANT (prevents crash)
/>
    </div>
  )
}