const Incredbot = require('../index.js')
const config = require('./config')
const incredbot = new Incredbot(config.incredbot)
const expect = require('chai').expect
const should = require('chai').should()

describe('User Object', function () {
    it('Should correctly fetch user data', async () => {
        const user = await incredbot.User(config.testUserId).getData()
        expect(user).to.be.an('object')
    })
    it('Should send message to user', async () => {
        const user = await incredbot.User(config.testUserId).send.text('Testing...')
        expect(user).to.be.an('object')
    })
})

describe('Sender Class', function () {
    this.timeout(8000)
    const options = {
        recipient_id: config.testUserId
    }

    const qrs = [
        new incredbot.Helpers.QuickReply('text', 'QR 1', 'TEST_1'),
        new incredbot.Helpers.QuickReply('text', 'QR 2', 'TEST_2')
    ]

    const buttons = [
        new incredbot.Helpers.Button('postback', 'BUTTON 1', 'TEST_1'),
        new incredbot.Helpers.Button('postback', 'BUTTON 2', 'TEST_2')
    ]

    const card = new incredbot.Helpers.Generic({
        title: 'Title',
        subtitle: 'Subtitle'
    })

    const setting = new incredbot.Helpers.GetStartedButton()

    const cards = [card, card, card]

    it('Should send message via text() method', async () => {
        await incredbot.send.text('Testing text method...', options)
    })
    it('Should send message via quick_replies() method', async () => {
        await incredbot.send.quick_replies('Testing quick_replies method...', qrs, options)
    })
    it('Should send message via buttons() method', async () => {
        await incredbot.send.buttons('Testing buttons method...', buttons, options)
    })
    it('Should send message (with quick replpies) via buttons() method', async () => {
        await incredbot.send.buttons('Testing buttons (with quick_replies) method...', buttons, qrs, options)
    })
    it('Should send message via generic() method', async () => {
        await incredbot.send.generic(cards, options)
    })
    it('Should send attachment via attachment() method', async () => {
        await incredbot.send.attachment('image', config.attachmentUrl, options)
    })
    it('Should send settings via setting() method', async() => {
        await incredbot.send.setting(setting)
    })
})

describe('Uploader module', function () {
    it('Should upload attachment from URL and get it\'s ID', async () => {
        const id = await incredbot.upload.fromUrl('image', config.attachmentUrl)
        expect(id).to.be.an('string')
    })
})
