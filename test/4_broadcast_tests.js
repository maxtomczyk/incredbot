const Incredbot = require('../index.js')
const config = require('./config')
const incredbot = new Incredbot(config.incredbot)
const expect = require('chai').expect
const should = require('chai').should()

describe('Broadcast Class', function () {
    let labelId = null
    let creativeId = null
    let creativeId2 = null
    let broadcastId = null
    let estimationId = null
    this.timeout(8000)
    it('Should create messages with createMessage()', async () => {
        creativeId = await incredbot.broadcast.createMessage(new incredbot.Message.Text('Testing...'))
        creativeId2 = await incredbot.broadcast.createMessage(new incredbot.Message.Text('Testing 2...'))
        expect(creativeId).to.be.an('string')
    })
    it('Should list labels with listLabels()', async () => {
        const labels = await incredbot.broadcast.listLabels()
    })
    it('Should create label with createLabel()', async () => {
        labelId = await incredbot.broadcast.createLabel(config.testLabelName)
    })
    it('Should assign label to user with labelToUser()', async () => {
        await incredbot.broadcast.labelToUser(labelId, config.testUserId)
    })
    it('Should get user\'s labels with listUserLabels()', async () => {
        await incredbot.broadcast.listUserLabels(config.testUserId)
    })
    it('Should list broadcasts with listBroadcasts()', async () => {
        await incredbot.broadcast.listBroadcasts()
    })
    it('Should send instant broadcast request with send()', async () => {
        await incredbot.broadcast.send(creativeId, labelId)
    })
    it('Should send scheduled broadcast request with send()', async () => {
        let d = new Date(+new Date() + 25 * 60 * 60 * 1000)
        let date = +new Date(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`)
        date = date.toString()
        broadcastId = await incredbot.broadcast.send(creativeId2, labelId, {
            schedule_time: date.substring(0, date.length - 3)
        })
    })
    it('Should get broadcast data with getBroadcast()', async () => {
        await incredbot.broadcast.getBroadcast(broadcastId)
    })
    it('Should cancel scheduled broadcast with cancel()', async () => {
        await incredbot.broadcast.cancel(broadcastId)
    })
    it('Should start broadcast range estimation with startEstimation()', async () => {
        estimationId = await incredbot.broadcast.startEstimation(labelId)
    })
    it('Should get broadcast range estimation with getEstimation()', async () => {
        await incredbot.broadcast.getEstimation(estimationId)
    })
    it('Should get broadcast metrics with getMetrics()', async () => {
        await incredbot.broadcast.getMetrics(broadcastId)
    })
    it('Should remove label from user with removeLabelFromUser()', async () => {
        await incredbot.broadcast.removeLabelFromUser(labelId, config.testUserId)
    })
    it('Should remove label with deleteLabel()', async () => {
        await incredbot.broadcast.deleteLabel(labelId)
    })
})
