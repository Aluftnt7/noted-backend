const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getById, query, remove, update, add, checkIsValidUser, removeNote, changeNoteColor, toggleNotePin, updateNote} = require('./room.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)



// router.get('/', query)
router.get('/', getById)
router.put('/:id', update)
router.post('/:id/validate', checkIsValidUser)
router.post('/', add)
router.delete('/:id', remove)
router.delete('/:id/removeNote', removeNote)
router.put('/:id/changeNoteColor', changeNoteColor)
router.put('/:id/toggleNotePin', toggleNotePin)
router.put('/:id/updateNote', updateNote)


module.exports = router

// router.get('/', query)
// router.get('/:id', getById)
// router.put('/:id',  requireAuth, update)
// router.post('/', add)
// router.delete('/:id',  requireAuth, requireAdmin, remove)
