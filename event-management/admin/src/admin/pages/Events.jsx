import React, { useEffect, useState,useRef } from 'react'
import axios from 'axios'


export default function Events() {

  const [events, setEvents] = useState([])
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef();
  const handleFileChange = (e) => {
  setImage(e.target.files[0]);
};
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events')
      setEvents(res.data)
    } catch (error) {
      console.error(error)
    }
  }
  const handleEdit = (event) => {
  setFormData({
    title: event.title,
    date: event.date,
    location: event.location,
    description: event.description
  });

  setEditId(event._id);
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/events/${id}`);
    alert("Events deleted");
    fetchEvents(); // refresh
  } catch (error) {
    console.error(error);
  }
};

 const handleSubmit = async (e) => {
  const data = new FormData();
  e.preventDefault();
  data.append("title", formData.title);
  data.append("date", formData.date);
  data.append("location", formData.location);
  data.append("description", formData.description);
  data.append("image", image);

  try {
    if (editId) {
      // UPDATE
      await axios.put(`http://localhost:5000/api/events/${editId}`, data);
      setEditId(null);
    } else {
      // CREATE
      await axios.post("http://localhost:5000/api/events", data);
    }
      alert(`Event ${editId ? "updated" : "added"}`);
    fetchEvents();

    setFormData({
      title: '',
      date: '',
      location: '',
      description: ''
    });

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>

      {/* 🔵 INTERNAL CSS */}
      <style>{`
        .event-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }

        .event-form input,
        .event-form textarea {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          outline: none;
          background: linear-gradient(145deg, #0f172a, #1e293b);
          color: #e2e8f0;
          transition: 0.3s;
        }

        .event-form input::placeholder,
        .event-form textarea::placeholder {
          color: #94a3b8;
        }

        .event-form input:focus,
        .event-form textarea:focus {
          border: 1px solid #3b82f6;
          box-shadow: 0 0 8px #3b82f6;
        }
          .file-upload {
  position: relative;
  width: 100%;
}

.file-upload input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(45deg, #3b82f6, #06b6d4);
  color: white;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: 0.3s;
}

.file-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 10px #3b82f6;
}

        .event-form textarea {
          grid-column: span 2;
          min-height: 90px;
        }

        .event-form button {
          grid-column: span 2;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(45deg, #3b82f6, #06b6d4);
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        .event-form button:hover {
          transform: scale(1.02);
          box-shadow: 0 0 10px #3b82f6;
        }
      `}</style>

      {/* FORM */}
      <div className="card">
        <h3>Add New Event</h3>

        <form onSubmit={handleSubmit} className="event-form">

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Name"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <div></div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
          />

         <div className="file-upload">
  <button
    type="button"
    className="file-btn"
    onClick={() => fileInputRef.current.click()}
  >
    {image ? image.name : "Choose Image"}
  </button>

  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: "none" }}
  />
  </div>

          <button type="submit">Add Event</button>

        </form>
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>All Events</h3>

        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Image</th>
              <th>Actions</th>
          
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td><img src={`http://localhost:5000/uploads/${event.image}`}width="60"/></td>
                <td>

<button
  onClick={() => handleEdit(event)}
  style={{
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px"
  }}
>
  Edit
</button>
<button
    onClick={() => handleDelete(event._id)}
    style={{
       background: "#ff4d4f",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px"
    }}
  >

    Delete
  </button></td>              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}