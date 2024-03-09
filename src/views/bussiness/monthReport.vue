<template>
  <section>
    <div v-title data-title="客户往来月报表"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form
        :inline="true"
        :model="filters"
        :rules="queryRules"
        ref="queryForm"
      >
        <el-row :gutter="0">
          <!-- <el-form-item label="客户" prop="customerCode">
            <popwin-button
              popKey="POP_CUSTOMER"
              :showName="true"
              v-model="filters.customerCode"
            ></popwin-button>
          </el-form-item> -->
          <el-form-item label="起始月份" prop="dateFm">
            <el-date-picker
              v-model="filters.dateFm"
              type="month"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="终点月份" prop="dateTo">
            <el-date-picker
              v-model="filters.dateTo"
              type="month"
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
      <el-table-column prop="customer_name" label="客户名称" >
      </el-table-column>
      <el-table-column prop="balance" label="余额" width="200">
      </el-table-column>
      <el-table-column prop="salePay" label="总销售额" width="200">
      </el-table-column>
      <el-table-column prop="receivePay" label="收到货款" width="200">
      </el-table-column>
      <el-table-column prop="disPay" label="差价与折扣" width="200">
      </el-table-column>
      <el-table-column prop="rePay" label="退货" width="200">
      </el-table-column>
      <el-table-column prop="freightPay" label="应扣运费" width="200">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <download-excel
        class="export-excel-wrapper"
        :data="records"
        :fields="json_fields"
        name="导出.xls"
      >
        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
        <el-button type="primary" size="small">导出EXCEL</el-button>
      </download-excel>
    </el-col>

    
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  monthReport
} from "../../api/customerRecordApi";
import NProgress from "nprogress";
var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      json_fields: {
        客户: "customer_name", //常规字段
        期末余额: "balance",
        总销售额: "salePay",
        收到货款: "receivePay",
        差价与折扣: "disPay",
        退货款: "rePay",
        应扣运费: "freightPay"
      },
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
    //获取用户列表
    getRecords() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          let para = {
            conditions: JSON.stringify(this.filters),
          };
          this.listLoading = true;
          monthReport(para)
            .then((res) => {
              this.records = res.data;
              this.listLoading = false;
            })
            .catch((data) => {
              this.listLoading = false;
              util.errorCallBack(data, this.$router, this.$message);
            });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  mounted() {
    // this.getRecords();
    let now = new Date(); //当前日期
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getFullYear(); //当前年
    //本月的开始时间
    let monthStartDate = nowMonth>1?monthStartDate = new Date(nowYear, nowMonth-1, 1):monthStartDate = new Date(nowYear-1, 12, 1);
    let monthEndDate = new Date(nowYear, nowMonth, 1);
    alert(monthStartDate);
    this.filters = this.$store.state.customerRecord.filters;
    if (this.filters.dateFm === null||this.filters.dateFm === '') {
      this.filters.dateFm = monthStartDate;
    }
    if (this.filters.dateTo === null||this.filters.dateTo === '') {
      this.filters.dateTo = monthEndDate;
    }
  },
};
</script>

<style scoped>
</style>