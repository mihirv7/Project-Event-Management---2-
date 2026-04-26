import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const handleEdit = (cat) => {
  setName(cat.name);
  setEditId(cat._id);
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddCategory = async () => {
  try {
    if (!name) {
      alert("Name required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }

    // ✅ IF EDIT MODE
    if (editId) {
      await axios.put(
        `http://localhost:5000/api/categories/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Category updated");
    } 
    // ✅ ADD MODE
    else {
      await axios.post(
        "http://localhost:5000/api/categories/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Category added");
    }

    // ✅ RESET FORM
    setName("");
    setImage(null);
    setEditId(null);

    fetchCategories();

  } catch (err) {
    console.log(err);
    alert("Error");
  }
};
const handleDelete = async (id) => {
  try {
    // const confirmDelete = window.confirm("Are you sure to delete?");

    // if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/api/categories/${id}`);

    alert("Category deleted");

    // refresh list
    fetchCategories();

  } catch (err) {
    console.log(err);
    alert("Error deleting category");
  }
};

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <h2 style={{ color: "#fff", marginBottom: "10px" }}>
        Categories Management
      </h2>

      {/* ADD CATEGORY CARD */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
        }}
      >
        <h3 style={{ color: "#fff", marginBottom: "10px" }}>
          Add Category
        </h3>

        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            background: "#0f172a",
            color: "#fff"
          }}
        />

        <label
  style={{
    display: "inline-block",
    padding: "10px 15px",
    borderRadius: "8px",
    background: "linear-gradient(90deg,#6366f1,#06b6d4)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px"
  }}
>
  Choose Image
  <input
    type="file"
    onChange={(e) => setImage(e.target.files[0])}
    style={{ display: "none" }}
  />
</label>

        <button
  onClick={handleAddCategory}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
  {editId ? "Update Category" : "Add Category"}
</button>
      </div>

      {/* TABLE CARD */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "14px",
          background: "linear-gradient(145deg, #1b2235, #0f172a)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <h3 style={{ margin: 0, color: "#fff" }}>
            All Categories
          </h3>
          <p style={{ color: "#aaa", margin: 0 }}>
            Manage all categories
          </p>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2f45" }}>
              <th style={{ padding: "12px", color: "#aaa", textAlign: "left" }}>
                Name
              </th>
              <th style={{ padding: "12px", color: "#aaa", textAlign: "left" }}>
                Image
              </th>
              <th style={{ padding: "12px", color: "#aaa", textAlign: "left" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat._id}
                style={{ borderBottom: "1px solid #2a2f45" }}
              >
                <td style={{ padding: "14px", color: "#fff" }}>
                  {cat.name}
                </td>

                <td style={{ padding: "14px" }}>
                  <img
                    src={`http://localhost:5000/uploads/${cat.image}`}
                    alt={cat.name}
                    style={{
                      width: "70px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                </td>

                <td style={{ padding: "14px" }}>
                  <button
  onClick={() => handleEdit(cat)}
  style={{
    padding: "6px 14px",
    border: "none",
    borderRadius: "8px",
    marginRight: "8px",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer"
  }}
>
  Edit
</button>

                  <button
  onClick={() => handleDelete(cat._id)}
  style={{
    padding: "6px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer"
  }}
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}