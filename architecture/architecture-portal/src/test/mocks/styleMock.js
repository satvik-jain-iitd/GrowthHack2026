module.exports = new Proxy(
    {},
    {
        get: function (target, prop) {
            if (prop === '__esModule') {
                return false
            }
            return prop
        }
    }
)
