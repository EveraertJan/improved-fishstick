const express = require('express');
const router = express.Router();
const { checkBodyFields } = require("./helpers/bodyHelpers");
const { decodeToken } = require("./helpers/authHelpers");

// Import controllers
const authController = require('./controllers/authController');
const savedItemsController = require('./controllers/savedItemsController');
const tagsController = require('./controllers/tagsController');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Auth routes (public)
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.get('/api/auth/me', decodeToken, authController.getCurrentUser);

// Saved items routes (all protected)
router.get('/api/saved-items', decodeToken, savedItemsController.getAllItems);
router.get('/api/saved-items/search', decodeToken, savedItemsController.searchItems);
router.get('/api/saved-items/:id', decodeToken, savedItemsController.getItemById);
router.post('/api/saved-items', decodeToken, savedItemsController.createItem);
router.put('/api/saved-items/:id', decodeToken, savedItemsController.updateItem);
router.delete('/api/saved-items/:id', decodeToken, savedItemsController.deleteItem);
router.post('/api/saved-items/:id/tags', decodeToken, savedItemsController.addItemTag);
router.delete('/api/saved-items/:id/tags/:tagId', decodeToken, savedItemsController.removeItemTag);

// Tags routes (all protected)
router.get('/api/tags', decodeToken, tagsController.getAllTags);
router.get('/api/tags/:id', decodeToken, tagsController.getTagById);
router.post('/api/tags', decodeToken, tagsController.createTag);
router.put('/api/tags/:id', decodeToken, tagsController.updateTag);
router.delete('/api/tags/:id', decodeToken, tagsController.deleteTag);
router.get('/api/tags/:id/items', decodeToken, tagsController.getItemsByTag);

module.exports = router;
