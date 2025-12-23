import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { savedItemsAPI, tagsAPI } from '../services/api';
import TagSelector from '../components/TagSelector';
import TagCircle from '../components/TagCircle';
import Modal from '../components/Modal';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [itemTags, setItemTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  useEffect(() => {
    // Mark as read when opening detail page
    if (item && !item.is_read) {
      markItemAsRead();
    }
  }, [item?.id, item?.is_read]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const [itemResponse, tagsResponse] = await Promise.all([
        savedItemsAPI.getById(id),
        tagsAPI.getAll()
      ]);
      setItem(itemResponse.data.item);
      setEditData(itemResponse.data.item);
      setItemTags(itemResponse.data.item.tags || []);
      setAllTags(tagsResponse.data.tags || []);
    } catch (err) {
      alert('Failed to load item');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const markItemAsRead = async () => {
    try {
      await savedItemsAPI.markAsRead(id);
      // Update local state
      setItem(prev => ({ ...prev, is_read: true }));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(item);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await savedItemsAPI.update(id, editData);
      setItem(response.data.item);
      setEditing(false);
      alert('Item updated successfully');
    } catch (err) {
      alert('Failed to update item');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await savedItemsAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const openTagModal = () => {
    setIsTagModalOpen(true);
  };

  const closeTagModal = () => {
    setIsTagModalOpen(false);
  };

  const handleTagSelect = async (selectedTagIds) => {
    try {
      setTagsLoading(true);

      // Find tags to add and remove
      const currentTagIds = itemTags.filter(tag => tag && tag.id).map(tag => tag.id);
      const tagsToAdd = selectedTagIds.filter(id => !currentTagIds.includes(id));
      const tagsToRemove = currentTagIds.filter(id => !selectedTagIds.includes(id));

      // Add new tags
      for (const tagId of tagsToAdd) {
        await savedItemsAPI.addTag(id, tagId);
      }

      // Remove tags
      for (const tagId of tagsToRemove) {
        await savedItemsAPI.removeTag(id, tagId);
      }

      // Refresh item data to get updated tags
      const response = await savedItemsAPI.getById(id);
      setItemTags(response.data.item.tags || []);
    } catch (err) {
      alert('Failed to update tags');
      console.error(err);
    } finally {
      setTagsLoading(false);
    }
  };

  const handleTagClick = async (tag) => {
    try {
      setTagsLoading(true);
      const isActive = itemTags.some(itemTag => itemTag.id === tag.id);

      if (isActive) {
        // Remove tag
        await savedItemsAPI.removeTag(id, tag.id);
      } else {
        // Add tag
        await savedItemsAPI.addTag(id, tag.id);
      }

      // Refresh item data to get updated tags
      const response = await savedItemsAPI.getById(id);
      setItemTags(response.data.item.tags || []);
    } catch (err) {
      alert('Failed to update tag');
      console.error(err);
    } finally {
      setTagsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading item...</div>;
  }

  if (!item) {
    return <div className="error">Item not found</div>;
  }

  return (
    <div className="item-detail">
      {/* Toolbar */}
      <div className="toolbar detail-toolbar">
        <div className="toolbar-section">
          <button
            onClick={() => navigate('/dashboard')}
            className="toolbar-btn"
            title="Back to Dashboard"
          >
            ←
          </button>
        </div>

        {!editing && (
          <div className="toolbar-section toolbar-actions detail-actions">
            
            <button
              onClick={handleEdit}
              className="toolbar-btn"
              title="Edit"
            >
              ✎
            </button>
            <div className="toolbar-divider"></div>
            <button
              onClick={handleDelete}
              className="toolbar-btn toolbar-btn-danger"
              title="Delete"
            >
              🗑
            </button>
          </div>
        )}

        {editing && (
          <div className="toolbar-section toolbar-actions detail-actions">
            <button
              onClick={handleSave}
              className="toolbar-btn-primary"
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="toolbar-btn-secondary"
              disabled={saveLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Tags Display */}
      {allTags && allTags.length > 0 && (
        <div className="detail-tags-section">
          {allTags.filter(tag => tag && tag.id && tag.name).map((tag) => {
            const isActive = itemTags.some(itemTag => itemTag.id === tag.id);
            return (
              <TagCircle
                key={tag.id}
                tag={tag}
                showName={false}
                isActive={isActive}
                onClick={() => handleTagClick(tag)}
              />
            );
          })}
        </div>
      )}

      <div className="detail-card">

        {editing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editData.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                value={editData.url || ''}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={editData.content || ''}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                rows={10}
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={editData.author || ''}
                onChange={(e) => setEditData({ ...editData, author: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Full Article (HTML)</label>
              <textarea
                value={editData.article_text || ''}
                onChange={(e) => setEditData({ ...editData, article_text: e.target.value })}
                rows={15}
                placeholder="Enter full article content (HTML supported)..."
                className="article-textarea"
              />
            </div>
          </div>
        ) : (
          <div className="item-content">

            {item.content && (
              <div className="item-text">                
                <h3>Highlight</h3>
                <p>{item.content}</p>
              </div>
            )}
            <div className="item-title">
              <h1>{item.title || 'Untitled'}</h1>
            </div>
            {item.author && (
              <p className="item-author">By {item.author}</p>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="item-link"
              >
                {item.url}
              </a>
            )}

            {item.site_name && (
              <p className="item-site">Source: {item.site_name}</p>
            )}


            {item.description && (
              <div className="item-description">
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
            )}

            <div className="transparent_content">
              {item.article_text && (
                <div className="item-article">
                  <h3>Full Article</h3>
                  <div dangerouslySetInnerHTML={{ __html: item.article_text }} />
                </div>
              )}

              {!item.article_text && (
                <div className="no-article-text">
                  <h3>Full Article</h3>
                  <p>No full article content available. Click "Edit" to add article text.</p>
                </div>
              )}
            </div>

            <div className="item-metadata">
              <p>Saved: {formatDate(item.created_at)}</p>
              {item.date && <p>Article Date: {formatDate(item.date)}</p>}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isTagModalOpen}
        onClose={closeTagModal}
        title="Add Tags to Item"
        size="medium"
      >
        <TagSelector
          onTagSelect={handleTagSelect}
          selectedTags={itemTags.map(tag => tag.id)}
        />
      </Modal>
    </div>
  );
};

export default ItemDetail;
