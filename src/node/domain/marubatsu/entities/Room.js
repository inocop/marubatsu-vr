const RoomConst = require('../../../../consts/marubatus/RoomConst');
const PlayState = require('./PlayState');


module.exports = class Room {

  constructor (id, name) {
    this.id         = id
    this.name       = name
    this.player1    = null
    this.player2    = null
    this.maruPlayer = null
    this.playState  = new PlayState()
    this.lastInputPlayer = null
  }

  get params(){
    return { id: this.id,
             name: this.name,
             playerCount: [this.player1, this.player2].filter(p => p != null).length
           }
  }

  get isGameEnd(){
    return RoomConst.STATE_END(this.playState.state)
  }

  isPlayer1(socketId) {
    return (this.player1 === socketId)
  }

  setPlayer(socketId) {
    if (!this.player1) {
      this.player1 = socketId
    }
    else if (this.player1 !== socketId) {
      this.player2 = socketId
    }
  }

  getPlayData(){
    return JSON.stringify(this.playState.inputMap)
  }

  setPlayData(socketId, data) {
    // 初回入力したプレイヤーを〇とする
    if (this.playState.state === RoomConst.STATE_STANDBY) {
      this.playState.start()

      if (socketId === this.player1) {
        this.maruPlayer = this.player1
      }
      else {
        this.maruPlayer = this.player2
      }
    }

    let value = (socketId === this.maruPlayer) ? "maru" : "batsu"
    if (this.playState.addInput({y: data.y, x: data.x, value: value})) {
      this.lastInputPlayer = socketId
      return true
    }

    return false
  }
}