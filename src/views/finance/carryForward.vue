<template>
	<section>
		<div v-title data-title="结转"></div>
		<!--工具条-->
		<el-row>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters" ref="queryForm">
					<el-row :gutter="0">
						<el-form-item label="年" prop="fyear">
							<el-input-number v-model="filters.fyear" :min="1990" label="年"></el-input-number>
						</el-form-item>
						<el-form-item label="期" prop="fperiod">
							<el-input-number v-model="filters.fperiod" :min="1" :max="12" label="期"></el-input-number>
						</el-form-item>
						<el-button type="primary" class="el-icon-caret-bottom"
							v-on:click="showMoreConditionHandler"></el-button>
						<el-button type="danger" style="float: right" @click="reset">重置</el-button>
						<el-button type="primary" style="float: right" @click="getAll">查询</el-button>
					</el-row>
					<transition name="el-zoom-in-top">
						<el-row :gutter="0" v-if="showMoreQueryCondition">
						</el-row>
					</transition>
				</el-form>
			</el-col>
		</el-row>
		<el-row :gutter="40">
			<el-col :span="14">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="line-height: 15px">收入结转</span>
					</div>
					<el-table :data="income" border highlight-current-row v-loading="listLoading" style="width: 100%;">
						<el-table-column prop="fyear" width="50" label="年">
						</el-table-column>
						<el-table-column prop="fperiod" width="50" label="期间">
						</el-table-column>
						<el-table-column prop="type" width="230" label="类型">
							<template slot-scope="scope">
								{{ formatComboValue(FI_INCOME_TYPE, scope.row.type) }}
							</template>
						</el-table-column>
						<el-table-column prop="fdate" width="150" label="日期">
							<template slot-scope="scope">
								<el-date-picker v-if="getCarryBtnStatus(scope.row)" style="width: 120px;"
									v-model="scope.row.fdate" type="date" placeholder="选择日期"></el-date-picker>
								<div v-else> {{ scope.row.fdate }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="voucherId" label="关联凭证ID" width="90">
							<template slot-scope="scope">
								<a href="javascript:void(0)" @click="handleVoucher(scope.$index, scope.row)"
									style="margin-left: 10px">{{
										scope.row.voucherID }}</a>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button v-if="getCarryBtnStatus(scope.row)" type="success" size="small"
									@click="handleIncome(scope.$index, scope.row)">结转</el-button>
								<el-button v-else type="danger" size="small"
									@click="handleCancelIncome(scope.$index, scope.row)">反结转</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="10"><el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="line-height: 15px">成本结转</span>
					</div>
					<el-table :data="carried" border highlight-current-row v-loading="listLoading2"
						style="width: 100%;">
						<el-table-column prop="fyear" width="50" label="年">
						</el-table-column>
						<el-table-column prop="fperiod" width="50" label="期间">
						</el-table-column>
						<el-table-column prop="voucherId" label="关联凭证ID" width="90">
							<template slot-scope="scope">
								<a href="javascript:void(0)" @click="handleVoucher(scope.$index, scope.row)"
									style="margin-left: 10px">{{
										scope.row.voucherID }}</a>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button v-if="getCarryBtnStatus(scope.row)" type="success" size="small"
									@click="handleCarried(scope.$index, scope.row)">结转</el-button>
								<el-button v-else type="danger" size="small"
									@click="handleCancelCarried(scope.$index, scope.row)">反结转</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
				<br />
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="line-height: 15px">结转损益</span>
					</div>
					<el-table :data="profitLoss" border highlight-current-row v-loading="listLoading3"
						style="width: 100%;">
						<el-table-column prop="fyear" width="50" label="年">
						</el-table-column>
						<el-table-column prop="fperiod" width="50" label="期间">
						</el-table-column>
						<el-table-column prop="voucherId" label="关联凭证ID" width="90">
							<template slot-scope="scope">
								<a href="javascript:void(0)" @click="handleVoucher(scope.$index, scope.row)"
									style="margin-left: 10px">{{
										scope.row.voucherID }}</a>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button v-if="getCarryBtnStatus(scope.row)" type="success" size="small"
									@click="handleCarry(scope.$index, scope.row)">结转</el-button>
								<el-button v-else type="danger" size="small"
									@click="handleCancelCarry(scope.$index, scope.row)">反结转</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
				<br />
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span style="line-height: 15px">结账</span>
					</div>
					<el-table :data="settleAccounts" border highlight-current-row v-loading="listLoading4"
						style="width: 100%;">
						<el-table-column prop="fyear" width="50" label="年">
						</el-table-column>
						<el-table-column prop="fperiod" width="50" label="期间">
						</el-table-column>
						<el-table-column label="操作" width="120">
							<template slot-scope="scope">
								<el-button v-if="getCarryBtnStatus(scope.row)" type="success" size="small"
									@click="handleCarry(scope.$index, scope.row)">结转</el-button>
								<el-button v-else type="danger" size="small"
									@click="handleCancelCarry(scope.$index, scope.row)">反结转</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card></el-col>
		</el-row>
		<!--列表-->


		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page"
				:page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->
	</section>
</template>

<script>
import Vue from 'vue'
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { findFIncome, findtranTypeAddVoucheerList, fanVoucheer, findFCarried, findtranTypeAddCarriedVoucheerList, fanCarriedVoucheer, findFProfitLoss, updateFProfitLoss, fanProfitLossVoucheer, findSettleAccounts } from '../../api/financeApi';
import NP from "number-precision";
import axios from 'axios';
var codemaster = require('../../../static/codemaster.json');
export default {
	data() {
		return {
			showMoreQueryCondition: false,
			filters: {
				fyear: '',
				fperiod: '',
			},
			income: [],
			carried: [],
			profitLoss: [],
			settleAccounts: [],
			listLoading: false,
			listLoading2: false,
			listLoading3: false,
			listLoading4: false,
			FI_INCOME_TYPE: codemaster.FI_INCOME_TYPE
		}
	},
	methods: {
		reset() {
			this.$refs['queryForm'].resetFields();
		},
		getCarryBtnStatus(row) {
			if (row.id !== undefined && row.id !== null && row.id !== "") {
				return false;
			} else {
				return true;
			}
		},
		formatComboValue: function (comboValue, value) {
			return util.getComboNameByValue(comboValue, value);
		},
		showMoreConditionHandler() {
			this.showMoreQueryCondition = !this.showMoreQueryCondition;
		},
		formatPeriod: function (row, column) {
			return row.fyear + "-" + row.fperiod;
		},
		handleVoucher: function (index, row) {
			this.$store.commit('changeVoucherID', row.voucherID);
			this.$store.commit('changeVoucherStatus', 'EDIT');
			this.$store.commit('changeVoucherFromPath', '/carryForward');
			this.$store.commit('changeCarryForwardFilters', this.filters);
			this.$router.push({ path: '/voucherDetail' });
		},
		handleIncome: function (index, row) {
			if (row.fdate === undefined || row.fdate === null || row.fdate === "") {
				this.$message.error("必须填写日期！");
				return;
			}
			findtranTypeAddVoucheerList({ fdate: row.fdate, type: row.type }).then((res) => {
				console.log(res);
				let voucherEntity = { list: res.data.list, ids: res.data.ids };
				let voucher = {
					type: '',
					voucherID: '',
					fVoucherType: '',
					sDay: '',
					eDay: '',
					fdate: new Date(),
					fyear: '',
					fperiod: '',
					groupID: 3,
					number: null,
					serialNum: '',
					entryCount: 0,
					debitTotal: "",
					creditTotal: "",
					transDate: new Date(),
					isProfitLoss: 0,
					explanation: '',
					bill: 0,
					debitTotalList: ['', '', '', '', '', '', '', '', 0, 0, 0],
					creditTotalList: ['', '', '', '', '', '', '', '', 0, 0, 0]
				};
				voucher.fVoucherType = row.type;
				voucher.fyear = row.fyear;
				voucher.fperiod = row.fperiod;
				voucher.fdate = row.fdate;
				voucherEntity.voucher = voucher;
				this.$store.commit('changeVoucherID', '');
				this.$store.commit('changeVoucherStatus', 'ADD_INCOME');
				this.$store.commit('changeVoucherEntity', voucherEntity);
				this.$store.commit('changeCarryForwardFilters', this.filters);
				this.$store.commit('changeVoucherFromPath', '/carryForward');
				this.$router.push({ path: '/voucherDetail' });
				//NProgress.done();
			}).catch((data) => {
				util.errorCallBack(data, this.$router, this.$message);
			});

		},
		handleCancelIncome: function (index, row) {
			fanVoucheer(row).then((res) => {
				this.getIncome();
				//NProgress.done();
			}).catch((data) => {
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		initData() {
			let totalTypes = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
			if (this.income.length < totalTypes.length) {
				let currentTypes = this.income.map(sel => sel.type);
				let difference = totalTypes.filter(function (type) {
					return !currentTypes.includes(type)
				});
				for (let i = 0; i < difference.length; i++) {
					this.income.push({ carried: 0, fyear: this.filters.fyear, voucherID: "", fperiod: this.filters.fperiod, fdate: "", id: "", type: difference[i] })
				}
			}

		},
		//获取数据
		getIncome() {
			this.listLoading = true;
			//NProgress.start();
			findFIncome(this.filters).then((res) => {
				this.income = res.data;
				this.listLoading = false;
				this.initData();
				//NProgress.done();
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		getCarried() {
			this.listLoading2 = true;
			//NProgress.start();
			findFCarried(this.filters).then((res) => {
				this.carried = res.data;
				this.listLoading2 = false;
				if (this.carried.length === 0) {
					this.carried.push({ carried: 0, fyear: this.filters.fyear, fperiod: this.filters.fperiod, id: '', voucherID: '' });
				}
				//NProgress.done();
			}).catch((data) => {
				this.listLoading2 = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		getProfitLoss() {
			this.listLoading3 = true;
			//NProgress.start();
			findFProfitLoss(this.filters).then((res) => {
				this.profitLoss = res.data;
				this.listLoading3 = false;
				if (this.profitLoss.length === 0) {
					this.profitLoss.push({ carried: 0, fyear: this.filters.fyear, fperiod: this.filters.fperiod, id: '', voucherID: '' });
				}
				//NProgress.done();
			}).catch((data) => {
				this.listLoading3 = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		getSettleAccounts() {
			this.listLoading4 = true;
			//NProgress.start();
			findSettleAccounts(this.filters).then((res) => {
				this.settleAccounts = res.data;
				this.listLoading4 = false;
				if (this.settleAccounts.length === 0) {
					this.settleAccounts.push({ fyear: this.filters.fyear, fperiod: this.filters.fperiod, id: '' });
				}
				//NProgress.done();
			}).catch((data) => {
				this.listLoading4 = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		getAll() {
			this.getIncome();
			this.getCarried();
			this.getProfitLoss();
			this.getSettleAccounts();
		}
	},
	mounted() {
		this.filters = this.$store.state.carryForward.filters;
		let now = new Date(); //当前日期
		this.filters.fperiod = now.getMonth(); //当前月
		this.filters.fyear = now.getFullYear(); //当前年
		this.getAll();
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