const sanitizeHtml = require('sanitize-html');

const sanitizeMessage = (msg) => {
    if (typeof msg !== "string" || msg.trim()) return "";
    const clean = sanitizeHtml(msg, {
        allowedTags: [],
        allowedAttributes: {},
    });
    return clean.slice(0, 1000);
};

module.exports = {sanitizeMessage};