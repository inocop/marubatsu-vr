const Room = require('../entities/Room')


module.exports = class InputMaruBatsu {

  constructor(room, socketId, data) {
    if (!(room instanceof Room)) {
      throw new TypeError()
    }

    this.room = room
    this.socketId = socketId
    this.data = data
  }

  exec() {
    return new Promise((resolve, reject) => {
      if (!this._validateInput()) {
        return
      }

      if (this.room.setPlayData(this.socketId, this.data)) {
        resolve()
      }
    })
  }

  _validateInput() {
    // 2人いる状態でないと入力不可
    if (!(this.room.player1 && this.room.player2)){
      return false
    }

    // socketIdがplayer1 or player2と一致すること
    //if (![this.player1, this.player2].filter(p => p != null).includes(socketId))
    if (!(this.socketId === this.room.player1 || this.socketId === this.room.player2)) {
      return false
    }

    // 連続での入力不可
    if (this.room.lastInputPlayer === this.socketId) {
      return false
    }

    return true
  }
}