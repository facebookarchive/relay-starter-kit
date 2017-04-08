
class User { }

const viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

module.exports = {
  User,
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
}
