class Generic {
    constructor(title, subtitle, image_url, buttons, default_action) {
        if (typeof(title) === 'object') {
            let o = title
            this.title = o.title
            if (o.subtitle) this.subtitle = o.subtitle
            if (o.image_url) this.image_url = o.image_url
            if (o.buttons) this.buttons = o.buttons
            if (o.default_action) this.default_action = o.default_action
        } else {
            this.title = title
            if (subtitle) this.subtitle = subtitle
            if (image_url) this.image_url = image_url
            if (buttons) this.buttons = buttons
            if (default_action) this.default_action = default_action
        }
    }
}

module.exports = Generic
