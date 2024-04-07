<template>
  <div>
    <ul class="list">
      <li v-for="(auxiliary,index) in auxiliaryList" @click="voluationInput(auxiliary)">{{auxiliary}}</li>
    </ul>
  </div>
  </template>
   
  <script lang='jsx'>
  export default {
    methods: {
      voluationInput(val){
        this.$emit('closeAuxiliaryDialog', val);
      }
    },
    data() {
      return {
        auxiliaryList:['施耐德','西门子','驱易'],
      };
    }
  };
  </script>
   
  <style scoped>
    .list{list-style: none;padding: 0;margin: 0;border-top: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;}
    .list li{cursor: pointer;height: 40px;line-height: 40px;padding: 0 10px;}
    .list li:hover{background: #ecebeb;}
  </style>