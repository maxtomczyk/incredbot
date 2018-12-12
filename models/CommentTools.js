const axios = require('axios')

const logger = require('../modules/winston')

let that = null

class CommentTools {
    constructor(config, comment, user, emitter) {
        this.comment = comment || null
        this.user = user || null
        this.private_reply_url = `https://graph.facebook.com/${config.api_version}/${this.comment.id}/private_replies?access_token=${config.access_token}`
        this.emitter = emitter
        that = this
    }

    async replyPrivately(text) {
        try {
            if (!text) throw new Error('Private reply must contain text message!')
            const body = {
                message: text
            }
            const data = await axios.post(this.private_reply_url, body)
            that.emitter.emit('request_outgoing', body, data)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }
}

module.exports = CommentTools
