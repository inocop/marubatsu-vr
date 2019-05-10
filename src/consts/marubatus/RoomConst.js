/**
 *  Room状態定数
 */
module.exports = class RoomConst {

  static get STATE_STANDBY() {
    return "STATE_STANDBY"
  }
  static get STATE_PLAYING() {
    return "STATE_PLAYING"
  }
  static get STATE_WIN_MARU() {
    return "STATE_WIN_MARU"
  }
  static get STATE_WIN_BATSU() {
    return "STATE_WIN_BATSU"
  }
  static get STATE_DRAW() {
    return "STATE_DRAW"
  }

  static STATE_END(state) {
    return (state === this.STATE_WIN_MARU || state === this.STATE_WIN_BATSU || state === this.STATE_DRAW)
  }
}