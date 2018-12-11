const axios = require('axios')

const logger = require('../modules/winston')

class CommentTools {
    constructor(config, comment, user) {
        this.comment = comment || null
        this.user = user || null
        this.private_reply_url = `https://graph.facebook.com/${config.api_version}/${this.comment.id}/private_replies?access_token=${config.access_token}`
    }

    async replyPrivately(text) {
        try {
            if (!text) throw new Error('Private reply must contain text message!')
            const data = await axios.post(this.private_reply_url, {
                message: text
            })
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }
}

module.exports = CommentTools
