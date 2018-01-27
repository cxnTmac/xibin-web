<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="日期" prop="areaName">
						<el-input v-model="filters.type" ></el-input>
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
		<el-table :data="records" border :span-method="objectSpanMethod" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="80">
			</el-table-column>
			<el-table-column prop="voucherNum" label="凭证号" width="120" >
			</el-table-column>
			<el-table-column prop="voucherWord" label="凭证字" width="120" >
			</el-table-column>
			<el-table-column prop="status" label="状态" width="120" :formatter="formatStatus">
				<template scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag :type="getStatusTagType(scope.row)">{{formatStatus(scope.row) }}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="period" label="期间" width="120"  >
			</el-table-column>
			<el-table-column prop="debit" label="借" width="120" >
			</el-table-column>
			<el-table-column prop="credit" label="贷" width="120" >
			</el-table-column>
			<el-table-column prop="courseName" label="科目名称" width="120" >
			</el-table-column>
			<el-table-column prop="billDate" label="时间" width="200"  :formatter="formatCompleteDate">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="400" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>



	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getVoucherListPage, saveVoucher, removeVoucher} from '../../api/voucherApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
				filters: {
					type: ''
				},
                records: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列,
				voucherGroup:[]
			}
		},
		methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 1||columnIndex === 0||columnIndex === 2||columnIndex === 10||columnIndex === 3||columnIndex === 4) {
                    let i = this.arrayContains(this.voucherGroup,rowIndex);
                    if(i>=0&&i<this.voucherGroup.length-1){
                        return {
                            rowspan: this.voucherGroup[i+1]-this.voucherGroup[i],
                            colspan: 1
                        };
                    }else if(i === this.voucherGroup.length-1){
                        return {
                            rowspan: this.records.length-this.voucherGroup[i],
                            colspan: 1
                        };
                    }else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            formatStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.FI_VOUCHER_STATUS,row.status);
            },
            getStatusTagType:function(row){
                if(row.status === '10'){
                    return 'success'
                }else if(row.status === '20'){
					return 'info'
				}
            },
            formatCompleteDate:function (row, column){
                if(row.completeDate!==null){
                    let unixTimestamp = new Date(row.completeDate)
                    return util.formatDate.format(unixTimestamp,'yyyy-MM-dd hh:mm:ss');
                }
			},
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getRecords();
			},
            //显示编辑界面
            handleEdit: function (index, row) {
                this.$store.commit('changeVoucherId', row.voucherId)
                this.$store.commit('changeVoucherStatus', 'EDIT')
                this.$router.push({ path: '/voucherDetail' })
            },
            //显示新增界面
            handleAdd: function () {
                this.$store.commit('changeVoucherStatus', 'ADD')
                this.$router.push({ path: '/voucherDetail' })
            },

			//获取用户列表
            getRecords() {
				let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                getVoucherListPage(para).then((res) => {
					this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
                    this.updateVoucherGroup();
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			updateVoucherGroup:function () {
                let array = [];
                array.push(0);
				for(let i = 0;i<this.records.length-1;i++){
				    if(this.records[i].voucherNum !== this.records[i+1].voucherNum||
                        this.records[i].voucherWord !== this.records[i+1].voucherWord||
                        this.records[i].period !==this.records[i+1].period ){
				        array.push(i+1);
					}
				}
				this.voucherGroup = array;
            },
			arrayContains:function (array,num) {
                for (let i = 0;i<array.length;i++) {
                    if (array[i] === num)
                        return i;
                }
                return -1;
            }
		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>