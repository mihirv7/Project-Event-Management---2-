import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Catering() {

  // ================= STATES =================

  const [categories, setCategories] = useState([]);

  const [cardImage, setCardImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const cardRef = useRef();
  const bannerRef = useRef();

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: true,
  });

  // ================= LOAD DATA =================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= GET ALL CATEGORIES =================

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/catering/categories"
      );

      setCategories(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: name === "status" ? value === "true" : value,
  });
};



  // ================= HANDLE IMAGES =================

  const handleCardImage = (e) => {
    setCardImage(e.target.files[0]);
  };

  const handleBannerImage = (e) => {
    setBannerImage(e.target.files[0]);
  };

  // ================= ADD / UPDATE CATEGORY =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("status", formData.status);

    if (cardImage) {
      data.append("cardImage", cardImage);
    }

    if (bannerImage) {
      data.append("bannerImage", bannerImage);
    }

    try {

      if (editId) {

        await axios.put(
          `http://localhost:5000/api/catering/categories/${editId}`,
          data
        );

        alert("Category Updated Successfully");

      } else {

        await axios.post(
          "http://localhost:5000/api/catering/categories",
          data
        );

        alert("Category Added Successfully");

      }

      fetchCategories();

      setEditId(null);

      setFormData({
        name: "",
        slug: "",
        description: "",
        status: true,
      });

      setCardImage(null);
      setBannerImage(null);

      if (cardRef.current) cardRef.current.value = "";
      if (bannerRef.current) bannerRef.current.value = "";

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

    }
  };

  // ================= EDIT CATEGORY =================

  const handleEdit = (category) => {

    setEditId(category._id);

    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
    });

  };

  // ================= DELETE CATEGORY =================

  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/catering/categories/${id}`
      );

      alert("Category Deleted Successfully");

      fetchCategories();

    } catch (err) {

      console.log(err);

    }
  };

  // ================= UI =================

  return (
  <div>

    {/* ================= CSS ================= */}

    <style>{`

      .catering-form{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:15px;
        margin-top:20px;
      }

      .catering-form input,
      .catering-form textarea,
      .catering-form select{

        width:100%;
        padding:12px;
        border-radius:10px;
        border:1px solid rgba(255,255,255,.1);
        outline:none;
        background:linear-gradient(145deg,#0f172a,#1e293b);
        color:#fff;
        transition:.3s;

      }

      .catering-form input::placeholder,
      .catering-form textarea::placeholder{
        color:#94a3b8;
      }

      .catering-form input:focus,
      .catering-form textarea:focus,
      .catering-form select:focus{

        border:1px solid #3b82f6;
        box-shadow:0 0 8px #3b82f6;

      }

      .catering-form textarea{

        grid-column:span 2;
        min-height:120px;
        resize:none;

      }

      .file-upload{

        position:relative;
        width:100%;

      }

      .file-btn{

        width:100%;
        padding:12px;
        border:none;
        border-radius:10px;
        cursor:pointer;
        color:white;
        font-weight:600;
        background:linear-gradient(45deg,#3b82f6,#06b6d4);
        transition:.3s;

      }

      .file-btn:hover{

        transform:scale(1.02);

      }

      .submit-btn{

        grid-column:span 2;
        padding:13px;
        border:none;
        border-radius:10px;
        cursor:pointer;
        color:white;
        font-size:15px;
        font-weight:600;
        background:linear-gradient(45deg,#3b82f6,#06b6d4);

      }

      .submit-btn:hover{

        transform:scale(1.02);

      }

    `}</style>


    {/* ================= FORM ================= */}

    <div className="card">

      <h3>
        {editId ? "Update Category" : "Add New Category"}
      </h3>

      <form
        className="catering-form"
        onSubmit={handleSubmit}
      >

        {/* Name */}

        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Slug */}

        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />

        {/* Description */}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Status */}

        <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
       </select>

        <div></div>

        {/* Card Image */}

        <div className="file-upload">

          <button
            type="button"
            className="file-btn"
            onClick={() => cardRef.current.click()}
          >
            {cardImage ? cardImage.name : "Choose Card Image"}
          </button>

          <input
            type="file"
            ref={cardRef}
            hidden
            onChange={handleCardImage}
          />

        </div>

        {/* Banner Image */}

        <div className="file-upload">

          <button
            type="button"
            className="file-btn"
            onClick={() => bannerRef.current.click()}
          >
            {bannerImage ? bannerImage.name : "Choose Banner Image"}
          </button>

          <input
            type="file"
            ref={bannerRef}
            hidden
            onChange={handleBannerImage}
          />

        </div>

        {/* Submit */}

        <button
          className="submit-btn"
          type="submit"
        >

          {editId ? "Update Category" : "Add Category"}

        </button>

      </form>
        {/* ================= CATEGORY TABLE ================= */}

<div className="card" style={{ marginTop: "20px" }}>

  <h3>All Categories</h3>

  <table>
    <thead>
      <tr>
        <th>Card Image</th>
        <th>Banner Image</th>
        <th>Category</th>
        <th>Slug</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>

      {categories.length === 0 ? (

        <tr>
          <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
            No Categories Found
          </td>
        </tr>

      ) : (

        categories.map((category) => (

          <tr key={category._id}>

            {/* Card Image */}
            <td>
              <img
                src={`http://localhost:5000/uploads/${category.cardImage}`}
                alt="Card"
                width="70"
                height="50"
                style={{
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            </td>

            {/* Banner Image */}
            <td>
              <img
                src={`http://localhost:5000/uploads/${category.bannerImage}`}
                alt="Banner"
                width="90"
                height="50"
                style={{
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            </td>

            {/* Name */}
            <td>{category.name}</td>

            {/* Slug */}
            <td>{category.slug}</td>

            {/* Status */}
            <td>

              <span
                style={{
                  background: category.status ? "#22c55e" : "#ef4444",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                {category.status ? "Active" : "Inactive"}
              </span>

            </td>

            {/* Buttons */}
            <td>

              <button
                onClick={() => handleEdit(category)}
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "8px"
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(category._id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
    </div>

  </div>
);
}