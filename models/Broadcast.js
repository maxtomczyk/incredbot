const axios = require('axios')

const logger = require('../modules/winston')

class Broadcast {
    constructor(options) {
        this.access_token = options.access_token
        this.api_version = options.api_version
        this.creatives_url = `https://graph.facebook.com/${options.api_version}/me/message_creatives?access_token=${this.access_token}`
        this.broadcast_url = `https://graph.facebook.com/${options.api_version}/me/broadcast_messages?access_token=${this.access_token}`
        this.labels_url = `https://graph.facebook.com/${options.api_version}/me/custom_labels?access_token=${this.access_token}`
    }

    async createMessage(messages) {
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

    async createLabel(name) {
        try {
            if (!name) throw new Error('Label must have name!')
            const data = await axios.post(this.labels_url, {
                name
            })
            return data.data.id
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async listLabels() {
        try {
            const data = await axios.get(`${this.labels_url}&fields=name`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async deleteLabel(labelId) {
        try {
            if (!labelId) throw new Error(`You need to provide id of label to delete`)
            const data = await axios.delete(`https://graph.facebook.com/${this.api_version}/${labelId}?access_token=${this.access_token}`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async labelToUser(labelId, userId) {
        try {
            if (!labelId || !userId) throw new Error(`You need to provide id of label and user id to associate`)
            const data = await axios.post(`https://graph.facebook.com/${this.api_version}/${labelId}/label?access_token=${this.access_token}`, {
                user: userId
            })
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async removeLabelFromUser(labelId, userId) {
        try {
            if (!userId || !labelId) throw new Error(`You need to provide userId and labelId parameters`)
            const data = await axios.delete(`https://graph.facebook.com/${this.api_version}/${labelId}/label?user=${userId}&access_token=${this.access_token}`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async listUserLabels(userId) {
        try {
            if (!userId) throw new Error(`To get user's labels you need to pass user id`)
            const data = await axios.get(`https://graph.facebook.com/${this.api_version}/${userId}/custom_labels?access_token=${this.access_token}&fields=name`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async listBroadcasts() {
        try {
            const data = await axios.get(`${this.broadcast_url}&fields=scheduled_time,status,limit,insight`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async getBroadcast(broadcastId) {
        try {
            if (!broadcastId) throw new Error(`You must pass broadcast id to fetch data about it`)

            const data = await axios.get(`https://graph.facebook.com/${this.api_version}/${broadcastId}?fields=scheduled_time,status&access_token=${this.access_token}`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async cancel(broadcastId) {
        try {
            if (!broadcastId) throw new Error(`You must pass broadcast id of broadcast to cancel`)

            const data = await axios.post(`https://graph.facebook.com/${this.api_version}/${broadcastId}?access_token=${this.access_token}`, {
                operation: 'cancel'
            })
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async send(creativeId, labelId, options) {
        try {
            options = options || {}

            if (typeof(labelId) === 'object') options = labelId
            else options.custom_label_id = labelId

            options.messaging_type = options.messaging_type || 'MESSAGE_TAG'
            options.tag = options.tag || 'NON_PROMOTIONAL_SUBSCRIPTION'
            options.notification_type = options.notification_type || 'REGULAR'
            options.message_creative_id = creativeId

            const data = await axios.post(this.broadcast_url, options)
            return data.data.broadcast_id
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async startEstimation(labelId) {
        try {
            const options = (labelId) ? {
                custom_label_id: labelId
            } : {}

            const data = await axios.post(`https://graph.facebook.com/${this.api_version}/me/broadcast_reach_estimations?access_token=${this.access_token}`, options)
            return data.data.reach_estimation_id
        } catch (e) {
            logger.error(e)
            throw e
        }
    }

    async getEstimation(estimationId) {
        try {
            if (!estimationId) throw new Error(`You must pass estimation id to fetch estimation`)

            const data = await axios.get(`https://graph.facebook.com/${this.api_version}/${estimationId}?access_token=${this.access_token}`)
            return data.data
        } catch (e) {
            logger.error(e)
            throw e
        }
    }
}

module.exports = Broadcast
