import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SimpleTable from '../components/SimpleTable'

export default function Vendors() {

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: ""
  })

  const [image, setImage] = useState(null)

  const [customizations, setCustomizations] = useState([
    { name: "", options: "" }
  ])

  // ================= FETCH =================
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories")
      setCategories(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/all")

      const formatted = res.data.map(p => ({
        ...p,
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.categoryId?.name || "N/A",
        description: p.description,
        image: p.image
      }))

      setProducts(formatted)
    } catch (err) {
      console.error(err)
    }
  }
  

  // ================= FORM =================
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  // ================= CUSTOMIZATION =================
  const addCustomization = () => {
    setCustomizations([...customizations, { name: "", options: "" }])
  }

  const removeCustomization = (index) => {
    const updated = customizations.filter((_, i) => i !== index)
    setCustomizations(updated)
  }

  const handleCustomChange = (index, field, value) => {
    const updated = [...customizations]
    updated[index][field] = value
    setCustomizations(updated)
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "10px",
    color: "#fff",
    outline: "none"
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("categoryId", formData.categoryId);

    if (image) {
      formDataToSend.append("image", image);
    }

    // ✅ FIX CUSTOMIZATION FORMAT
    const formattedCustomizations = customizations.map(c => ({
  name: c.name,
  options: c.options.split(",").map(o => o.trim())
}));
   
    formDataToSend.append(
      "customizations",
      JSON.stringify(formattedCustomizations)
    );

    let res;

    // 🔥 IMPORTANT FIX HERE
    if (editId) {
      // UPDATE
      res = await axios.put(
        `http://localhost:5000/api/products/${editId}`,
        formDataToSend
      );
      alert("Product Updated Successfully");
    } else {
      // ADD
      res = await axios.post(
        "http://localhost:5000/api/products/add",
        formDataToSend
      );
      alert("Product Added Successfully");
    }

    fetchProducts();
    setEditId(null);
setFormData({
  name: "",
  price: "",
  description: "",
  categoryId: ""
});
setCustomizations([{ name: "", options: "" }]);
setImage(null); // refresh table

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error");
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`)
      alert("Product deleted");
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (product) => {
  setEditId(product.id); // important for update

  setFormData({
    name: product.name || "",
    price: product.price || "",
    description: product.description || "",
    categoryId: product.categoryId?._id || product.categoryId || "",
    image: null,

    // ✅ FIXED PROPERLY
    
  });
  setCustomizations(
  (product.customizations || []).map(c => ({
    name: c.name || "",
    options: Array.isArray(c.options)
      ? c.options.join(", ")
      : c.options || ""
  }))
);
  setImage(null);
};


  return (
    <div style={{ display: 'grid', gap: '18px' }}>

      {/* ================= FORM CARD ================= */}
      <div style={{
        padding: "20px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#fff"
      }}>

        <h2>Add Product</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

          <input
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{ ...inputStyle, gridColumn: "span 2" }}
          />

          <select
  value={formData.categoryId}
  onChange={(e) => handleChange("categoryId", e.target.value)}
  style={{
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "10px",
    color: "#fff",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer"
  }}
>
  <option value="" style={{ color: "#000" }}>Select Category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id} style={{ color: "#000" }}>
      {cat.name}
    </option>
  ))}
</select>

          <div style={{ position: "relative" }}>
  <input
    type="file"
    onChange={handleFileChange}
    style={{
      opacity: 0,
      position: "absolute",
      width: "100%",
      height: "100%",
      cursor: "pointer"
    }}
  />

  <div
    style={{
      background: "linear-gradient(90deg,#6366f1,#06b6d4)",
      border: "1px solid rgba(255,255,255,0.1)",
      padding: "10px",
      borderRadius: "10px",
      color: "#ffffff"
    }}
  >
    {image ? image.name : "Upload Image"}
  </div>
</div>

      </div>



        {/* CUSTOMIZATION */}
        <div style={{ marginTop: "20px" }}>
          <h4>Customizations</h4>

          {customizations.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

              <input
                placeholder="Customization Name"
                value={item.name}
                onChange={(e) => handleCustomChange(index, "name", e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Options (S,M,L)"
                value={item.options}
                onChange={(e) => handleCustomChange(index, "options", e.target.value)}
                style={inputStyle}
              />

              <button
                onClick={() => removeCustomization(index)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Remove
              </button>

            </div>
          ))}

          <button
          onClick={addCustomization}
          style={{
            marginTop: "10px",
            background: "linear-gradient(90deg,#6366f1,#06b6d4)",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          + Add Customization
        </button>
        </div>

         <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          width: "100%",
          background: "linear-gradient(90deg,#6366f1,#06b6d4)",
          color: "#fff",
          border: "none",
          padding: "12px",
          borderRadius: "10px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {editId ? "Update Product" : "Add Product"}
      </button>

      </div>

      {/* ================= TABLE ================= */}
      <SimpleTable
        title="Products Management"
        subtitle="Manage all products"
        columns={[
          { key: "name", label: "Product Name" },
          { key: "price", label: "Price" },
          { key: "category", label: "Category" },
          { key: "description", label: "Description" },
          { key: "image", label: "Image" },
          { key: "actions", label: "Actions" }
        ]}
        data={products.map(p => ({
          ...p,
          image: (
            <img
              src={`http://localhost:5000/uploads/${p.image}`}
              style={{ width: "50px", borderRadius: "6px" }}
            />
          ),
          actions: (
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleEdit(p)} style={{
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px"
  }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} onClick={() => handleDelete(event._id)}
    style={{
    background: "#ff4d4f",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px"
    }}>Delete</button>
            </div>
          )
        }))}
      />

    </div>
  )
}