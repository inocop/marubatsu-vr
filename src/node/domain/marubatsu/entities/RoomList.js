const Room = require('./Room');


module.exports = class RoomList {

  constructor() {
    this.rooms = [];
    for (var id=1; id<=5; id++) {
      this.rooms[id] = new Room(id, `No.${id}`)
    }
  }

  count() {
    return Object.keys(this.rooms).length
  }

  getRoom(roomId) {
    return this.rooms[roomId]
  }

  getRoomList() {
    return Object.keys(this.rooms).map(id => this.rooms[id].params)
  }

  clearRoom(roomId) {
    this.rooms[roomId] = new Room(roomId, `No.${roomId}`)
  }
}