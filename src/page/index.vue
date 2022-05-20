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
    ipcRenderer.invoke('get-wifi-name').then(res => {
      // res = res.replace(/�/g, 'a').replace(/\s/g, '').replace(/BSSID:.+/g, '').replace(/.+SSID:/g, '');
      console.log(res)
    })
  }
  created() {
    // ipcRenderer.invoke('get-wifi-name').then(res => {
    //   res = res.replace(/�/g, 'a').replace(/\s/g, '').replace(/BSSID:.+/g, '').replace(/.+SSID:/g, '');
    // })
  }
}
</script>

<style lang='less'>
</style>