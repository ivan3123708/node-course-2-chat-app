class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = {
      id: id,
      name: name,
      room: room
    };
    this.users.push(user);
    return user;
  }
  
  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  removeUser(id) {
    const removedUser = this.getUser(id);

    if (removedUser) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return removedUser;
  }

  getUsersList(room) {
    return this.users
      .filter((user) => user.room === room)
      .map((user) => user.name);
  }
};

module.exports = { Users };