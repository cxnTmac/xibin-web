<template>
	<section>
		<div v-title data-title="出库单付款情况"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="filters.orderNo" placeholder="订单号"></el-input>
					</el-form-item>
					<el-form-item label="客户" prop="buyerCode">
						<popwin-button popKey="POP_CUSTOMER" :showName="true" :selectValue="filters.buyerCode"
							v-model="filters.buyerCode"></popwin-button>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="filters.status" clearable placeholder="请选择">
							<el-option v-for="item in status" :key="item.code" :label="item.name" :value="item.code">
								<span style="float: left">{{ item.name }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
							</el-option>
						</el-select>
						<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom"
						v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right" @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getOrders">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
					<el-row :gutter="0" v-if="showMoreQueryCondition">
						<el-form-item label="订单类别" prop="outboundType">
							<el-select v-model="filters.outboundType" clearable placeholder="请选择">
								<el-option v-for="item in type" :key="item.code" :label="item.name" :value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
						</el-form-item>
						<!-- <el-form-item label="打款类别" prop="paymentCategory">
							<el-select v-model="filters.paymentCategory" clearable placeholder="请选择">
								<el-option v-for="item in PAYMENTCATEGORY" :key="item.code" :label="item.name" :value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="打款情况" prop="isRecievedCash">
							<el-select v-model="filters.isRecievedCash" clearable placeholder="请选择">
								<el-option v-for="item in ISRECEIVECASH" :key="item.code" :label="item.name"
									:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
						</el-form-item>
						<el-form-item label="订单时间从" prop="orderTimeFm">
							<el-date-picker v-model="filters.orderTimeFm" type="datetime" placeholder="选择日期时间">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
						<el-form-item label="订单时间到" prop="orderTimeTo">
							<el-date-picker v-model="filters.orderTimeTo" type="datetime" placeholder="选择日期时间">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-row>

				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" border highlight-current-row v-loading="listLoading" @selection-change="selsChange"
			stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!-- <el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column> -->
			<el-table-column prop="orderNo" label="出库单号" width="140">
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="handleEdit(scope.$index, scope.row)"
						style="margin-left: 10px">{{ scope.row.orderNo }}</a></template>
			</el-table-column>
			<el-table-column prop="orderTime" label="订单时间" width="90" sortable :formatter="formatOrderTime">
			</el-table-column>
			<el-table-column prop="buyerName" label="客户名称" width="150">
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="handleBussinessRecord(scope.$index, scope.row)"
						style="margin-left: 10px">{{ scope.row.buyerName }}</a></template>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="50" :formatter="formatStatus">
			</el-table-column>
			<el-table-column :filters="[{ text: '已审核', value: '10' }, { text: '未审核', value: '00' }]"  :filter-method="auditFilterHandler" prop="auditStatus"
				label="审核状态" width="80" :formatter="formatAuditStatus">
			</el-table-column>
			<el-table-column prop="outboundType" label="出库单类型" width="80" :formatter="formatOutboundType">
			</el-table-column>
			<el-table-column prop="totalPrice" label="总价格" width="60">
			</el-table-column>
			<el-table-column prop="cash" label="收款金额" width="60">
			</el-table-column>
			<el-table-column prop="priceDifferent" label="实际差价" width="60">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<div :id="scope.row.id" :class="formatPriceDifferentClass(scope.row)">{{ formatPriceDifferent(scope.row) }}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="paymentCategory" :filters="[{ text: '现金', value: 'CASH' }, { text: '账期', value: 'PERIOD' }, { text: '货到付款', value: 'ON_DELIVERY' }]"  :filter-method="paymentCategoryFilterHandler" label="打款类别" width="80">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag :type="getPaymentCategoryType(scope.row)">{{ formatPaymentCategory(scope.row)
							}}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="isRecievedCash" label="打款情况" width="80">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag :type="getIsRecievedCashType(scope.row)">{{ formatisRecievedCash(scope.row)
							}}</el-tag>
					</div>
				</template></el-table-column>

			<el-table-column prop="freightType" label="运费类别" :filters="[{ text: '未确定', value: 'UNCONFIRMED' }, { text: '客户付款', value: 'CUSTOMER_PAID' }, { text: '现金付款', value: 'CASH_PAID' }, { text: '账上扣款', value: 'DEBIT_ON_ACCOUNT' }]"  :filter-method="freightTypeFilterHandler" width="80" :formatter="formatFreightType">
			</el-table-column>
			<el-table-column prop="freight" label="运费金额" width="50">
			</el-table-column>
			<el-table-column prop="paymentTime" label="收款时间" width="90">
			</el-table-column>
			<el-table-column prop="paymentPicUrl" label="收款凭证图片URL" width="200">
				<template slot-scope="scope">
					<a v-if="scope.row !== null && scope.row !== ''" href="javascript:void(0)"
						@click="handlePicUrl(scope.$index, scope.row)" style="margin-left: 10px">{{
			scope.row.paymentPicUrl }}</a></template>
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" min-width="80">
				<template slot-scope="scope">
					<el-button type="success" v-if="getAccountBtnStatus(scope.row)" size="small"
						@click="account(scope.$index, scope.row)">核算</el-button>
					<el-button type="danger" v-if="getCancelBtnStatus(scope.row)" size="small"
						@click="cancel(scope.$index, scope.row)">取消</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="batchAccount">批量核算</el-button>
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
import { getOutboundOrderListPage, accountByOrderNo, cancelAccountByOrderNo } from '../../api/outboundApi';
import NP from "number-precision";
import axios from 'axios';
var codemaster = require('../../../static/codemaster.json');
export default {
	data() {
		return {
			showMoreQueryCondition: false,
			status: codemaster.WM_OUTBOUND_STATUS,
			type: codemaster.WM_OUTBOUND_TYPE,
			PAYMENTCATEGORY: codemaster.BD_CUSTOMER_PAYMENT_CATEGORY,
			ISRECEIVECASH: codemaster.WM_IS_RECIEVED_CASH,
			filters: {
				orderNo: '',
				buyerCode: '',
				orderTimeFm: '',
				orderTimeTo: '',
				isRecievedCash: '',
				paymentCategory: '',
				outboundType: '',
				status: ''
			},
			orders: [],
			total: 0,
			page: 1,
			size: 999,
			listLoading: false,
			loading: true,
			sels: [],//列表选中列
			//AI图片识别
			dialogAIVisible: false,
			activeName: 'picUpload',
			currentRow: {},
			fileList: [],
			priceDifferenClass: ''
		}
	},
	methods: {
		reset() {
			this.$refs['queryForm'].resetFields();
		},
		auditFilterHandler(value, row) {
			return row['auditStatus'] === value;
		},
		paymentCategoryFilterHandler(value, row){
			return row['paymentCategory'] === value;
		},
		freightTypeFilterHandler(value, row){
			return row['freightType'] === value;
		},
		showMoreConditionHandler: function () {
			this.showMoreQueryCondition = !this.showMoreQueryCondition;
		},
		formatOrderTime: function (row, column) {
			if (row.orderTime !== null) {
				let unixTimestamp = new Date(row.orderTime)
				return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
			}
		},
		formatAuditTime: function (row, column) {
			if (row.auditTime !== null) {
				let unixTimestamp = new Date(row.auditTime)
				return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
			}
		},
		formatFreightType: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_FREIGHT_TYPE, row.freightType);
		},
		formatOutboundType: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_OUTBOUND_TYPE, row.outboundType);
		},
		formatStatus: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_OUTBOUND_STATUS, row.status);
		},
		formatAuditStatus: function (row, column) {
			return util.getComboNameByValue(codemaster.SYS_AUDIT_STATUS, row.auditStatus);
		},
		formatPriceDifferentClass:function (row, column) {
			if (row.isRecievedCash === 'NO_CASH'||row.isRecievedCash === 'N') {
				return null;
			}
			else if(row.priceDifferent!=NP.minus(row.totalPrice===null?0:row.totalPrice,row.cash===null?0:row.cash)){
				return 'FONT-RED'
			}else{
				return null;
			}
		},
		formatPriceDifferent: function (row, column) {
			if (row.isRecievedCash === 'NO_CASH'||row.isRecievedCash === 'N') {
				return '-';
			}
			return row.priceDifferent;
		},
		formatPaymentCategory: function (row, column) {
			return util.getComboNameByValue(codemaster.BD_CUSTOMER_PAYMENT_CATEGORY, row.paymentCategory);
		},
		formatisRecievedCash: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_IS_RECIEVED_CASH, row.isRecievedCash);
		},
		getPaymentCategoryType: function (row) {
			if (row.paymentCategory === 'CASH') {
				return 'danger'
			}
			if (row.paymentCategory === 'PERIOD') {
				return 'success'
			}
			if (row.paymentCategory === 'CASH') {
				return 'warning'
			}
		},
		getIsRecievedCashType: function (row) {
			if (row.isRecievedCash === 'N') {
				return 'danger'
			}
			if (row.isRecievedCash === 'Y') {
				return 'success'
			}
			if (row.isRecievedCash === 'NO_CASH') {
				return 'warning'
			}
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getOrders(false);
		},
		handlePicUrl: function (index, row) {
			window.open(row.paymentPicUrl, "_blank");
		},
		handleEdit: function (index, row) {
			this.$store.commit('changeOutboundOrderNo', row.orderNo);
			this.$store.commit('changeOutboundStatus', 'EDIT');
			this.$store.commit('changeOutboundFilters', this.filters);
			this.$store.commit('changeOutboundDetailFromPath', '/outboundForPayment');
			this.$router.push({ path: '/outboundDetail' });
		},
		handleBussinessRecord: function (index, row) {
			this.$store.commit('changeOutboundFilters', this.filters);
			this.$store.commit('changeCustomerRecordFilters', { customerCode: row.buyerCode, customerName: row.buyerName });
			this.$store.commit('changeCustomerRecordFromPath', '/outboundForPayment');
			this.$router.push({ path: '/customerRecord' });
		},
		//获取用户列表
		getOrders(scrollFlag) {
			let para = {
				page: this.page,
				size: this.size,
				conditions: JSON.stringify(this.filters)
			};
			this.listLoading = true;
			//NProgress.start();
			getOutboundOrderListPage(para).then((res) => {
				this.total = res.data.size;
				this.orders = res.data.list;
				this.listLoading = false;
				if (scrollFlag) {
					//滚动到之前纪录的位置
				}
				//NProgress.done();
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},

		selsChange: function (sels) {
			this.sels = sels;
		},
		getAccountBtnStatus(row) {
			if (row.isCalculated === 'Y') {
				return false;
			} else {
				return true;
			}
		},
		getCancelBtnStatus(row) {
			if (row.isCalculated === 'Y') {
				return true;
			} else {
				return false;
			}
		},
		batchAccount(){
			alert('暂未开放');
		},
		account(index, row) {
			let para = { orderNo: row.orderNo };
			accountByOrderNo(para)
				.then((res) => {
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: "success",
						});
						this.getOrders(false);
					} else {
						this.$message.error(res.data.msg);
					}
				})
				.catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
		},
		cancel(index, row) {
			let para = { orderNo: row.orderNo };
			cancelAccountByOrderNo(para)
				.then((res) => {
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: "success",
						});
						this.getOrders(false);
					} else {
						this.$message.error(res.data.msg);
					}
				})
				.catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
		}
	},
	mounted() {
		this.filters = this.$store.state.outboundForPayment.filters;
		let now = new Date(); //当前日期
		let nowMonth = now.getMonth(); //当前月
		let nowYear = now.getFullYear(); //当前年
		//本月的开始时间
		let monthStartDate = new Date(nowYear, nowMonth, 1);
		//本月的结束时间
		let monthEndDate = new Date(nowYear, nowMonth + 1, 1);
		if (this.filters.orderTimeFm === null || this.filters.orderTimeFm === '') {
			this.filters.orderTimeFm = monthStartDate;
		}
		if (this.filters.orderTimeTo === null || this.filters.orderTimeTo === '') {
			this.filters.orderTimeTo = monthEndDate;
		}
		this.getOrders(true);
	}
}

</script>

<style scoped>
.FONT-RED{
	color: red;
}
</style>