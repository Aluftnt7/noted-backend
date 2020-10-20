const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { removeNote, changeNoteColor, toggleNotePin, updateNote, getStarredNotes, toggleStarredNote } = require('../note/note.controller')
const router = express.Router()

router.get('/starredNotes', getStarredNotes)
router.delete('/removeNote', removeNote)
router.put('/changeNoteColor', changeNoteColor)
router.put('/toggleNotePin', toggleNotePin)
router.put('/updateNote', updateNote)
router.put('/toggleStar', toggleStarredNote)

module.exports = router
