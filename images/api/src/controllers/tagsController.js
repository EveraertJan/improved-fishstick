const db = require('../db/db');
const { checkBodyFields } = require("../helpers/bodyHelpers");

const createTag = async (req, res) => {
  try {
    const { name, color1, color2 } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    // Check if tag already exists for this user
    const existingTag = await db('tags')
      .where({ user_id: req.user.userId, name: name.trim() })
      .first();

    if (existingTag) {
      return res.status(409).json({ error: 'Tag already exists' });
    }

    // Create new tag
    const [tag] = await db('tags')
      .insert({
        user_id: req.user.userId,
        name: name.trim(),
        color1: color1 || '#1e7ea5',
        color2: color2 || '#17416e'
      })
      .returning('*');

    res.status(201).json({ tag });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

const getAllTags = async (req, res) => {
  try {
    
    const tags = await db('tags')
      .where({ user_id: req.user.userId })
      .orderBy('name', 'asc');

    res.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Failed to get tags' });
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tag = await db('tags')
      .where({ id, user_id: req.user.userId })
      .first();
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ tag });
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({ error: 'Failed to get tag' });
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    
    // Check if tag exists and belongs to user
    const existingTag = await db('tags')
      .where({ id, user_id: req.user.userId })
      .first();
    
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Check if new name conflicts with existing tag
    const nameConflict = await db('tags')
      .where({ 
        user_id: req.user.userId, 
        name: name.trim(),
        id: { '!=': id }
      })
      .first();

    if (nameConflict) {
      return res.status(409).json({ error: 'Tag name already exists' });
    }

    // Update tag
    const [updatedTag] = await db('tags')
      .where({ id, user_id: req.user.userId })
      .update({ 
        name: name.trim(),
        updated_at: new Date()
      })
      .returning('*');

    res.json({ tag: updatedTag });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tag exists and belongs to user
    const tag = await db('tags')
      .where({ id, user_id: req.user.userId })
      .first();
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Delete tag (cascade will handle item_tags)
    await db('tags')
      .where({ id, user_id: req.user.userId })
      .del();

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};

const getItemsByTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tag exists and belongs to user
    const tag = await db('tags')
      .where({ id, user_id: req.user.userId })
      .first();
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Get items associated with this tag
    const items = await db('saved_items')
      .select('saved_items.*')
      .join('item_tags', 'saved_items.id', '=', 'item_tags.item_id')
      .join('tags', 'item_tags.tag_id', '=', 'tags.id')
      .where({ 'tags.id': id, 'saved_items.user_id': req.user.userId })
      .orderBy('saved_items.created_at', 'desc');

    res.json({ items });
  } catch (error) {
    console.error('Get items by tag error:', error);
    res.status(500).json({ error: 'Failed to get items by tag' });
  }
};

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
  getItemsByTag,
};