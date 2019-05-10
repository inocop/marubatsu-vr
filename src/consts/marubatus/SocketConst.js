/**
 * socket.io定数
 */
module.exports = class SocketConst {
  /**
   * Client -> Server用
   */

  /** ルーム一覧取得 */
  static get SOCKET_GET_ROOMS() {
    return "SOCKET_GET_ROOMS"
  }
  /** マルバツゲーム入室 */
  static get SOCKET_ENTRY_GAME() {
    return "SOCKET_ENTRY_GAME"
  }
  /** マルバツの入力送信 */
  static get SOCKET_INPUT_GAME() {
    return "SOCKET_INPUT_GAME"
  }
  /** マルバツ退出 */
  static get SOCKET_LEAVE_GAME() {
    return "SOCKET_LEAVE_GAME"
  }


  /**
   * Server -> Client用
   */

  /** ルーム一覧変更通知 */
  static get SOCKET_CHANGE_ROOMS_NOTIFY() {
    return "SOCKET_CHANGE_ROOMS_NOTIFY"
  }
  /** マルバツの状態変更通知 */
  static get SOCKET_CHANGE_GAME_NOTIFY() {
    return "SOCKET_CHANGE_GAME_NOTIFY"
  }
}
