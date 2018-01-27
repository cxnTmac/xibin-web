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
					<el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
				<el-row :gutter="0"  v-if="showMoreQueryCondition">
				</el-row>
				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="records" border show-summary  :summary-method="getSummaries" highlight-current-row v-loading="listLoading"  stripe style="width: 100%;">
			<el-table-column prop="courseNo" label="科目编码" width="200" >
			</el-table-column>
			<el-table-column prop="courseName" label="科目名称" width="200" >
			</el-table-column>
			<el-table-column label="期初余额">
				<el-table-column prop="startBalance" label="借" width="200" :formatter="formatStartBalanceDebit">
				</el-table-column>
				<el-table-column prop="startBalance" label="贷" width="200"  :formatter="formatStartBalanceCredit">
				</el-table-column>
			</el-table-column>
			<el-table-column label="本期发生额">
				<el-table-column prop="sumDebit" label="借" width="200"  >
				</el-table-column>
				<el-table-column prop="sumCredit" label="贷" width="200"  >
				</el-table-column>
			</el-table-column>
			<el-table-column label="期末余额">
				<el-table-column prop="endBalance" label="借" width="200"  :formatter="formatEndBalanceDebit">
				</el-table-column>
				<el-table-column prop="endBalance" label="贷" width="200"   :formatter="formatEndBalanceCredit">
				</el-table-column>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">

		</el-col>



	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import {showAccountBalance} from '../../api/accountBookApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
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
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if(index === 1 ){
                        sums[index] = '';
                        return
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = 'N/A';
                    }
                });
//                this.detailGrid.sumForDebit = sums[5];
//                this.detailGrid.sumForCredit = sums[6];
                return sums;
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
                showAccountBalance(para).then((res) => {
					//this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            formatStartBalanceDebit: function (row, column) {
                if(row.toGo === '借'){
                    return row.startBalance;
                }else if(row.toGo === '贷'){
                    return null;
                }
            },
            formatStartBalanceCredit: function (row, column) {
                if(row.toGo === '借'){
                    return null;
                }else if(row.toGo === '贷'){
                    return row.startBalance;
                }
            },
            formatEndBalanceDebit: function (row, column) {
                if(row.toGo === '借'){
                    return row.endBalance;
                }else if(row.toGo === '贷'){
                    return null;
                }
            },
            formatEndBalanceCredit: function (row, column) {
                if(row.toGo === '借'){
                    return null;
                }else if(row.toGo === '贷'){
                    return row.endBalance;
                }
            },
		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>