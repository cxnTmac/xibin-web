<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="科目编码" prop="courseNo">
						<popwin-button popKey="POP_COURSE" :showName="true" :selectValue="filters.courseNo" v-model="filters.courseNo" ></popwin-button>
					</el-form-item>
					<el-form-item label="开始期间" prop="courseNo">
						<popwin-button popKey="POP_PERIOD" :selectValue="filters.periodFrom" v-model="filters.periodFrom" ></popwin-button>
					</el-form-item>
					<el-form-item label="结束期间" prop="courseNo">
						<popwin-button popKey="POP_PERIOD" :selectValue="filters.periodTo" v-model="filters.periodTo" ></popwin-button>
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="query">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
				<el-row :gutter="0"  v-if="showMoreQueryCondition">
				</el-row>
				</transition>
			</el-form>
		</el-col>

		<el-tag>凭证汇总数：{{voucherTotal}}</el-tag>

		<!--列表-->
		<el-row>
		<el-table :data="records" border highlight-current-row v-loading="listLoading"  stripe style="width: 100%;">
			<el-table-column prop="courseNo" label="科目编码" width="200" >
			</el-table-column>
			<el-table-column prop="courseName" label="科目名称" width="200" >
			</el-table-column>
			<el-table-column prop="sumDebit" label="借" width="300"  >
			</el-table-column>
			<el-table-column prop="sumCredit" label="贷" min-width="300"  >
			</el-table-column>
		</el-table>
		</el-row>
		<!--工具条-->
		<el-col :span="24" class="toolbar">

		</el-col>



	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import {showVoucherDetailSum,showVoucherCount} from '../../api/accountBookApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
			    voucherTotal:0,
                showMoreQueryCondition:false,
				filters: {
					periodFrom: '',
                    periodTo: '',
					courseNo:''
				},
                records: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列

			}
		},
		methods: {
            query:function () {
				this.getRecords();
				this.getVoucherTotal();
            },
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
            getRecords() {
				let para = {
                    conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                showVoucherDetailSum(para).then((res) => {
					//this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			getVoucherTotal(){
                let para = {
                    conditions:JSON.stringify(this.filters)
                };
                this.listLoading = true;
                //NProgress.start();
                showVoucherCount(para).then((res) => {
                    //this.total = res.data.size;
                    this.voucherTotal = res.data;
                    //NProgress.done();
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
			}
		},
		mounted() {
            this.query();
		}
	}

</script>

<style scoped>

</style>