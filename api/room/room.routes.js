const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getById, query, remove, update, add, checkIsForbidden} = require('./room.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)



// router.get('/', query)
router.get('/', getById)
router.put('/:id', update)
router.get('/:id/validate', checkIsForbidden)
router.post('/', add)
router.delete('/:id', remove)


module.exports = router

// router.get('/', query)
// router.get('/:id', getById)
// router.put('/:id',  requireAuth, update)
// router.post('/', add)
// router.delete('/:id',  requireAuth, requireAdmin, remove)
