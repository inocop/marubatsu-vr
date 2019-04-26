<template>
  <a-scene>
    <a-assets>
      <img src="/images/tile.png" id="square">
      <img src="/images/maru.png" id="circle">
      <img src="/images/batsu.png" id="cross">
      <img crossorigin="anonymous" src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/city.jpg" id="city">
    </a-assets>

    <a-camera id="player1" wasd-controls-enabled="false"
      :camera="player1.camera"
      :look-controls="player1.lookControls"
      :position="player1.position"
      :rotation="player1.rotation">
      <a-cursor fuse=false fuse-timeout=1000></a-cursor>
      <a-box color="#998877"></a-box>
      <a-text position="1 1 0" rotation="0 180 0" scale="3 3 0" value="Player1" color="black"></a-text>
    </a-camera>

    <a-camera id="player2" wasd-controls-enabled="false"
      :visible="playStart"
      :camera="player2.camera"
      :look-controls="player2.lookControls"
      :position="player2.position"
      :rotation="player2.rotation">
      <a-cursor fuse=false fuse-timeout=1000></a-cursor>
      <a-cylinder color="#114499"></a-cylinder>
      <a-text position="1 1 0" rotation="0 180 0" scale="3 3 0" value="Player2" color="black"></a-text>
    </a-camera>

    <a-entity id="square" v-for="(row, index) in playdata" :key="index">
      <a-plane :id="`square_${index}x0)`" @click="postInput(index, 0, $event)" :src="getResoure(row[0])" :position="`${index - 1} 0 -1`" rotation="-90 0 0" width="1" height="1" color="#EEEEEE"></a-plane>
      <a-plane :id="`square_${index}x1)`" @click="postInput(index, 1, $event)" :src="getResoure(row[1])" :position="`${index - 1} 0  0`" rotation="-90 0 0" width="1" height="1" color="#EEEEEE"></a-plane>
      <a-plane :id="`square_${index}x2)`" @click="postInput(index, 2, $event)" :src="getResoure(row[2])" :position="`${index - 1} 0  1`" rotation="-90 0 0" width="1" height="1" color="#EEEEEE"></a-plane>
    </a-entity>

    <a-sky color="#ECECEC" src="#city"></a-sky>
  </a-scene>
</template>

<script>
  import 'aframe';

  export default {
    props: {
      id: Number
    },
    data: () => ({
      playStart: "false",
      playdata: [],
      player1: { camera: { active: false },
                 lookControls: { enabled: false, reverseMouseDrag: true },
                 position: { x: 0,   y: 1.5, z: -4 },
                 rotation: { x: -20, y: 180, z: 0 },
               },
      player2: { camera: { active: false },
                 lookControls: { enabled: false, reverseMouseDrag: true },
                 rotation: { x: -20, y: 0,   z: 0 },
                 position: { x: 0,   y: 1.5, z: 4 },
                 rotation: { x: -20, y: 0,   z: 0 },
               },
    }),
    methods: {
      getResoure(src){
        if (src === "maru") {
          return "#circle"
        }
        else if (src === "batsu") {
          return "#cross"
        }
        else {
          return "#square"
        }
      },
      postInput(y, x, event) {
        if (!event.target.innerText) {
          this.$socket.emit(this.$GameConst.SOCKET_INPUT_GAME, this.id, {y: y, x: x});
        }
      }
    },
     beforeRouteLeave (to, from, next) {
       this.$socket.off(this.$GameConst.SOCKET_CHANGE_GAME_NOTIFY)
       this.$socket.emit(this.$GameConst.SOCKET_LEAVE_GAME);
       next();
    },
    mounted(){
      // レシーバー登録
      this.$socket.on(this.$GameConst.SOCKET_CHANGE_GAME_NOTIFY, (notify, playdata) => {
        // ゲーム開始
        if (notify.type === this.$NotifyConst.NOTIFY_CREATED) {
          this.playStart = "true"
        }
        // ゲーム進行
        else if (notify.type === this.$NotifyConst.NOTIFY_UPDATED) {
          this.playdata = JSON.parse(playdata)
        }
        // ゲーム終了
        else if (notify.type === this.$NotifyConst.NOTIFY_DELETED) {
          this.playdata = JSON.parse(playdata)
          setTimeout(() => {
            alert(notify.message);
            this.$router.push({ path: '/' });
          }, 300)
        }
      })

      // Gameエントリー
      this.$socket.emit(this.$GameConst.SOCKET_ENTRY_GAME, this.id, (error, playdata, isPlayer1) => {
        if (!error) {
          this.playdata = JSON.parse(playdata)

          const targetPlayer = isPlayer1 ? this.player1 : this.player2
          this.$set(targetPlayer, "camera", { active: true })
          this.$set(targetPlayer, "lookControls", { enabled: true })
          if (!isPlayer1) {
            this.playStart = "true"
          }
        }
        else {
          alert(error.message);
          this.$router.push({ path: '/' });
        }
      })
    }
  }
</script>