<template>
  <section>
    <div v-title data-title="销售日报表"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters" :rules="queryRules" ref="queryForm">
        <el-row :gutter="0">
          <el-form-item label="客户" prop="buyerCode">
            <popwin-button
              popKey="POP_CUSTOMER"
              :showName="true"
              :selectValue="filters.buyerCode"
              v-model="filters.buyerCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="filters.status" clearable placeholder="请选择">
              <el-option
                v-for="item in status"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.code
                }}</span>
              </el-option>
            </el-select>
            <!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="订单日期" prop="orderDate">
            <el-date-picker
              v-model="filters.orderDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-button
            type="primary"
            class="el-icon-caret-bottom"
            v-on:click="showMoreConditionHandler"
          ></el-button>
          <el-button type="danger" style="float: right" @click="reset"
            >重置</el-button
          >
          <el-button type="primary" style="float: right" v-on:click="getOrders"
            >查询</el-button
          >
        </el-row>
        <transition name="el-zoom-in-top">
          <el-row :gutter="0" v-if="showMoreQueryCondition">
            <el-form-item label="订单类别" prop="outboundType">
              <el-select
                v-model="filters.outboundType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in type"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.code
                  }}</span>
                </el-option>
              </el-select>
              <!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-row>
        </transition>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="orders"
      border
      highlight-current-row
      v-loading="listLoading"
      stripe
      style="width: 100%"
    >
      <!-- <el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column> -->
      <el-table-column prop="date" label="订单时间" width="155">
      </el-table-column>
      <el-table-column prop="order_no" label="出库单号" width="270">
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            @click="orderDetail(scope.$index, scope.row)"
            style="margin-left: 10px"
            >{{ scope.row.order_no }}</a
          >
        </template>
      </el-table-column>
      <el-table-column prop="customer_name" label="客户名称" width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80"
        :formatter="formatStatus"
      >
      </el-table-column>
      <el-table-column prop="remark" label="件数备注"> </el-table-column>
      <el-table-column prop="totalSale" label="总销售额"> </el-table-column>
      <el-table-column prop="freight_paid" label="运费已付"> </el-table-column>
      <el-table-column prop="freight_collect" label="运费扣除">
      </el-table-column>
      <el-table-column prop="cost" label="成本"> </el-table-column>
      <el-table-column prop="gross_profit" label="毛利润"> </el-table-column>
      <el-table-column prop="gross_profit_margin" label="毛利润率">
      </el-table-column>
      <el-table-column prop="freight_rate" label="运费率"> </el-table-column>
      <el-table-column prop="buyer_code" label="客户编码" width="80">
      </el-table-column>
      <el-table-column
        prop="outbound_type"
        label="出库单类型"
        width="80"
        :formatter="formatOutboundType"
      >
      </el-table-column>
      <el-table-column prop="is_calculated" label="是否核算" width="80">
      </el-table-column>
      <el-table-column prop="voucher_id" label="凭证ID" width="80">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="size"
        :total="total"
        style="float: right"
      >
      </el-pagination> -->
       <download-excel
        class="export-excel-wrapper"
        :data="orders"
        :fields="json_fields"
        name="出库日报表.xls"
      >
      <el-button type="primary" size="small">导出EXCEL</el-button>
      </download-excel>
    </el-col>
  </section>
</template>

<script>
import Vue from "vue";
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { queryForOutboundDaily } from "../../api/outboundApi";
import axios from "axios";
var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      json_fields: {
        订单日期: "date", //常规字段
        出库单号: "order_no",
        客户: "customer_name",
        状态: "outboundType",
        件数备注: "remark",
        销售总额: "totalSale",
        运费已付: "freight_paid",
        运费到付: "freight_collect",
        成本: "cost",
        毛利: "gross_profit",
        毛利润率: "gross_profit_margin",
        运费率: "freight_rate",
        客户编码: "buyer_code",
        出库类型: "outbound_type"
      },
      showMoreQueryCondition: false,
      status: codemaster.WM_OUTBOUND_STATUS,
      type: codemaster.WM_OUTBOUND_TYPE,
      filters: {
        orderNo: "",
        buyerCode: "",
        orderDate: "",
        outboundType: "",
        status: "",
      },
      queryRules: {
        orderDate: [
          { required: true, message: "请输入日期", trigger: "blur" },
        ],
      },
      orders: [],
      total: 0,
      listLoading: false,
      loading: true,
    };
  },
  methods: {
    reset() {
      this.$refs["queryForm"].resetFields();
    },
    showMoreConditionHandler: function () {
      this.showMoreQueryCondition = !this.showMoreQueryCondition;
    },
    formatOrderTime: function (row, column) {
      if (row.orderTime !== null) {
        let unixTimestamp = new Date(row.orderTime);
        return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatOutboundType: function (row, column) {
      return util.getComboNameByValue(
        codemaster.WM_OUTBOUND_TYPE,
        row.outbound_type
      );
    },
    formatStatus: function (row, column) {
      return util.getComboNameByValue(
        codemaster.WM_OUTBOUND_STATUS,
        row.status
      );
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders();
    },
    //获取用户列表
    getOrders() {
      //NProgress.start();
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          let para = {
            conditions: JSON.stringify(this.filters),
          };
          this.listLoading = true;
          queryForOutboundDaily(para)
            .then((res) => {
              this.orders = res.data;
              this.listLoading = false;
              //NProgress.done();
            })
            .catch((data) => {
              this.listLoading = false;
              util.errorCallBack(data, this.$router, this.$message);
            });
        }
      });
    },
    orderDetail: function (index, row) {
      this.$store.commit("changeOutboundOrderNo", row.order_no);
      this.$store.commit("changeOutboundDailyFilters", this.filters);
      this.$store.commit("changeOutboundDetailFromPath", "/outboundDaily");
      this.$store.commit("changeOutboundStatus", "EDIT");
      this.$router.push({ path: "/outboundDetail" });
    },
  },
  mounted() {
    // this.filters.orderDate = new Date();
    this.filters = this.$store.state.outboundDaily.filters;
    this.page = this.$store.state.outboundDaily.page;
    this.getOrders();
  },
};
</script>

<style scoped>
</style>