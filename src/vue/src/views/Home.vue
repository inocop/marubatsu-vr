<template>
  <div class="columns">
    <div class="column is-4 is-offset-4">

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Room</th>
            <th>Status</th>
            <th>Entry</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(room) in gameRooms" :key="room.id">
            <td>{{ room.name }}</td>
            <td>{{ getRoomState(room) }}</td>
            <td v-if="room.playerCount < 2" >
              <router-link :to="{name: 'marubatsu_vr', params: { id: room.id }}">VR</router-link> | 
              <router-link :to="{name: 'marubatsu_2d', params: { id: room.id }}">2D</router-link>
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
      gameRooms: [],
    }),
    methods: {
      getRoomState(room) {
        if (room.playerCount === 0) {
          return "empty"
        }
        else if (room.playerCount === 1){
          return "waiting"
        }
        else {
          return "playing"
        }
      }
    },
    mounted(){
      // レシーバー登録
      this.$socket.on(this.$GameConst.SOCKET_CHANGE_ROOMS_NOTIFY, (notify, room) => {
        if (notify.type === this.$NotifyConst.NOTIFY_ERRORED) {
          this.invalid_name = notify.message
        }
        else if (notify.type === this.$NotifyConst.NOTIFY_UPDATED) {
          const updateIndex = this.gameRooms.findIndex((r) => r.id === room.id)
          this.$set(this.gameRooms, updateIndex, room)
        }
      })

      // Roomリストをリクエスト
      this.$socket.emit(this.$GameConst.SOCKET_GET_ROOMS, (error, gameRooms) => {
        if (!error) this.gameRooms = gameRooms
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
