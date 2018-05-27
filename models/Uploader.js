const axios = require('axios')

class Uploader {
    constructor(config) {
        config = config || {}
        this.access_token = config.access_token
        this.api_version = config.api_version
        this.api_url = `https://graph.facebook.com/${this.api_version}/me/message_attachments?access_token=${this.access_token}`
    }

    async fromUrl(type, url) {
        let o = {
            message: {
                attachment: {
                    type: type,
                    payload: {
                        is_reusable: true,
                        url: url
                    }
                }
            }
        }

        return new Promise((resolve, reject) => {
            axios.post(this.api_url, o)
                .then(res => {
                    resolve(res.data.attachment_id)
                })
                .catch(e => {
                    reject(e)
                })

        })
    }
}

module.exports = Uploader
