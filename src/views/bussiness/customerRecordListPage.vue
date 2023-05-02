<template>
  <section>
    <div v-title data-title="客户往来纪录查询"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form
        :inline="true"
        :model="filters"
        :rules="queryRules"
        ref="queryForm"
      >
        <el-row :gutter="0">
          <el-form-item label="客户" prop="customerCode">
            <popwin-button
              popKey="POP_CUSTOMER"
              :showName="true"
              v-model="filters.customerCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="类别" prop="type">
            <el-select v-model="filters.type" clearable placeholder="请选择 ">
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
          </el-form-item>
          <el-form-item label="时间从" prop="dateFm">
            <el-date-picker
              v-model="filters.dateFm"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="时间到" prop="dateTo">
            <el-date-picker
              v-model="filters.dateTo"
              type="datetime"
              placeholder="选择日期时间"
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
          <el-button type="primary" style="float: right" v-on:click="getRecords"
            >查询</el-button
          >
        </el-row>
        <transition name="el-zoom-in-top">
          <el-row :gutter="0" v-if="showMoreQueryCondition"> </el-row>
        </transition>
      </el-form>
    </el-col>
   
    <!--列表-->
    <el-table
      :data="records"
      border
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      stripe
      style="width: 100%"
    >

      <!-- <el-table-column prop="customerCode" label="客户编码" width="150">
      </el-table-column> -->
      <el-table-column prop="date" label="日期时间" width="150">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" >
      </el-table-column>
      <el-table-column prop="abstractt" label="摘要">
      </el-table-column>
      <el-table-column prop="orderNo" label="关联单据号">
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            @click="orderDetail(scope.$index, scope.row)"
            style="margin-left: 10px"
            >{{ scope.row.orderNo }}</a
          >
        </template>
      </el-table-column>
      <el-table-column prop="pay" label="金额" width="100">
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.type == 'X_SALE' ||
              scope.row.type == 'S_SALE' ||
              scope.row.type == 'X_PURCHASE' ||
              scope.row.type == 'S_PURCHASE'
            "
            style="color: green"
          >
            {{ scope.row.pay }}
          </div>
          <div v-else style="color: red">{{ scope.row.pay }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类别"
        width="100"
        :formatter="formatType"
      >
      </el-table-column>
      <el-table-column prop="voucherId" label="关联凭证ID" width="50">
      </el-table-column>
      <!-- <el-table-column prop="remark" label="备注" width="100">
      </el-table-column> -->
      <el-table-column prop="id" label="id" width="50"> </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="size"
        :total="total"
        style="float: right"
      >
      </el-pagination>
    </el-col>

  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getCustomerRecordListPage
} from "../../api/customerRecordApi";
import NProgress from "nprogress";
var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      showMoreQueryCondition: false,
      filters: {
        customerCode: "",
        type: "",
        dateFm: '',
        dateTo: '',
      },
      balance: 0,
      type: codemaster.BS_CUSTOMER_RECORD_TYPE,
      records: [],
      total: 0,
      page: 1,
      size: 10,
      listLoading: false,
      loading: true,
      sels: [], //列表选中列
      editLoading: false,
      queryRules: {
      }
    };
  },
  methods: {
    formatType: function (row, column) {
      return util.getComboNameByValue(
        codemaster.BS_CUSTOMER_RECORD_TYPE,
        row.type
      );
    },
    reset() {
      this.$refs["queryForm"].resetFields();
    },
    showMoreConditionHandler: function () {
      this.showMoreQueryCondition = !this.showMoreQueryCondition;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRecords();
    },
    //显示新增界面
    handleAdd: function () {
      this.editFormVisible = true;
      this.editForm = {
        id: 0,
        customerCode: "",
        abstractt: "",
        auxiId: 0,
        orderNo: "",
        pay: 0,
        type: "",
        voucherId: null,
        date: util.formatDate.format(new Date(), "yyyy-MM-dd"),
        remark: "",
      };
    },

    //获取用户列表
    getRecords() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};
          this.listLoading = true;
          getCustomerRecordListPage(para)
            .then((res) => {
              this.total = res.data.size;
					    this.records = res.data.list;
              this.listLoading = false;
            })
            .catch((data) => {
              this.listLoading = false;
              util.errorCallBack(data, this.$router, this.$message);
            });
        }
      });
    },
    orderDetail: function (index, row) {
      this.$store.commit("changeOutboundOrderNo", row.orderNo);
      this.$store.commit("changeCustomerRecordListPageFilters", this.filters);
      this.$store.commit("changeOutboundDetailFromPath", "/customerRecordListPage");
      this.$store.commit("changeOutboundStatus", "EDIT");
      this.$router.push({ path: "/outboundDetail" });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  mounted() {
    this.getRecords();
    this.filters = this.$store.state.customerRecord.filters;
    this.page = this.$store.state.customerRecord.page;
  },
};
</script>

<style scoped>
</style>