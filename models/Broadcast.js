const axios = require('axios')

const logger = require('../modules/winston')

class Broadcast {
    constructor(options) {
        this.creatives_url = `https://graph.facebook.com/${options.api_version}/me/message_creatives?access_token=${options.access_token}`
        this.broadcast_url = `https://graph.facebook.com/${options.api_version}/me/broadcast_messages?access_token=${options.access_token}`
    }

    async create(messages) {
        try {
            if (!Array.isArray(messages)) {
                messages = [messages]
            }
            const data = await axios.post(this.creatives_url, {
                messages
            })
            return data.data.message_creative_id
        } catch (e) {
            logger.error(e)
            throw e
        }
    }
}

module.exports = Broadcast
