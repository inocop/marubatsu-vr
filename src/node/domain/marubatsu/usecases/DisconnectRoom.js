module.exports = class DisconnectRoom {

  constructor(socket, roomList, callback) {
    this.socket = socket
    this.roomList = roomList
    this.callback = callback
  }

  /**
   * 切断したプレイヤーがいる部屋を初期化
   */
  exec() {
    console.log("DisconnectRoom#exec")

    for (var id=1; id < (this.roomList.count() + 1); id++){
      const room = this.roomList.getRoom(id)
      console.log(`socket.id: ${this.socket.id}, player1: ${room.player1}, player2: ${room.player2}`)
      if (this.socket.id === room.player1 || this.socket.id === room.player2) {
        this.roomList.clearRoom(id)
        this.callback(id)
      }
    }

    return true
  }
}