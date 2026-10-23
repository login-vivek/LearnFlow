const router  = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getNotes, createNote, updateNote, deleteNote,
  getSnippets, createSnippet, updateSnippet, deleteSnippet,
} = require('../controllers/notesController');

// All routes require auth
router.use(protect);

// Notes
router.get('/',            getNotes);
router.post('/',           createNote);
router.put('/:id',         updateNote);
router.delete('/:id',      deleteNote);

// Snippets
router.get('/snippets',         getSnippets);
router.post('/snippets',        createSnippet);
router.put('/snippets/:id',     updateSnippet);
router.delete('/snippets/:id',  deleteSnippet);

module.exports = router;
