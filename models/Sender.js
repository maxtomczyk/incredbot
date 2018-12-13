const axios = require('axios')
const MessageFrame = require('./MessageFrame.js')
const MessageBase = require('./MessageBase.js')
const TemplateBase = require('./TemplateBase.js')
const Attachment = require('./AttachmentMessage.js')
const Typer = require('./Typer.js')

const createError = require('../modules/create_error.js')

let that = null

class Sender {
    constructor(config, recipient_id, emitter) {
        config = config || {}
        this.config = config
        this.access_token = config.access_token
        this.recipient_id = recipient_id || null
        this.api_version = config.api_version
        this.api_url = this.config.api_url || `https://graph.facebook.com/${this.api_version}/me/messages?access_token=${this.access_token}`
        this.setting_url = this.config.setting_url || `https://graph.facebook.com/${this.api_version}/me/messenger_profile?access_token=${this.access_token}`
        this.natural_typing = config.natural_typing || true
        this.natural_typing_speed = config.natural_typing_speed || 50
        this.typing = new Typer(config, emitter)
        this.emitter = emitter
        that = this
    }

    async raw(message) {
        try {
            if (message.message.text && this.natural_typing) await this.typing.on(message.recipient.id, this.calculateTypingTime(message.message.text))

            const response = await axios.post(this.api_url, message)
            this.emitter.emit('request_outgoing', message, response)
            this.emitter.emit('message_sent', message, response)
            return response
        } catch (e) {
            throw createError(e)
        }
    }

    calculateTypingTime(text) {
        const cps = this.natural_typing_speed
        let time = Math.round((text.length / cps) * 1000)
        if (time < 5000) return time
        else return 5000
    }

    text(text, options) {
        if (!text) throw createError('Message text can\'t be empty!')

        options = options || {}
        options.text = text
        options.recipient_id = this.recipient_id || options.recipient_id
        let message = new MessageFrame(new MessageBase(options), options)

        return this.raw(message)
    }

    quick_replies(text, replies, options) {
        if (!text) throw createError('Message text can\'t be empty!')

        options = options || {}
        options.text = text
        options.recipient_id = this.recipient_id || options.recipient_id
        options.replies = replies

        let message = new MessageFrame(new MessageBase(options), options)

        return this.raw(message)
    }

    buttons(text, buttons, replies, options) {
        if (!text) throw createError('Message text can\'t be empty!')
        options = options || {}
        if (!Array.isArray(replies)) options = replies || options
        else options.quick_replies = replies
        options.text = text
        options.recipient_id = this.recipient_id || options.recipient_id
        options.buttons = buttons

        let message = new MessageFrame(new TemplateBase(options), options)

        return this.raw(message)
    }

    async setting(data) {
        try {
            const response = await axios.post(this.setting_url, data)
            this.emitter.emit('request_outgoing', data, response)
            return response
        } catch (e) {
            throw createError(e)
        }
    }

    generic(elements, options) {
        options = options || {}
        options.recipient_id = this.recipient_id || options.recipient_id
        options.generics = elements

        let message = new MessageFrame(new TemplateBase(options), options)

        return this.raw(message)
    }

    attachment(type, url, options) {
        options = options || {}
        options.recipient_id = this.recipient_id || options.recipient_id
        options.is_reusable = options.is_reusable || true
        options.url = url
        options.type = type

        let message = new Attachment(options)
        return this.raw(message)
    }
}

module.exports = Sender
