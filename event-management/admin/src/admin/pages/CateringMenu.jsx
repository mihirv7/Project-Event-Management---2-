import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function CateringMenu() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [foodType, setFoodType] = useState("Regular");
  const [thaliName, setThaliName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(true);

  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const fileInputRef = useRef();

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

  const fetchMenus = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/catering/menu"
      );
      setMenus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("categoryId", categoryId);
      formData.append("foodType", foodType);
      formData.append("thaliName", thaliName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/catering/menu/${editId}`,
          formData
        );
        alert("Menu Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/catering/menu",
          formData
        );
        alert("Menu Added Successfully");
      }

      setCategoryId("");
      setFoodType("Regular");
      setThaliName("");
      setDescription("");
      setPrice("");
      setStatus(true);
      setImage(null);
      setEditId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchMenus();
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };
  const handleEdit = (menu) => {
  setEditId(menu._id);
  setCategoryId(menu.categoryId._id);
  setFoodType(menu.foodType);
  setThaliName(menu.thaliName);
  setDescription(menu.description);
  setPrice(menu.price);
  setStatus(menu.status);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this menu?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/catering/menu/${id}`
    );

    alert("Menu Deleted Successfully");

    fetchMenus();
  } catch (err) {
    console.log(err);
    alert("Delete Failed");
  }
};

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  return (
    <>
    <style>{`
.menu-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.menu-form input,
.menu-form textarea,
.menu-form select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  outline: none;
  background: linear-gradient(145deg, #0f172a, #1e293b);
  color: #e2e8f0;
  transition: .3s;
}

.menu-form input::placeholder,
.menu-form textarea::placeholder{
  color:#94a3b8;
}
  .card
  {
  margin-bottom: 20px;
  }

.menu-form input:focus,
.menu-form textarea:focus,
.menu-form select:focus{
  border:1px solid #3b82f6;
  box-shadow:0 0 8px #3b82f6;
}

.menu-form textarea{
  grid-column: span 2;
  min-height:100px;
}

.menu-form button{
  grid-column: span 2;
  padding:12px;
  border:none;
  border-radius:10px;
  background:linear-gradient(45deg,#3b82f6,#06b6d4);
  color:white;
  font-weight:600;
  cursor:pointer;
  transition:.3s;
}

.menu-form button:hover{
  transform:scale(1.02);
  box-shadow:0 0 10px #3b82f6;
}

.file-upload{
  grid-column: span 2;
  width:100%;
}

.file-btn{
  width:100%;
  padding:12px;
  border:none;
  border-radius:10px;
  background:linear-gradient(45deg,#3b82f6,#06b6d4);
  color:white;
  cursor:pointer;
}
  .bton{
  width:30%;
  padding:12px 16px;
  border:none;
  border-radius:10px;
  color:white;
  cursor:pointer;
}

.file-upload input{
  display:none;
}
`}</style>
    <div className="card">
      <h3>{editId ? "Update Catering Menu" : "Add New Catering Menu"}</h3>

<form onSubmit={handleSubmit} className="menu-form">

<input
  type="text"
  placeholder="Thali Name"
  value={thaliName}
  onChange={(e)=>setThaliName(e.target.value)}
/>

<input
  type="number"
  placeholder="Price"
  value={price}
  onChange={(e)=>setPrice(e.target.value)}
/>

<select
  value={categoryId}
  onChange={(e)=>setCategoryId(e.target.value)}
>
  <option value="">Select Category</option>

  {categories.map(category=>(
    <option
      key={category._id}
      value={category._id}
    >
      {category.name}
    </option>
  ))}

</select>

<select
  value={foodType}
  onChange={(e)=>setFoodType(e.target.value)}
>
  <option value="Regular">Regular</option>
  <option value="Jain">Jain</option>
</select>

<textarea
  placeholder="Description"
  value={description}
  onChange={(e)=>setDescription(e.target.value)}
></textarea>

<select
  value={status}
  onChange={(e)=>setStatus(e.target.value==="true")}
>
  <option value={true}>Active</option>
  <option value={false}>Inactive</option>
</select>

<div className="file-upload">

  <button
    type="button"
    className="file-btn"
    onClick={()=>fileInputRef.current.click()}
  >
    {image ? image.name : "Choose Image"}
  </button>

  <input
    type="file"
    ref={fileInputRef}
    onChange={(e)=>setImage(e.target.files[0])}
  />

</div>

<button type="submit">
  {editId ? "Update Menu" : "Add Menu"}
</button>

</form>
</div>

      <div className="card mt-4 p-3">
        <h3>Catering Menus</h3>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category</th>
              <th style={{ width: "290px" }}>
  Action
</th>
              <th>Thali</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ width: "190px" }}>
  Action
</th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr key={menu._id}>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${menu.image}`}
                    width="70"
                    alt=""
                  />
                </td>

                <td>{menu.categoryId?.name}</td>
                <td>{menu.description}</td>
                <td>{menu.thaliName}</td>
                <td>₹ {menu.price}</td>
                <td>{menu.status ? "Active" : "Inactive"}</td>

                <td>
  <div className="d-flex gap-2 justify-content-center">
    <button style={{backgroundColor:"#1d6ae7", color:"white"}}
      className="btn btn-danger btn-sm "
      onClick={() => handleEdit(menu)}
    >
      Edit
    </button>

    <button
      style={{ backgroundColor: "#dc3545", color: "white" }}
      className="btn btn-danger btn-sm"
      onClick={() => handleDelete(menu._id)}
    >
      Delete
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}