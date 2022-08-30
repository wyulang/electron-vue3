<template>
  <div>
    <div @click="btnWifi" class="btn btn-small btn-primary">wifi</div>
  </div>
</template>

<script lang='ts'>
import { Vue } from 'vue-property-decorator';
const { ipcRenderer } = window.require('electron');
export default class App extends Vue {
  btnWifi() {
    
  }
  created() {
    
  }
}
</script>

<style lang='less'>
</style>