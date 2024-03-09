<template>
	<section>
		<div v-title data-title="重新分配虚拟库存"></div>
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
		<el-table :data="orders" border highlight-current-row v-loading="listLoading" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!-- <el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column> -->
			
			<el-table-column prop="sku_code" label="产品编码" width="80">
			</el-table-column>
			<el-table-column prop="sku_name" label="产品名称" width="150">
			</el-table-column>
			<el-table-column prop="model_code" label="产品名称" width="150">
			</el-table-column>
			<el-table-column prop="outbound_num" label="发货数" width="50">
			</el-table-column>
			<el-table-column prop="order_no" label="出库单号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="buyer_code" label="客户编码" width="80">
			</el-table-column>
			<el-table-column prop="buyer_name" label="客户名称" width="150">
			</el-table-column>
			<el-table-column prop="outbound_type" label="出库单类型" width="80" :formatter="formatOutboundType">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="alloc_type" label="分配类型" width="80" :formatter="formatAllocType">
			</el-table-column>

			<el-table-column prop="order_time" label="订单时间" width="155" sortable :formatter="formatOrderTime">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" width="180">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="reAllocSubmit(scope.row)">重新分配</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">

		</el-col>


	</section>
</template>

<script>
import Vue from 'vue'
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { selectForReAlloc,reAllocByAllocId } from '../../api/outboundApi';
import axios from 'axios';
var codemaster = require('../../../static/codemaster.json');
export default {
	data() {
		return {
			showMoreQueryCondition: false,
			status: codemaster.WM_OUTBOUND_STATUS,
			type: codemaster.WM_OUTBOUND_TYPE,
			allocType: codemaster.WM_ALLOC_TYPE,
			filters: {
				orderNo: '',
				buyerCode: '',
				orderTimeFm: '',
				orderTimeTo: ''
			},
			orders: [],
			listLoading: false,
			loading: true
		}
	},
	methods: {
		reset() {
			this.$refs['queryForm'].resetFields();
		},
		showMoreConditionHandler: function () {
			this.showMoreQueryCondition = !this.showMoreQueryCondition;
		},
		formatOrderTime: function (row, column) {
			if (row.order_time !== null) {
				let unixTimestamp = new Date(row.order_time)
				return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
			}
		},
		formatOutboundType: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_OUTBOUND_TYPE, row.outbound_type);
		},
		formatStatus: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_OUTBOUND_STATUS, row.status);
		},
		formatAllocType: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_ALLOC_TYPE, row.alloc_type);
		},
		//获取用户列表
		getOrders() {
			let para = {
				conditions: JSON.stringify(this.filters)
			};
			this.listLoading = true;
			//NProgress.start();
			selectForReAlloc(para).then((res) => {
				this.orders = res.data;
				this.listLoading = false;
				//NProgress.done();
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});
		},
		reAllocSubmit(row){
			//NProgress.start();
			reAllocByAllocId({id: row.id}).then((res) => {
				//NProgress.done();
				if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
				this.getOrders();
			}).catch((data) => {
				this.getOrders();
				util.errorCallBack(data, this.$router, this.$message);
			});
		}
	},
	mounted() {
		//this.filters = this.$store.state.outbound.filters;
		let now = new Date(); //当前日期
		let nowMonth = now.getMonth(); //当前月
		let nowYear = now.getFullYear(); //当前年
		//本月的开始时间
		let monthStartDate = new Date(nowYear, nowMonth, 1);
		//本月的结束时间
		let monthEndDate = new Date(nowYear, nowMonth + 1, 1);
		this.filters = this.$store.state.outboundSkuQuery.filters;
		if (this.filters.orderTimeFm === null) {
			this.filters.orderTimeFm = monthStartDate;
		}
		if (this.filters.orderTimeTo === null) {
			this.filters.orderTimeTo = monthEndDate;
		}
		this.getOrders();
	}
}

</script>

<style scoped></style>