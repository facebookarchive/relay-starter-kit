// const Relay = require('react-relay')

class User {}
// class Quote {}
// const quote = new Quote()

// Mock authenticated ID
const VIEWER_ID = 'me'

// Mock user data
const viewer = new User()
viewer.id = VIEWER_ID

const usersById = {
    [VIEWER_ID]: viewer,
}

function getUser(id) {
    return usersById[id]
}

function getViewer() {
    return getUser(VIEWER_ID)
}

module.exports = {
    User,
    getUser,
    getViewer,
}
