// const Relay = require('react-relay')

class User {}
// class Quote {}
// const quote = new Quote()

// Mock authenticated ID
// const VIEWER_ID = 'me'
const viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

// Mock user data
// const viewer = new User()
// viewer.id = VIEWER_ID

// const usersById = {
//     [VIEWER_ID]: viewer,
// }

// function getUser(id) {
//     return usersById[id]
// }

// function getViewer() {
//     return getUser(VIEWER_ID)
// }

module.exports = {
    User,
    // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
}
