<template>


</template>

<script>
    import Vue from 'vue'
    import { query } from '../api/popWinApi';
    var popConfig = require('../../static/popwin.json');
    Vue.component('popwin-button', {
        props: {
            // 基础类型检测 （`null` 意思是任何类型都可以）
            popKey: String,
			selectValue:String
        },
//        template:'<el-input v-model="getColumns" placeholder="请输入内容"></el-input>',
//		  template:'<el-table :data="data2">'+
//		  				'<el-table-column v-for="item in getColumns2" :prop="item.name" :label="item.title"></el-table-column>'+
//		            '</el-table>',
         template:'<div><el-popover ref="popBtn" placement="top-start" width="500" trigger="click">'+
//         				'<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">'+
         '<el-form :inline="true" :model="filters">'+
        	 '<el-form-item>'+
         		'<el-select v-model="filters.queryValue" size="small"  placeholder="查询条件">'+
            		'<el-option v-for="item in getConditions" :key="item.value" :label="item.title" :value="item.name">'+
            		'</el-option>'+
         		'</el-select>'+
        	 '</el-form-item>'+
         	'<el-form-item>'+
            	'<el-input  size="small" v-model="filters.condition" ></el-input>'+
            '</el-form-item>'+
            '<el-form-item>'+
            	'<el-button type="primary" size="small" v-on:click="getData">查询</el-button>'+
            '</el-form-item>'+
		 '</el-form>'+
//        				'</el-col>'+
		 '<el-table :data="data2" highlight-current-row v-loading="listLoading" @current-change="handleCurrentChange" stripe>'+
		 	'<el-table-column v-for="item in getColumns2" :prop="item.name" :label="item.title"></el-table-column>'+
		 '</el-table>'+
         '<el-col :span="24" class="toolbar">'+
         '<el-pagination layout="prev, pager, next" @current-change="handleCurrentPageChange" :page-size="size" :total="total" style="float:right;">'+
        '</el-pagination>'+
         '</el-col>'+
		 '</el-popover>'+
         '<el-row :gutter="0">'+
         '<el-col :span="18">'+
         '<el-input v-model="selectValue" width="600"></el-input></el-col>'+
         '<el-col :span="6">'+
		 '<el-button v-popover:popBtn type="primary" icon="search" v-on:click="getData"></el-button></el-col></el-row></div>',
//        template: '<button v-on:click="increment">{{ counter }}</button>',
        computed:{
			getColumns2 :function(){
                return popConfig[this.popKey].columns;
			},
			getConditions :function(){
			    var conditions = popConfig[this.popKey].conditions;
			    conditions.push({title:"全部",name:"allCondition"});
                this.filters.queryValue = "allCondition";
                return conditions;
			},
			getText:function(){
			    return this.selectValue;
			}
		},
        data: function () {
            return {
                filters:{condtion:"",queryValue:""},
				name:'',
//				data2:[{
//					roleCode:"A1",
//					roleName:"角色1"
//				},{
//                    roleCode:"A2",
//                    roleName:"角色2"
//				}]
				data2:[],
                page: 1,
                size:5,
				total:0,
                listLoading:false
            }
        },
        methods: {
            handleCurrentChange:function(currentRow,oldCurrentRow){
				this.selectValue = currentRow[popConfig[this.popKey].value];
                this.name = currentRow[popConfig[this.popKey].name];
                this.$emit('changeValue',[this.selectValue,this.name]);
			},
            handleCurrentPageChange(val) {
                this.page = val;
                this.getData();
            },
            getData:function(){
                this.listLoading = true;
                let para = {};
                let queryConditions = {};
                queryConditions[this.filters.queryValue] =this.filters.condition;
                para['page'] = this.page;
                para['size'] = this.size;
                para['queryConditions'] = JSON.stringify(queryConditions);
                para['queryType']= popConfig[this.popKey].query;
                query(para).then((res) => {
                    this.total = res.data.size;
                    this.data2 = res.data.list;
                    this.listLoading = false;
                });
            }
        }
    })



</script>

<style scoped>

</style>