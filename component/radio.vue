<template>
  <!-- <div :class="class" class="flex-line"> -->
    <div :class="class" @click="handSelect(item)" v-for="(item, index) in path" :key="index" :style="{'cursor':item.disabled?'not-allowed':''}" class="flex-line hand ai-c mr10">
      <svg t="1610071219114" class="icon" :style="{'fill':color[setColor(item)]}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13328" width="20" height="20">
        <path v-if="!setColor(item)"
          d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m0-85.333334a341.333333 341.333333 0 1 0 0-682.666666 341.333333 341.333333 0 0 0 0 682.666666z m0-128a213.333333 213.333333 0 1 1 0-426.666666 213.333333 213.333333 0 0 1 0 426.666666z">
        </path>
        <path v-else d="M512 938.666667a426.666667 426.666667 0 1 1 426.666667-426.666667 426.666667 426.666667 0 0 1-426.666667 426.666667z m0-768a341.333333 341.333333 0 1 0 341.333333 341.333333 341.333333 341.333333 0 0 0-341.333333-341.333333z" p-id="13458"></path>
      </svg>
      <div v-if="item.label" :style="{'color':color[setColor(item)]}" class="ml5">
        <slot :item="{...item,index}">{{item.label}}</slot>
      </div>
    </div>
  <!-- </div> -->
  <!-- -->
</template>

<script lang='ts'>
import { Vue, Prop, Model, Emit } from 'vue-property-decorator';
import { isString, isArray, isObject } from '@lib/lang';
export default class App extends Vue {
  @Prop({ type: Array, default: [] }) data;
  @Prop({ type: [Array, String], default: ['#3699ff', '#888'] }) color;
  @Prop({ type: [Array, String], default: "" }) class;
  @Prop({ type: [Array, String], default: [] }) icon;
  @Prop({ type: Boolean, default: false }) disabled;
  @Model('modelValue', { type: [String, Number, Boolean], default: "" }) value;
  // 取值 props="name,id" 对应的是 label,value
  @Prop({ type: [String, Object, Array], default: "" }) props;
  //禁用列表 禁用哪些值如:[1,2]
  @Prop({ type: Array }) exclude;

  @Emit('change')
  handSelect(item) {
    if (item.disabled) return;
    if(this.disabled) return;
    if (this.data.length) {
      this.$emit('update:modelValue', item.value);
      return item.value
    } else {
      this.$emit('update:modelValue', true);
    }
  }

  get path() {
    let list = [];
    if (this.data.length) {
      list = this.data.map(v => {
        let opt = {};
        if (typeof v == "string") {
          let disabled = this.exclude && this.exclude.map(v => String(v)).includes(String(v)) || false;
          opt = { label: v, value: v, disabled };
        } else {
          let disabled = this.exclude && this.exclude.map(v => String(v)).includes(String(v)) || false;
          opt = { ...v, label: v[this.parm.label], value: v[this.parm.value], disabled }
        }
        return opt
      })
    } else {
      list = [{ label: '', value: this.value }]
    }
    return list;
  }

  private setColor(item) {
    let v = String(this.value);
    let inv = String(item.value);
    if (this.data.length) {
      if (v == inv) {
        return 0
      } else {
        return 1;
      }
    } else {
      if (this.value) {
        return 0;
      } else {
        return 1;
      }
    }

  }

  get parm() {
    let label = "label";
    let value = "value";
    if (this.props) {
      if (isString(this.props)) {
        let obj = this.props.split(',');
        if (obj[0]) {
          label = obj[0];
        }
        if (obj[1]) {
          value = obj[1]
        }
      } else if (isArray(this.props)) {
        if (this.props[0]) {
          label = this.props[0];
        }
        if (this.props[1]) {
          value = this.props[1]
        }
      } else if (isObject(this.props)) {
        label = this.props.label;
        value = this.props.value;
      }
    }
    return { label, value }
  }
}
</script>

<style lang='less'>
</style>