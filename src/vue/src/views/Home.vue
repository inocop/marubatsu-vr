<template>
  <div class="columns">
    <div class="column is-4 is-offset-4">

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Room</th>
            <th>状態</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(room) in roomList" :key="room.id">
            <td>{{ room.name }}</td>
            <td>{{ getRoomState(room) }}</td>
            <td v-if="room.playerCount < 2" >
              <router-link :to="{name: 'marubatsu_vr', params: { id: room.id }}">エントリー</router-link>
            </td>
            <td v-else></td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>


<script>
  export default {
    data: () => ({
      roomList: [],
    }),
    methods: {
      getRoomState(room) {
        if (room.playerCount === 0) {
          return "空き"
        }
        else if (room.playerCount === 1){
          return "対戦者待ち"
        }
        else {
          return "プレイ中"
        }
      }
    },
    mounted(){
      // レシーバー登録
      this.$socket.on(this.$SocketConst.SOCKET_CHANGE_ROOMS_NOTIFY, (notify, room) => {
        if (notify.type === this.$NotifyConst.NOTIFY_ERRORED) {
          this.invalid_name = notify.message
        }
        else if (notify.type === this.$NotifyConst.NOTIFY_UPDATED) {
          const updateIndex = this.roomList.findIndex((r) => r.id === room.id)
          this.$set(this.roomList, updateIndex, room)
        }
      })

      // Roomリストをリクエスト
      this.$socket.emit(this.$SocketConst.SOCKET_GET_ROOMS, (error, roomList) => {
        if (!error) this.roomList = roomList
      })
    },
}
</script>

<style scoped>
  table th,
  table td {
    text-align: center;
  }
</style>
