const Game = require('./Game');

module.exports = class GameRooms {

  constructor() {
    this.gameRooms = [];
    for (var id=1; id<=5; id++) {
      this.gameRooms[id] = new Game(id, `No.${id}`)
    }
  }

  count() {
    return Object.keys(this.gameRooms).length
  }

  getRoom(roomId) {
    return this.gameRooms[roomId]
  }

  getRoomList() {
    return Object.keys(this.gameRooms).map(id => this.gameRooms[id].params)
  }

  clearRoom(roomId) {
    this.gameRooms[roomId] = new Game(roomId, `No.${roomId}`)
  }
}