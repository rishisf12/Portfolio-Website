import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authAPI, imageAPI } from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State for contacts
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for projects
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  
  // State for modals
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyData, setReplyData] = useState({ subject: '', message: '' });
  const [replying, setReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // State for project form
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    live_demo_url: '',
    github_url: '',
    is_featured: false
  });
  const [submittingProject, setSubmittingProject] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchProjects();
  }, []);

  // ============ CONTACT FUNCTIONS ============
  const fetchContacts = async () => {
    try {
      const data = await adminAPI.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminAPI.markAsRead(id);
      setContacts(contacts.map(c => 
        c.id === id ? { ...c, is_read: true } : c
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    setDeleting(true);
    try {
      await adminAPI.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyData({
      subject: `Re: Contact Form Submission`,
      message: ''
    });
    setReplySuccess(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setReplying(true);
    
    try {
      await adminAPI.replyToContact({
        to_email: selectedContact.email,
        subject: replyData.subject,
        message: replyData.message,
        contact_id: selectedContact.id
      });
      
      setReplySuccess(true);
      setReplyData({ subject: '', message: '' });
      await fetchContacts();
      
      setTimeout(() => {
        setSelectedContact(null);
        setReplySuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setReplying(false);
    }
  };

  // ============ IMAGE UPLOAD FUNCTIONS ============
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, GIF, WEBP, SVG, BMP)');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await imageAPI.upload(file);
      setProjectForm({ ...projectForm, image: result.url });
      setImagePreview(result.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setProjectForm({ ...projectForm, image: '' });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============ PROJECT FUNCTIONS ============
  const fetchProjects = async () => {
    try {
      const data = await adminAPI.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProject(true);
    
    try {
      const formData = {
        ...projectForm,
        tags: projectForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (editingProject) {
        await adminAPI.updateProject(editingProject.id, formData);
      } else {
        await adminAPI.createProject(formData);
      }
      
      await fetchProjects();
      setShowProjectModal(false);
      resetProjectForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
      live_demo_url: project.live_demo_url || '',
      github_url: project.github_url || '',
      is_featured: project.is_featured || false
    });
    setImagePreview(project.image || null);
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await adminAPI.deleteProject(id);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      image: '',
      tags: '',
      live_demo_url: '',
      github_url: '',
      is_featured: false
    });
    setImagePreview(null);
    setEditingProject(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-20">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 sm:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Admin <span className="text-purple-500">Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-1">Manage contacts, projects, and content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetProjectForm();
                setShowProjectModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform"
            >
              + Add Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">{contacts.length}</div>
            <div className="text-gray-400 text-sm">Total Messages</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">
              {contacts.filter(c => !c.is_read).length}
            </div>
            <div className="text-gray-400 text-sm">Unread</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {contacts.filter(c => c.is_read).length}
            </div>
            <div className="text-gray-400 text-sm">Read</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
            <div className="text-gray-400 text-sm">Projects</div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-8">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Projects</h2>
            <span className="text-sm text-gray-400">{projects.length} total</span>
          </div>
          
          <div className="divide-y divide-white/10">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No projects yet. Click "Add Project" to create one.
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center text-2xl">
                          📷
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white truncate">
                            {project.title}
                          </h3>
                          {project.is_featured && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Array.isArray(project.tags) ? project.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                              {tag}
                            </span>
                          )) : project.tags?.split(',').map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contacts Section */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Messages</h2>
            <span className="text-sm text-gray-400">
              {contacts.filter(c => !c.is_read).length} unread
            </span>
          </div>
          
          <div className="divide-y divide-white/10">
            {contacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No messages yet
              </div>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white truncate">
                          {contact.name}
                        </h3>
                        {!contact.is_read && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{contact.email}</p>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">{contact.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contact.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {!contact.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(contact.id)}
                          className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleReply(contact)}
                        className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(contact.id)}
                        className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Modal with Image Upload */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  resetProjectForm();
                }}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Image *
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Project preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500"
                    >
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg cursor-pointer hover:bg-purple-500/30 transition-colors"
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, GIF, WEBP, SVG, BMP (Max 5MB)
                    </p>
                    {projectForm.image && (
                      <p className="text-xs text-green-400 mt-1">✅ Image uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma-separated) *
                </label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  required
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Live Demo URL *
                </label>
                <input
                  type="url"
                  value={projectForm.live_demo_url}
                  onChange={(e) => setProjectForm({ ...projectForm, live_demo_url: e.target.value })}
                  required
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub URL *
                </label>
                <input
                  type="url"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                  required
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={projectForm.is_featured}
                  onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
                <label className="text-sm font-medium text-gray-300">
                  Featured Project
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submittingProject || uploadingImage}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50"
                >
                  {submittingProject ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectModal(false);
                    resetProjectForm();
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Reply to {selectedContact.name}</h3>
              <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-white transition-colors text-2xl">✕</button>
            </div>

            {replySuccess ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
                ✅ Reply sent successfully!
              </div>
            ) : (
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
                  <input type="email" value={selectedContact.email} disabled className="w-full px-4 py-2 bg-black/50 rounded-lg text-gray-400 border border-gray-700 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                  <input type="text" value={replyData.subject} onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })} required className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea value={replyData.message} onChange={(e) => setReplyData({ ...replyData, message: e.target.value })} required rows="5" className="w-full px-4 py-2 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none" placeholder="Type your reply here..." />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={replying} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50">
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                  <button type="button" onClick={() => setSelectedContact(null)} className="px-4 py-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Contact</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDeleteContact(deleteConfirm)} disabled={deleting} className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold transition-all hover:bg-red-600 disabled:opacity-50">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;