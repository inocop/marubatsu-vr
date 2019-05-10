const NotifyConst = require('../../consts/marubatus/NotifyConst')
const SocketConst = require('../../consts/marubatus/SocketConst')

const Notify   = require('../domain/marubatsu/entities/Notify')
const RoomList = require('../domain/marubatsu/entities/RoomList')

const EntryRoom      = require('../domain/marubatsu/usecases/EntryRoom')
const InputMaruBatsu = require('../domain/marubatsu/usecases/InputMaruBatsu')
const DisconnectRoom = require('../domain/marubatsu/usecases/DisconnectRoom')


module.exports = function(io) {

  const roomList = new RoomList

  var marubatsuSocket = io.of('/marubatsu_api/')
  marubatsuSocket.on('connection', (socket) => {
    console.log(`connected: ${ socket.id }`)

    // ルーム一覧取得
    socket.on(SocketConst.SOCKET_GET_ROOMS, (callback) => {
      console.log(SocketConst.SOCKET_GET_ROOMS);
      callback(null, roomList.getRoomList())
    })

    // マルバツルーム入室
    socket.on(SocketConst.SOCKET_ENTRY_GAME, (roomId, callback) => {
      console.log(SocketConst.SOCKET_ENTRY_GAME);

      let targetRoom = roomList.getRoom(roomId)
      if (!targetRoom) return

      new EntryRoom(targetRoom, socket.id).exec()
      .then(() => {
        socket.join(`playroom_${roomId}`);
        callback(null, targetRoom.getPlayData(), targetRoom.isPlayer1(socket.id))
        const notify = new Notify(NotifyConst.NOTIFY_UPDATED)
        marubatsuSocket.emit(SocketConst.SOCKET_CHANGE_ROOMS_NOTIFY, notify, targetRoom.params)

        // playerが揃った場合、ゲーム開始の通知を送信
        if (targetRoom.player1 && targetRoom.player2) {
          const startNotify = new Notify(NotifyConst.NOTIFY_CREATED)
          marubatsuSocket.in(`playroom_${targetRoom.id}`).emit(SocketConst.SOCKET_CHANGE_GAME_NOTIFY, startNotify)
        }
      })
      .catch((error) => {
        callback({ message: error.message })
      })
    })

    // マルバツ送信
    socket.on(SocketConst.SOCKET_INPUT_GAME, (roomId, data) => {
      console.log(SocketConst.SOCKET_INPUT_GAME)

      let targetRoom = roomList.getRoom(roomId)
      if (!targetRoom) return

      new InputMaruBatsu(targetRoom, socket.id, data).exec()
      .then(() => {
        if (targetRoom.isGameEnd) {
          // ゲーム終了
          const notify = new Notify(NotifyConst.NOTIFY_DELETED, targetRoom.playState.message)
          marubatsuSocket.in(`playroom_${roomId}`).emit(SocketConst.SOCKET_CHANGE_GAME_NOTIFY, notify, targetRoom.getPlayData())
          roomList.clearRoom(targetRoom.id)
        }
        else {
          // ゲーム進行
          const notify = new Notify(NotifyConst.NOTIFY_UPDATED)
          marubatsuSocket.in(`playroom_${roomId}`).emit(SocketConst.SOCKET_CHANGE_GAME_NOTIFY, notify, targetRoom.getPlayData())
        }
      })
    })

    // マルバツルーム退出
    socket.on(SocketConst.SOCKET_LEAVE_GAME, () => {
      console.log(SocketConst.SOCKET_LEAVE_GAME)

      let joinRooms = marubatsuSocket.adapter.sids[socket.id];
      for (let roomId in joinRooms) {
        if (roomId && roomId.startsWith('playroom_')) {
          socket.leave(roomId);
        }
      }

      new DisconnectRoom(socket, roomList, (roomId) => {
        const notify = new Notify(NotifyConst.NOTIFY_UPDATED)
        marubatsuSocket.emit(SocketConst.SOCKET_CHANGE_ROOMS_NOTIFY, notify, roomList.getRoom(roomId).params)
      }).exec()
    })

    // 切断時の処理
    socket.on("disconnect", () => {
      console.log(`disconnected: ${ socket.id }`)

      new DisconnectRoom(socket, roomList, (roomId) => {
        const notify = new Notify(NotifyConst.NOTIFY_UPDATED)
        marubatsuSocket.emit(SocketConst.SOCKET_CHANGE_ROOMS_NOTIFY, notify, roomList.getRoom(roomId).params)
      }).exec()
    })
  });
}