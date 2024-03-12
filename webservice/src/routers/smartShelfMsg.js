import express from 'express'
import mongoose from 'mongoose'
import SmartShelfMsg from '../models/SmartShelfMsg'
const { log } = require('../../common/logger');

const router = express.Router()

// Get All Messages 
router.get('/', async (req, res) => {
    try {
        log('Get all SmartShelf Messages')
        let msgs = await SmartShelfMsg.find()
        if (!msgs) {
            return res.status(401).send({ error: 'SmartShelf Messages not found' })
        }
        res.status(200).send(msgs);
    } catch (error) {
        res.status(400).send(error)
    }
})

// Get a SmartShelfMsg by query id
router.get('/findById', async (req, res) => {
    try {
        // View msg with id = req.query.id
        log('SmartShelfMsg Id : ' + req.query.msgId)

        //Check if is a valid MongoDB Id
        let valid = mongoose.Types.ObjectId.isValid(req.query.msgId);
        if (!valid) {
            return res.status(400).send({ error: 'Not a valid ObjectId id for msg' })
        }
        let msg = await SmartShelfMsg.findById(req.query.msgId)

        if (!msg) {
            return res.status(401).send({ error: 'SmartShelf Message not found' })
        }
        res.status(200).send(msg);
    } catch (error) {
        res.status(400).send(error)
    }
})

// Get a SmartShelfMsg by URL param msgId
router.get('/:msgId', async (req, res) => {
    try {
        // View msg with id = req.params.msgId
        log(`Find by msgId : ${req.params.msgId}`)

        //Check if is a valid MongoDB Id
        let valid = mongoose.Types.ObjectId.isValid(req.params.msgId);
        if (!valid) {
            return res.status(400).send({ error: 'Not a valid ObjectId for msg' })
        }
        let msg = await SmartShelfMsg.findById(req.params.msgId)

        if (!msg) {
            return res.status(401).send({ error: 'SmartShelf Message not found' })
        }
        res.status(200).send(msg);
    } catch (error) {
        res.status(400).send(error)
    }
})

// Send a SmartShelfMsg
router.post('/', async (req, res) => {
    // Create a new msg
    try {
        const msg = new SmartShelfMsg(req.body)
        await msg.save()
        res.status(201).send({ msg })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Update a SmartShelfMsg
router.put('/:msgId', async (req, res) => {
    // Update a msg
    log(`Update msg with msgId : ${req.params.msgId}`)
    try {
        const updatedSmartShelfMsg = await SmartShelfMsg.updateOne({ _id: req.params.msgId }, req.body)
        res.status(201).send(updatedSmartShelfMsg)
    } catch (error) {
        res.status(400).send(error)
    }
})


// Delete a SmartShelfMsg
router.delete('/: msgId', async (req, res) => {
    // Delete a  msg    
    log(`Delete by  msgId : ${req.params.msgId}`)
    try {
        const removedSmartShelfMsg = await SmartShelfMsg.remove({ _id: req.params.msgId })
        res.status(200).send(removedSmartShelfMsg)
    } catch (error) {
        res.status(400).send(error)
    }
})


export default router