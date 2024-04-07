<template>
	<section>
		<div v-title data-title="查看凭证"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="时间从" prop="dateFm">
						<el-date-picker v-model="filters.dateFm" type="date" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="时间到" prop="dateTo">
						<el-date-picker v-model="filters.dateTo" type="date" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom"
						v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right" @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getOrders">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
					<el-row :gutter="0" v-if="showMoreQueryCondition">
					</el-row>
				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" border :row-class-name="getVoucherClass" :span-method="objectSpanMethod"
			highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="voucher" width="150" label="凭证">
				<template slot-scope="scope">
					<div>
						ID：{{ scope.row.voucherID }}
					</div>
					<div>
						凭证序号：{{ scope.row.serialNum }}
					</div>
					<div>
						期间：{{ formatPeriod(scope.row, scope.column) }}
					</div>
					<div>
						日期：{{ scope.row.fdate }}
					</div>
					<div>
						分录数：{{ scope.row.entryCount }}
					</div>
					<div>
						借总：{{ scope.row.debitTotal }}
					</div>
					<div>
						贷总：{{ scope.row.creditTotal }}
					</div>
					<div>
						备注：{{ scope.row.headerExplanation }}
					</div>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="voucherID" width="50" label="id">
			</el-table-column>
			<el-table-column prop="fdate" width="90" label="凭证日期">
			</el-table-column>
			<el-table-column prop="fperiod" width="60" label="期间" :formatter="formatPeriod">
			</el-table-column>
			<el-table-column prop="entryCount" label="分录数">
			</el-table-column> -->
			<el-table-column prop="explanation" width="300" label="摘要">
			</el-table-column>
			<el-table-column prop="amount" label="借方金额" width="80" :formatter="formatJAmount">
			</el-table-column>
			<el-table-column prop="amount" label="贷方金额" width="80" :formatter="formatDAmount">
			</el-table-column>
			<el-table-column prop="accountName" width="140" label="科目">
			</el-table-column>
			<el-table-column prop="itemName" width="300" label="核算项目">
			</el-table-column>

			<el-table-column prop="status" width="140" label="凭证状态">
				<template slot-scope="scope">
					<div>
						是否审核：{{ formatComboValue(FI_VOUCHER_CHECK, scope.row.checked) }}
					</div>
					<div>
						是否过账：{{ formatComboValue(FI_VOUCHER_POST, scope.row.posted) }}
					</div>
					<div>
						是否结账：{{ formatComboValue(FI_VOUCHER_SA, scope.row.isSettleAccounts) }}
					</div>
					<div>
						结转损益：{{ formatComboValue(FI_VOUCHER_PL, scope.row.isProfitLoss) }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="operater" width="140" label="人员相关">
				<template slot-scope="scope">
					<div>
						制单人：{{ scope.row.preparerID }}
					</div>
					<div>
						审核人：{{ scope.row.checkerID }}
					</div>
					<div>
						记账人：{{ scope.row.posterID }}
					</div>
					<div>
						出纳员：{{ scope.row.cashierID }}
					</div>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="checked" label="是否审核">
			</el-table-column>
			<el-table-column prop="posted" label="是否过账">
			</el-table-column>
			<el-table-column prop="isSettleAccounts" label="是否结账">
			</el-table-column> -->
			<!-- <el-table-column prop="preparerID" label="制单人">
			</el-table-column>
			<el-table-column prop="checkerID" label="审核人">
			</el-table-column>
			<el-table-column prop="posterID" label="记账人">
			</el-table-column>
			<el-table-column prop="cashierID" label="出纳员">
			</el-table-column> -->
			<!-- <el-table-column prop="serialNum" label="凭证序号">
			</el-table-column> -->
			<!-- <el-table-column prop="transDate" label="业务日期">
			</el-table-column> -->
			<!-- <el-table-column prop="isProfitLoss" label="是否结转">
			</el-table-column> -->
			<!-- <el-table-column prop="headerExplanation" label="备注">
			</el-table-column> -->
			<el-table-column label="操作" min-width="80">
				<template slot-scope="scope">
					<div><el-button type="success" size="small"
							@click="handleEdit(scope.$index, scope.row)">编辑</el-button></div>
					<br />
					<div><el-button type="danger" size="small"
							@click="handleDel(scope.$index, scope.row)">删除</el-button></div>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-popover placement="top" trigger="click">
				<el-radio v-model="checkRadio" label="1">通过</el-radio>
				<el-radio v-model="checkRadio" label="0">未通过</el-radio>
				<el-button style="margin-left: 20px;" type="success" size="mini"
					@click="batchCheckSubmit">提交</el-button>
				<el-button type="success" slot="reference">审核</el-button>
			</el-popover>
			<el-button type="danger" @click="batchBackCheck">反审核</el-button>
			<el-popover placement="top" trigger="click">
				<el-radio v-model="postRadio" label="1">通过</el-radio>
				<el-radio v-model="postRadio" label="0">未通过</el-radio>
				<el-button style="margin-left: 20px;" type="success" size="mini" @click="batchPostSubmit">提交</el-button>
				<el-button type="success" slot="reference">过账</el-button>
			</el-popover>
			<el-button type="danger" @click="batchBackPost">反过账</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page"
				:page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
import Vue from 'vue'
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { queryForVoucher } from '../../api/customerRecordApi';
import { deleteFVoucher, updateChecked, updateBackChecked, updatePosted } from '../../api/financeApi';
import NP from "number-precision";
import axios from 'axios';
var codemaster = require('../../../static/codemaster.json');
export default {
	data() {
		return {
			showMoreQueryCondition: false,
			filters: {
				dateFm: '',
				dateTo: '',
			},
			orders: [],
			total: 0,
			page: 1,
			size: 10,
			listLoading: false,
			loading: true,
			sels: [],//列表选中列
			currentRow: {},
			orderGroup: [],
			checkRadio: "1",
			postRadio: "1",
			FI_VOUCHER_CHECK: codemaster.FI_VOUCHER_CHECK,
			FI_VOUCHER_POST: codemaster.FI_VOUCHER_POST,
			FI_VOUCHER_SA: codemaster.FI_VOUCHER_SA,
			FI_VOUCHER_PL: codemaster.FI_VOUCHER_PL
		}
	},
	methods: {
		reset() {
			this.$refs['queryForm'].resetFields();
		},
		auditFilterHandler(value, row) {
			return row['auditStatus'] === value;
		},
		showMoreConditionHandler: function () {
			this.showMoreQueryCondition = !this.showMoreQueryCondition;
		},
		getVoucherClass: function ({ row, rowIndex }) {
			if (row.serialNum % 2 === 0) {
				return "DOUBLE";
			} else {
				return "SINGLE";
			}
		},
		formatOrderTime: function (row, column) {
			if (row.orderTime !== null) {
				let unixTimestamp = new Date(row.orderTime)
				return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
			}
		},
		formatVoucher: function (row, column) {
			return row.fyear + "-" + row.fperiod;
		},
		formatJAmount: function (row, column) {
			if (row.dc > 0) {
				return row.amount;
			} else {
				return '';
			}
		},
		formatComboValue: function (comboValue, value) {
			return util.getComboNameByValue(comboValue, value);
		},
		formatDAmount: function (row, column) {
			if (row.dc === 0) {
				return row.amount;
			} else {
				return '';
			}
		},
		formatPeriod: function (row, column) {
			return row.fyear + "-" + row.fperiod;
		},
		formatFreightType: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_FREIGHT_TYPE, row.freightType);
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getOrders(false);
		},
		handleAdd: function () {
			this.$store.commit('changeVoucherID', '');
			this.$store.commit('changeVoucherStatus', 'ADD');
			this.$store.commit('changeVoucherFilters', this.filters);
			this.$store.commit('changeVoucherFromPath', '/outbound');
			this.$store.commit('changePage', this.page);
			this.$router.push({ path: '/voucherDetail' });
		},
		handleEdit: function (index, row) {
			this.$store.commit('changeVoucherID', row.voucherID);
			this.$store.commit('changeVoucherStatus', 'EDIT');
			this.$store.commit('changeVoucherFilters', this.filters);
			this.$store.commit('changeVoucherFromPath', '/voucher');
			this.$store.commit('changePage', this.page);
			this.$router.push({ path: '/voucherDetail' });
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0 || columnIndex === 1 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9) {
				let i = this.arrayContains(this.orderGroup, rowIndex);
				if (i >= 0 && i < this.orderGroup.length - 1) {
					return {
						rowspan: this.orderGroup[i + 1] - this.orderGroup[i],
						colspan: 1,
					};
				} else if (i === this.orderGroup.length - 1) {
					return {
						rowspan: this.orders.length - this.orderGroup[i],
						colspan: 1,
					};
				} else {
					return {
						rowspan: 0,
						colspan: 0,
					};
				}
			}
		},
		updateOrderGroup: function () {
			let array = [];
			array.push(0);
			for (let i = 0; i < this.orders.length - 1; i++) {
				if (this.orders[i].voucherID !== this.orders[i + 1].voucherID) {
					array.push(i + 1);
				}
			}
			this.orderGroup = array;
		},
		arrayContains: function (array, num) {
			for (let i = 0; i < array.length; i++) {
				if (array[i] === num) return i;
			}
			return -1;
		},
		//删除
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { ids: [row.voucherID].join(',') };
				deleteFVoucher(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
						this.getOrders();
					} else {
						this.$message.error(res.data.msg);
					}

				}).catch((data) => {
					this.listLoading = false;
					util.errorCallBack(data, this.$router, this.$message);
				});
			})
		},
		//获取用户列表
		getOrders() {
			let para = {
				page: this.page,
				size: this.size,
				conditions: JSON.stringify(this.filters)
			};
			this.listLoading = true;
			//NProgress.start();
			queryForVoucher(para).then((res) => {
				this.total = res.data.size;
				this.orders = res.data.list;
				this.listLoading = false;
				this.updateOrderGroup();
				//NProgress.done();
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		batchCheckSubmit() {
			let errorList = [];
			let voucherIDs = [];
			this.sels.map(function (sel, index, sels) {
				if (sel.checked === 2) {
					voucherIDs.push(sel.voucherID);
				} else {
					errorList.push(sel.voucherID);
				}
			});
			if (voucherIDs.length === 0) {
				this.$message.error('凭证ID'+errorList.toString() + "不是未审核状态！");
			} else {
				updateChecked({ voucherID: voucherIDs.join(','), checked: this.checkRadio }).then((res) => {
					if (errorList.length > 0) {
						this.$message({
							message: '操作成功，但是其中凭证ID' + errorList.toString() + "不是未审核状态！",
							type: 'warning'
						});
					} else {
						this.$message({
							message:'操作成功',
							type:'success'
						});
					}
					this.getOrders();
					//NProgress.done();
				}).catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
			}
		},
		batchBackCheck() {
			let errorList = [];
			let voucherIDs = [];
			this.sels.map(function (sel, index, sels) {
				if (sel.checked === 1||sel.checked === 0) {
					voucherIDs.push(sel.voucherID);
				} else {
					errorList.push(sel.voucherID);
				}
			});
			if (voucherIDs.length === 0) {
				this.$message.error('凭证ID'+errorList.toString() + "不是已审核状态！");
			} else {
				updateBackChecked({ voucherID: voucherIDs.join(','), checked: 2 }).then((res) => {
					if (errorList.length > 0) {
						this.$message({
							message: '操作成功，但是其中凭证ID' + errorList.toString() + "不是已审核状态！",
							type: 'warning'
						});
					} else {
						this.$message({
							message:'操作成功',
							type:'success'
						});
					}
					this.getOrders();
					//NProgress.done();
				}).catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
			}
		},
		batchPostSubmit() {
			let errorList = [];
			let voucherIDs = [];
			this.sels.map(function (sel, index, sels) {
				if (sel.posted === 2) {
					voucherIDs.push(sel.voucherID);
				} else {
					errorList.push(sel.voucherID);
				}
			});
			if (voucherIDs.length === 0) {
				this.$message.error('凭证ID'+errorList.toString() + "不是未过账状态！");
			} else {
				updatePosted({ voucherID: voucherIDs.join(','), posted: this.postRadio }).then((res) => {
					if (errorList.length > 0) {
						this.$message({
							message: '操作成功，但是其中凭证ID' + errorList.toString() + "不是未过账状态！",
							type: 'warning'
						});
					} else {
						this.$message({
							message:'操作成功',
							type:'success'
						});
					}
					this.getOrders();
					//NProgress.done();
				}).catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
			}
		},
		batchBackPost() {
			let errorList = [];
			let voucherIDs = [];
			this.sels.map(function (sel, index, sels) {
				if (sel.posted === 0||sel.posted === 1) {
					voucherIDs.push(sel.voucherID);
				} else {
					errorList.push(sel.voucherID);
				}
			});
			if (voucherIDs.length === 0) {
				this.$message.error('凭证ID'+errorList.toString() + "不是已过账状态！");
			} else {
				updatePosted({ voucherID: voucherIDs.join(','), posted: 2 }).then((res) => {
					if (errorList.length > 0) {
						this.$message({
							message: '操作成功，但是其中凭证ID' + errorList.toString() + "不是已过账状态！",
							type: 'warning'
						});
					} else {
						this.$message({
							message:'操作成功',
							type:'success'
						});
					}
					this.getOrders();
					//NProgress.done();
				}).catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
			}
		}
	},
	mounted() {
		this.filters = this.$store.state.voucher.filters;
		let now = new Date(); //当前日期
		let nowMonth = now.getMonth(); //当前月
		let nowYear = now.getFullYear(); //当前年
		//本月的开始时间
		let monthStartDate = new Date(nowYear, nowMonth, 1);
		//本月的结束时间
		let monthEndDate = new Date(nowYear, nowMonth + 1, 1);
		if (this.filters.dateFm === null || this.filters.dateFm === '') {
			this.filters.dateFm = monthStartDate;
		}
		if (this.filters.dateTo === null || this.filters.dateTo === '') {
			this.filters.dateTo = monthEndDate;
		}
		this.getOrders();
	}
}

</script>

<style>
.FONT-RED {
	color: red;
}

.el-table .SINGLE {
	background: oldlace;
}

.el-table .DOUBLE {
	background: #f0f9eb;
}
</style>