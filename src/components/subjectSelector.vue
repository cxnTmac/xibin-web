<template>
  <div>
    <ul class="list">
      <li v-for="(subject,index) in subjectList" @click="voluationInput(subject)">{{subject.name}}</li>
    </ul>
  </div>
</template>
 
<script lang='jsx'>
  import {getSubjectList} from '@/api';
 
  export default {
    methods: {
      voluationInput(val) {
        this.$emit('closeSubjectDialog', val);
      }
    },
    data() {
      return {
        subjectList: [],
      };
    },
    created() {
      getSubjectList().then(response => {
        this.subjectList = response.data.records;
      });
    },
 
  };
</script>
 
<style scoped>
  .list {
    list-style: none;
    padding: 5px 0;
    margin: 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }
 
  .list li {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
  }
 
  .list li:hover {
    background: #ecebeb;
  }
</style>