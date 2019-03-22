<template>


</template>

<script>
    import Vue from 'vue'
    import { query } from '../api/popWinApi';
    var popConfig = require('../../static/popwin.json');
    Vue.component('popwin-button', {
        model: {    // 使用model， 这儿2个属性，prop属性说，我要将selectValue作为该组件被使用时（此处为aa组件被父组件调用）v-model能取到的值，event说，我emit ‘eventFor’ 的时候，参数的值就是父组件v-model收到的值。
            prop: 'selectValue',
            event: 'eventFor'
        },
        props: {
            // 基础类型检测 （`null` 意思是任何类型都可以）
            popKey: String,
			selectValue:String,
            disabled:Boolean,
            staticCondition:{},
            showName:{
                type: Boolean,
                default: false
            },
            displayName:{
                type:String,
                default:''
            }
        },
        template:'<div><el-popover ref="popBtn" placement="top-start" width="510" trigger="click">'+
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
		 '<el-table :data="data2" border highlight-current-row v-loading="listLoading" @current-change="handleCurrentChange" stripe>'+
		 	'<el-table-column v-for="item in getColumns2" :width="columnWidth" :prop="item.name" :label="item.title" :key="item.name"></el-table-column>'+
		 '</el-table>'+
         '<el-col :span="24" class="toolbar">'+
         '<el-pagination layout="prev, pager, next" @current-change="handleCurrentPageChange" :page-size="size" :total="total" style="float:right;">'+
        '</el-pagination>'+
         '</el-col>'+
		 '</el-popover>'+
         '<el-row :gutter="0">'+
         '<el-col :span="18">'+
         '<el-autocomplete v-if="!showName" popper-class="my-autocomplete" :disabled="disabled" v-model="inputValue" :fetch-suggestions="querySearch"  style="width:100%" placeholder="请输入内容" @select="handleSelect" :trigger-on-focus=false>'+
         '<i class="el-icon-circle-close el-input__icon" slot="suffix" @click="handleIconClick">'+
         '</i>'+
         '<template slot-scope="props">'+
         '<div class="name">{{ props.item.value }}</div>'+
         '<span class="addr" style="color: #ff4d51">{{ props.item.address }}</span>'+
         '<div class="name" style="display: none">{{ props.item.row }}</div>'+
         '</template>'+
         '</el-autocomplete>' +
         '<el-autocomplete v-if="showName" popper-class="my-autocomplete" :disabled="disabled" v-model="name" :fetch-suggestions="querySearch" style="width:100%"  placeholder="请输入内容" @select="handleSelect" :trigger-on-focus=false>'+
            '<i class="el-icon-circle-close el-input__icon" slot="suffix" @click="handleIconClick">'+
            '</i>'+
            '<template slot-scope="props">'+
            '<div class="name">{{ props.item.value }}</div>'+
            '<span class="addr" style="color: #ff4d51">{{ props.item.address }}</span>'+
            '<div class="name" style="display: none">{{ props.item.row }}</div>'+
            '</template>'+
            '</el-autocomplete></el-col>'+
         '<el-col :span="6">'+
		 '<el-button v-popover:popBtn type="primary" :disabled="disabled" class="el-icon-search" v-on:click="getData"></el-button></el-col></el-row></div>',
//        template: '<button v-on:click="increment">{{ counter }}</button>',
        computed:{
			getColumns2 :function(){
                return popConfig[this.popKey].columns;
			},
			getConditions :function(){
			    var conditions = popConfig[this.popKey].conditions;
			    let haveFuzzyCondtion = false;
			    for(let i =0;i<conditions.length;i++){
			        if(conditions[i].name === 'fuzzyCondition'){
                        haveFuzzyCondtion = true;
			            break;
                    }
                }
                if(!haveFuzzyCondtion) {
                    conditions.push({title: "全部", name: "fuzzyCondition"});
                }
                this.filters.queryValue = "fuzzyCondition";
                return conditions;
			},
			getText:function(){
			    return this.inputValue;
			},
            columnWidth:function(){
			   if(this.getColumns2.length>=4){
			       return 120;
               }else{
			       return 510/this.getColumns2.length;
               }
            }
		},
        data: function () {
            return {
                inputValue:'',
                name:'',
                restaurants: [],
                filters:{condtion:"",queryValue:""},
				data2:[],
                page: 1,
                size:5,
				total:0,
                listLoading:false
            }
        },
        watch: {
            selectValue: function (val) {
                this.inputValue = val
            },
            displayName:function(val){
                this.name = val
            }
        },
        mounted(){
            this.inputValue = this.selectValue
            this.name = this.displayName
        },
        methods: {
            handleCurrentChange:function(currentRow,oldCurrentRow){
                if(currentRow!==null){
                    this.inputValue = currentRow[popConfig[this.popKey].value];
                    this.name = currentRow[popConfig[this.popKey].name];
                    this.$emit('changeValue',currentRow);
                    this.$emit('eventFor',this.inputValue);
                }
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
                queryConditions = Object.assign(queryConditions, this.staticCondition);
                para['page'] = this.page;
                para['size'] = this.size;
                para['queryConditions'] = JSON.stringify(queryConditions);
                para['queryType']= popConfig[this.popKey].query;
                para['sys']= popConfig[this.popKey].sys;
                query(para).then((res) => {
                    this.total = res.data.size;
                    this.data2 = res.data.list;
                    this.listLoading = false;
                });
            },
            converte(data){
                let result = [];
                let key1 = popConfig[this.popKey].columns[0].name
                let key2 = popConfig[this.popKey].columns[1].name
                for(let i = 0;i<data.length;i++){
                    result.push({value: data[i][key1],address: data[i][key2],row:data[i]})
                }
                return result;
            },

            querySearch(queryString, cb) {
                if(queryString.length<3 ){
                    return
                }
                var restaurants = this.restaurants;
                var results = {};
                let para = {};
                para['page'] = 1;
                para['size'] = 10;
                let queryConditions = {};
                queryConditions[popConfig[this.popKey].quickCondition] = queryString;
                para['queryType']= popConfig[this.popKey].query;
                para['sys']= popConfig[this.popKey].sys;
                para['queryConditions'] = JSON.stringify(queryConditions);
                query(para).then((res) => {
                    results = this.converte(res.data.list);
                    cb(results);
                });
            },
            handleSelect(item) {
                this.inputValue = item.value;
                this.name = item.address;
                this.$emit('eventFor',item.value);
                this.$emit('changeValue',item.row);
            },
            handleIconClick(ev) {
                if(!this.disabled){
                    this.inputValue = '';
                    this.name = '';
                    this.$emit('eventFor','');
                    this.$emit('changeValue',null);
                }
            }
        }
    })



</script>

