const Room = require('../entities/Room');

module.exports = class EntryRoom {

  constructor(room, socketId) {
    if (!(room instanceof Room)) {
      throw new TypeError()
    }

    this.room = room
    this.socketId = socketId
  }

  exec() {
    return new Promise((resolve, reject) => {
      if (this.room.player1 && this.room.player2) {
        reject(new Error("入室できません。"))
        return
      }

      this.room.setPlayer(this.socketId)
      resolve()
    })
  }
}