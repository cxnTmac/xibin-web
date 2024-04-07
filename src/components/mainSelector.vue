<template>
    <div>
      <ul class="list">
        <li v-for="(main,index) in mainList" @click="voluationInput(main.name)">{{main.name}}</li>
      </ul>
    </div>
    </template>
     
    <script lang='jsx'>
    import {getMainList} from '@/api';
     
    export default {
      methods: {
        voluationInput(val){
          this.$emit('closeMainDialog', val);
        }
      },
      data() {
        return {
          mainList:[],
        };
      },
      created() {
        getMainList().then(response => {
          this.mainList = response.data.records;
        });
      },
    };
    </script>
     
    <style scoped>
      .list{list-style: none;padding: 0;margin: 0;border-top: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;}
      .list li{cursor: pointer;height: 40px;line-height: 40px;padding: 0 10px;}
      .list li:hover{background: #ecebeb;}
    </style>