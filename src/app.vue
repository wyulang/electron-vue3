<template>
  <header style="background-color:#000419;-webkit-app-region: drag;-webkit-user-select: none;" class="h-53 flex ai-c jc-b">
    <span></span>
    <div class="flex fc-fff pr15 ai-c">
      <span @click="btnConsloe()" class="iconfont nodarg hand fs-20 iconkongzhitai"></span>
      <span @click="btnBarSize('min')" class="iconfont nodarg hand ml30 fs-20 iconminimum"></span>
      <span @click="btnBarSize('max')" class="iconfont nodarg hand fs-20 ml15 icon3zuidahua-1"></span>
      <span @click="btnBarSize('close')" class="iconfont nodarg hand fs-22 ml15 icondelete"></span>
    </div>
  </header>
  <router-view></router-view>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
const { ipcRenderer } = window.require('electron');
export default class App extends Vue {
  message: string = "wyulang";
  isMax = false;
  isMin = false;
  btnBarSize(type) {
    let curr = "close";
    if (type == 'max') {
      if (this.isMax) {
        curr = "max:0"
      } else {
        curr = "max:1"
      }
      this.isMax = !this.isMax;
    }
    if (type == 'min') {
      if (this.isMin) {
        curr = "min:0"
      } else {
        curr = "min:1"
      }
      this.isMin = !this.isMin;
    }
    ipcRenderer.invoke('win-bar', curr);
  }

  btnConsloe(){
    ipcRenderer.invoke('open-dev', "");
  }
  created() {
    // 
  }
}
</script>

<style lang="less">
@import "~@css/pc.less";
.nodarg {
  -webkit-app-region: no-drag;
}
</style>