import React, { useState, useEffect } from 'react';
import { tagsAPI } from '../services/api';
import Button from './Button';
import ColorPicker from './ColorPicker';

const TagManager = ({ showHeader = true }) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [color1, setColor1] = useState('#1e7ea5');
  const [color2, setColor2] = useState('#17416e');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await tagsAPI.getAll();
      setTags(response.data.tags);
      setError('');
    } catch (err) {
      setError('Failed to load tags');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setCreating(true);
      const response = await tagsAPI.create({
        name: newTagName.trim(),
        color1,
        color2
      });
      const newTag = response.data.tag;
      setTags([...tags, newTag]);
      setNewTagName('');
      setColor1('#1e7ea5');
      setColor2('#17416e');
      setError('');
    } catch (err) {
      setError('Failed to create tag');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) {
      return;
    }

    try {
      await tagsAPI.delete(tagId);
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (err) {
      alert('Failed to delete tag');
      console.error(err);
    }
  };

  return (
    <div className="tag-manager">
      {showHeader && (
        <div className="tag-manager-header">
          <h3>Tags</h3>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleCreateTag} className="tag-create-form">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name..."
          className="tag-input"
          disabled={creating}
        />
        <ColorPicker
          label="First Color"
          selectedColor={color1}
          onColorSelect={setColor1}
        />
        <ColorPicker
          label="Second Color"
          selectedColor={color2}
          onColorSelect={setColor2}
        />
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={creating || !newTagName.trim()}
        >
          {creating ? 'Creating...' : 'Create Tag'}
        </Button>
      </form>

      {loading ? (
        <div className="tags-loading">Loading tags...</div>
      ) : (
        <div className="tags-list">
          {tags.length === 0 ? (
            <div className="no-tags">No tags yet. Create your first tag above!</div>
          ) : (
            tags.map((tag) => {
              if (!tag || !tag.id) return null;

              return (
                <div key={tag.id} className="tag-item">
                  <div className="tag-item-content">
                    <div
                      className="tag-color-preview"
                      style={{
                        background: `linear-gradient(135deg, ${tag.color1 || '#1e7ea5'} 50%, ${tag.color2 || '#17416e'} 50%)`
                      }}
                    />
                    <span className="tag-item-name">{tag.name || 'Untitled'}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="tag-item-delete"
                    type="button"
                    aria-label="Delete tag"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default TagManager;