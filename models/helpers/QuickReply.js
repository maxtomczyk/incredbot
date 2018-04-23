class QuickReply {
    constructor(type, title, payload, image_url) {
        this.content_type = type
        if(type === 'text'){
            this.title = title
            this.payload = payload
            if(image_url) this.image_url = image_url
        }
    }
}

module.exports = QuickReply
