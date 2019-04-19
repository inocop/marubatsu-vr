const NotifyConst = require('../../common/consts/NotifyConst')
const Notify = require('../entities/Notify')
const GameConst = require('../../common/consts/GameConst')
const GameRooms = require('../entities/marubatsu/GameRooms')
const EntryRoom = require('../usecases/marubatsu/EntryRoom')
const InputMaruBatsu = require('../usecases/marubatsu/InputMaruBatsu')

module.exports = function(io) {

  const gameRooms = new GameRooms

  var marubatsuSocket = io.of('/marubatsu_api/')
  marubatsuSocket.on('connection', (socket) => {
    console.log(`a user connected[id:${ socket.id }]`)

    // ルーム一覧取得
    socket.on(GameConst.SOCKET_GET_ROOMS, (callback) => {
      console.log(GameConst.SOCKET_GET_ROOMS);
      callback(null, gameRooms.getRoomList())
    })

    // マルバツルーム入室
    socket.on(GameConst.SOCKET_ENTRY_GAME, (roomId, callback) => {
      console.log(GameConst.SOCKET_ENTRY_GAME);

      let targetRoom = gameRooms.getRoom(roomId)
      if (!targetRoom) return

      new EntryRoom(targetRoom, socket.id).exec()
      .then(() => {
        socket.join(`playroom_${roomId}`);
        callback(null, targetRoom.getPlayData())
        const notify = new Notify(NotifyConst.NOTIFY_UPDATED)
        marubatsuSocket.emit(GameConst.SOCKET_CHANGE_ROOMS_NOTIFY, notify, targetRoom.params)
      })
      .catch((error) => {
        callback({ message: error.message })
      })
    })

    // マルバツ送信
    socket.on(GameConst.SOCKET_INPUT_GAME, (roomId, data) => {
      console.log(GameConst.SOCKET_INPUT_GAME)

      let targetRoom = gameRooms.getRoom(roomId)
      if (!targetRoom) return

      new InputMaruBatsu(targetRoom, socket.id, data).exec()
      .then(() => {
        if (targetRoom.isGameEnd) {
          // ゲーム終了通知
          const notify = new Notify(NotifyConst.NOTIFY_UPDATED, targetRoom.gameState.message)
          marubatsuSocket.in(`playroom_${roomId}`).emit(GameConst.SOCKET_CHANGE_GAME_NOTIFY, notify, targetRoom.getPlayData())

          // Room一覧から削除
          gameRooms.clearRoom(targetRoom.id)
        }
        else {
          // ゲーム終了継続
          const notify = new Notify(NotifyConst.NOTIFY_CREATED)
          marubatsuSocket.in(`playroom_${roomId}`).emit(GameConst.SOCKET_CHANGE_GAME_NOTIFY, notify, targetRoom.getPlayData())
        }
      })
    })

    // マルバツルーム退出
    socket.on(GameConst.SOCKET_LEAVE_GAME, () => {
      console.log(GameConst.SOCKET_LEAVE_GAME)

      let joinRooms = marubatsuSocket.adapter.sids[socket.id];
      for (let roomId in joinRooms) {
        if (roomId && roomId.startsWith('playroom_')) {
          socket.leave(roomId);
        }
      }
    })

  });
}