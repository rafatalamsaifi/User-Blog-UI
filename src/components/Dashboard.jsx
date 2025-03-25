// Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const BASE_URL = "http://localhost:8000";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [createFormData, setCreateFormData] = useState({ title: "", description: "", image: null });
  const [editFormData, setEditFormData] = useState({ title: "", description: "", image: null });
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value, files } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(createFormData).forEach(([key, value]) => data.append(key, value));

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      await axios.post(`${BASE_URL}/api/blogs`, data, config);
      setCreateFormData({ title: "", description: "", image: null });
      fetchBlogs();
    } catch (error) {
      console.error("Error posting blog:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(editFormData).forEach(([key, value]) => data.append(key, value));

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      await axios.put(`${BASE_URL}/api/blogs/${selectedBlog.id}`, data, config);
      resetEditForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${BASE_URL}/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setEditFormData({
      title: blog.title,
      description: blog.description,
      image: null
    });
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
  };

  const resetEditForm = () => {
    setEditFormData({ title: "", description: "", image: null });
    setSelectedBlog(null);
    setIsEditing(false);
  };

  const resetView = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dashboard</h1>
        {user && (
          <div className="user-profile">
            <img src={`${BASE_URL}/${user.profileImage}`} alt="Profile" className="profile-image" />
            <span>Welcome, {user.email}</span>
          </div>
        )}
      </header>

      <form onSubmit={handleCreateSubmit} className="blog-form">
        <h2>Create New Blog</h2>
        <input
          type="text"
          name="title"
          value={createFormData.title}
          onChange={handleCreateInputChange}
          placeholder="Blog Title"
          required
        />
        <textarea
          name="description"
          value={createFormData.description}
          onChange={handleCreateInputChange}
          placeholder="Blog Description"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleCreateInputChange}
        />
        <div className="form-actions">
          <button type="submit">Add Blog</button>
        </div>
      </form>

      <div className="blogs-table-container">
        <table className="blogs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>
                  <img src={`${BASE_URL}/${blog.image}`} alt={blog.title} className="blog-image" />
                </td>
                <td>{blog.description.substring(0, 100)}...</td>
                <td className="actions-cell">
                  <button className="action-button view" onClick={() => handleView(blog)}>View</button>
                  <button className="action-button edit" onClick={() => handleEdit(blog)}>Edit</button>
                  <button className="action-button delete" onClick={() => handleDelete(blog.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBlog && !isEditing && (
        <div className="modal-overlay" onClick={resetView}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedBlog.title}</h2>
            {selectedBlog.image && (
              <img src={`${BASE_URL}/${selectedBlog.image}`} alt={selectedBlog.title} className="modal-image" />
            )}
            <p>{selectedBlog.description}</p>
            <button className="close-button" onClick={resetView}>Close</button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="modal-overlay" onClick={resetEditForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleEditSubmit} className="blog-form">
              <h2>Edit Blog</h2>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditInputChange}
                placeholder="Blog Title"
                required
              />
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                placeholder="Blog Description"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleEditInputChange}
              />
              <div className="form-actions">
                <button type="submit">Update Blog</button>
                <button type="button" className="cancel-button" onClick={resetEditForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;