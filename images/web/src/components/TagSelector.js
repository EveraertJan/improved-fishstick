import React, { useState, useEffect } from 'react';
import { tagsAPI } from '../services/api';
import TagCircle from './TagCircle';

const TagSelector = ({ selectedTags = [], onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await tagsAPI.getAll();
      setTags(response.data.tags);
    } catch (err) {
      console.error('Failed to load tags', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagSelect(newSelection);
  };

  if (loading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="tag-selector">
      <p>Select tags for this item:</p>
      <div className="tag-selector-grid">
        {tags.length === 0 ? (
          <div className="no-tags">No tags available. Create tags in your profile.</div>
        ) : (
          tags.map((tag) => {
            if (!tag || !tag.id) return null;
            const isSelected = selectedTags.includes(tag.id);

            return (
              <button
                key={tag.id}
                type="button"
                className={`tag-selector-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleTagToggle(tag.id)}
              >
                <TagCircle tag={tag} showName={true} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TagSelector;
