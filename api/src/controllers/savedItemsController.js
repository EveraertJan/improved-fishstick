const db = require('../db/db');
const { checkBodyFields } = require('../helpers/bodyHelpers');
const { sanitizeArticleHtml } = require('../helpers/htmlHelpers');

// GET /api/saved-items - Get all saved items for authenticated user
const getAllItems = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rows = await db('saved_items')
      .leftJoin('item_tags', 'saved_items.id', '=', 'item_tags.item_id')
      .leftJoin('tags', 'item_tags.tag_id', '=', 'tags.id')
      .select(
        'saved_items.*',
        'tags.id as tag_id',
        'tags.name as tag_name'
      )
      .where({ 'saved_items.user_id': userId })
      .orderBy('saved_items.created_at', 'desc');

    // Aggregate results to group tags by item
    const itemsMap = new Map();
    
    rows.forEach(row => {
      if (!itemsMap.has(row.id)) {
        itemsMap.set(row.id, {
          ...row,
          tags: []
        });
        // Remove tag-related fields from main object
        delete itemsMap.get(row.id).tag_id;
        delete itemsMap.get(row.id).tag_name;
      }
      
      if (row.tag_id) {
        itemsMap.get(row.id).tags.push({
          id: row.tag_id,
          name: row.tag_name
        });
      }
    });

    const items = Array.from(itemsMap.values());

    res.status(200).json({
      items,
      count: items.length
    });
  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({ message: 'Server error fetching items' });
  }
};

// GET /api/saved-items/:id - Get single item
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const items = await db('saved_items')
      .leftJoin('item_tags', 'saved_items.id', '=', 'item_tags.item_id')
      .leftJoin('tags', 'item_tags.tag_id', '=', 'tags.id')
      .select(
        'saved_items.*',
        'tags.id as tag_id',
        'tags.name as tag_name'
      )
      .where({ 'saved_items.id': id, 'saved_items.user_id': userId })
      .orderBy('tags.name', 'asc');

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Aggregate tags
    const item = {
      ...items[0],
      tags: items
        .filter(row => row.tag_id)
        .map(row => ({
          id: row.tag_id,
          name: row.tag_name
        }))
    };

    res.status(200).json({ item });
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({ message: 'Server error fetching item' });
  }
};

// POST /api/saved-items - Create new saved item
const createItem = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Validate required fields from Firefox plugin
    if (!checkBodyFields(req.body, ['type', 'url'])) {
      return res.status(400).json({
        message: 'Missing required fields: type, url'
      });
    }

    const {
      type,
      content,
      url,
      date,
      title,
      description,
      author,
      siteName,
      articleText
    } = req.body;

    const [item] = await db('saved_items')
      .insert({
        user_id: userId,
        type,
        content,
        url,
        date: date || new Date(),
        title,
        description,
        author,
        site_name: siteName,
        article_text: sanitizeArticleHtml(articleText)
      })
      .returning('*');

    res.status(201).json({
      message: 'Item saved successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error creating item' });
  }
};

// PUT /api/saved-items/:id - Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if item exists and belongs to user
    const existingItem = await db('saved_items')
      .where({ id, user_id: userId })
      .first();

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update allowed fields
    const {
      type,
      content,
      url,
      date,
      title,
      description,
      author,
      siteName,
      articleText
    } = req.body;

    const updateData = {
      updated_at: new Date()
    };

    if (type !== undefined) updateData.type = type;
    if (content !== undefined) updateData.content = content;
    if (url !== undefined) updateData.url = url;
    if (date !== undefined) updateData.date = date;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (author !== undefined) updateData.author = author;
    if (siteName !== undefined) updateData.site_name = siteName;
    if (articleText !== undefined) updateData.article_text = sanitizeArticleHtml(articleText);

    const [updatedItem] = await db('saved_items')
      .where({ id, user_id: userId })
      .update(updateData)
      .returning('*');

    res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error updating item' });
  }
};

// DELETE /api/saved-items/:id - Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if item exists and belongs to user
    const existingItem = await db('saved_items')
      .where({ id, user_id: userId })
      .first();

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await db('saved_items')
      .where({ id, user_id: userId })
      .delete();

    res.status(200).json({
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error deleting item' });
  }
};

const addItemTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagId } = req.body;
    const userId = req.user.userId;

    // Check if item exists and belongs to user
    const item = await db('saved_items')
      .where({ id, user_id: userId })
      .first();
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if tag exists and belongs to user
    const tag = await db('tags')
      .where({ id: tagId, user_id: userId })
      .first();
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Check if association already exists
    const existingAssociation = await db('item_tags')
      .where({ item_id: id, tag_id: tagId })
      .first();
    
    if (existingAssociation) {
      return res.status(409).json({ message: 'Item already has this tag' });
    }

    // Create association
    await db('item_tags')
      .insert({
        item_id: id,
        tag_id: tagId
      });

    res.status(200).json({ message: 'Tag added to item successfully' });
  } catch (error) {
    console.error('Add item tag error:', error);
    res.status(500).json({ message: 'Server error adding tag to item' });
  }
};

const removeItemTag = async (req, res) => {
  try {
    const { id, tagId } = req.params;
    const userId = req.user.userId;

    // Check if item exists and belongs to user
    const item = await db('saved_items')
      .where({ id, user_id: userId })
      .first();
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if tag exists and belongs to user
    const tag = await db('tags')
      .where({ id: tagId, user_id: userId })
      .first();
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Remove association
    const deleted = await db('item_tags')
      .where({ item_id: id, tag_id: tagId })
      .del();

    if (deleted === 0) {
      return res.status(404).json({ message: 'Tag not associated with item' });
    }

    res.status(200).json({ message: 'Tag removed from item successfully' });
  } catch (error) {
    console.error('Remove item tag error:', error);
    res.status(500).json({ message: 'Server error removing tag from item' });
  }
};

const searchItems = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.userId;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerms = q.trim().toLowerCase().split(/\s+/).filter(term => term.length > 0);
    
    if (searchTerms.length === 0) {
      return res.status(400).json({ message: 'Valid search terms are required' });
    }

    // Build search query with ranking
    const searchConditions = searchTerms.map(term => 
      `(
        LOWER(saved_items.title) LIKE '%${term}%' OR
        LOWER(saved_items.content) LIKE '%${term}%' OR
        LOWER(saved_items.description) LIKE '%${term}%'
      )`
    ).join(' AND ');

    // Build ranking calculation
    const rankingCalc = searchTerms.map((term, index) => {
      const weight = searchTerms.length - index; // Earlier terms get higher weight
      return `
        (
          CASE 
            WHEN LOWER(saved_items.title) LIKE '%${term}%' THEN ${weight * 3}
            WHEN LOWER(saved_items.content) LIKE '%${term}%' THEN ${weight * 2}
            WHEN LOWER(saved_items.description) LIKE '%${term}%' THEN ${weight * 1}
            ELSE 0
          END
        )
      `;
    }).join(' + ');

    const query = `
      SELECT 
        saved_items.*,
        (${rankingCalc}) as search_score,
        (
          SELECT json_agg(
            json_build_object('id', tags.id, 'name', tags.name)
            ORDER BY tags.name
          ) FILTER (WHERE tags.id IS NOT NULL)
        ) as tags
      FROM saved_items
      LEFT JOIN item_tags ON saved_items.id = item_tags.item_id
      LEFT JOIN tags ON item_tags.tag_id = tags.id
      WHERE 
        saved_items.user_id = ? 
        AND (${searchConditions})
      GROUP BY saved_items.id
      HAVING (${rankingCalc}) > 0
      ORDER BY search_score DESC, saved_items.created_at DESC
    `;

    const items = await db.raw(query, [userId]);

    res.status(200).json({
      items: items.rows,
      count: items.rows.length,
      query: q.trim()
    });
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({ message: 'Server error searching items' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  addItemTag,
  removeItemTag,
  searchItems
};
