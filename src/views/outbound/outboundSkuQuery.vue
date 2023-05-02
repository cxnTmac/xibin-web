<template>
  <section>
    <div v-title data-title="出库单产品查询"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters" ref="queryForm">
        <el-row :gutter="0">
          <el-form-item label="客户" prop="areaName">
            <popwin-button
              popKey="POP_CUSTOMER"
              :showName="true"
              v-model="filters.buyerCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="产品" prop="areaCode">
            <popwin-button
              popKey="POP_SKU"
              v-model="filters.fittingSkuCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="filters.headerStatus"
              clearable
              placeholder="请选择 "
            >
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
          <el-form-item label="产品名称" prop="fittingSkuName">
            <el-input
              v-model="filters.fittingSkuName"
              placeholder="产品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="车型" prop="modelCode">
            <el-input v-model="filters.modelCode" placeholder="车型"></el-input>
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
        <!-- <el-row :gutter="0" v-if="showMoreQueryCondition"> -->
        <el-row :gutter="0">
          <el-form-item label="订单时间从" prop="orderTimeFm">
            <el-date-picker
              v-model="filters.orderTimeFm"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="订单时间到" prop="orderTimeTo">
            <el-date-picker
              v-model="filters.orderTimeTo"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="出库单类型" prop="outboundTypes">
            <el-select
              multiple
              v-model="filters.outboundTypes"
              placeholder="请选择 "
            >
              <el-option
                v-for="item in outboundTypes"
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
          <el-form-item label="备注" prop="remark">
            <el-input v-model="filters.remark" placeholder="备注"></el-input>
          </el-form-item>
        </el-row>
        <transition name="el-zoom-in-top"> </transition>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="records"
      border
      :span-method="objectSpanMethod"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      stripe
      style="width: 100%"
      :summary-method="getSummaries"
      show-summary
    >
      <!-- <el-table
      :data="records"
      border
      :span-method="objectSpanMethod"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      stripe
      style="width: 100%"
    > -->
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column prop="orderNo" label="出库单头信息" width="200">
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            @click="handleEdit(scope.$index, scope.row)"
            style="margin-left: 10px"
            >{{ scope.row.orderNo }}</a
          >
          <div>
            {{ formatHeaderStatus(scope.row.headerStatus) }}
          </div>
          <div>
            {{ formatOutboundType(scope.row.outboundType) }}
          </div>
          <div>
            {{ scope.row.buyerName }}
          </div>
          <div>
            {{ formatOrderTime(scope.row.orderTime) }}
          </div>
          <div>
            {{ "总价：" + totalPriceMap[scope.row.orderNo] }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="orderNo" label="出库单号" width="200">
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            @click="handleEdit(scope.$index, scope.row)"
            style="margin-left: 10px"
            >{{ scope.row.orderNo }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="headerStatus"
        label="状态"
        width="80"
        :formatter="formatHeaderStatus"
      >
      </el-table-column>
      <el-table-column
        prop="outboundType"
        label="出库单类别"
        width="80"
        :formatter="formatOutboundType"
      >
      </el-table-column>
      <el-table-column prop="buyerName" label="客户" width="150">
      </el-table-column>
      <el-table-column
        prop="orderTime"
        label="时间"
        width="100"
        :formatter="formatOrderTime"
      >
      </el-table-column> -->
      <el-table-column prop="lineNo" label="No" width="40"> </el-table-column>
      <el-table-column prop="fittingSkuName" label="产品" width="200">
      </el-table-column>
      <el-table-column prop="modelCode" label="车型" width="150">
      </el-table-column>
      <el-table-column prop="outboundNum" label="订货数" width="80">
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价" width="80">
      </el-table-column>
      <el-table-column prop="outboundAllocNum" label="分配数" width="80">
      </el-table-column>
      <el-table-column prop="outboundPickNum" label="拣货数" width="80">
      </el-table-column>
      <el-table-column prop="outboundShipNum" label="发货数" width="80">
      </el-table-column>
      <el-table-column prop="outboundPrice" label="单价" width="80">
      </el-table-column>
      <el-table-column prop="cost" label="成本" width="80"> </el-table-column>
      <el-table-column prop="totalCost" label="总成本" width="80">
        <template slot-scope="scope">
          {{ getTotalCost(scope.row.cost, scope.row.outboundNum) }}
        </template>
      </el-table-column>
      <el-table-column prop="fittingSkuCode" label="产品编码" width="80">
      </el-table-column>
      <el-table-column prop="quickCode" label="快捷编码" width="80">
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="操作" fixed="right" min-width="80">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <el-col :span="24" class="toolbar">
      <download-excel
        class="export-excel-wrapper"
        :data="records"
        :fields="json_fields"
        name="出库记录导出.xls"
      >
        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
        <el-button type="primary" size="small">导出EXCEL</el-button>
      </download-excel>
      <!--<el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>-->
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { queryWmOutboundDetailByPage } from "../../api/outboundApi";
import NProgress from "nprogress";
import NP from "number-precision";

var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      json_fields: {
        出库单号: "orderNo", //常规字段
        出库单时间: "orderTime",
        客户: "buyerName",
        出库类型: "outboundType",
        行号: "lineNo",
        产品编码: "fittingSkuCode",
        产品名称: "fittingSkuName",
        车型: "modelCode",
        单位: "uomDesc",
        数量: "outboundNum",
        单价: "outboundPrice",
        成本: "cost",
      },
      totalPriceMap: {},
      showMoreQueryCondition: false,
      status: codemaster.WM_OUTBOUND_STATUS,
      filters: {
        buyerCode: "",
        fittingSkuCode: "",
        fittingSkuName: "",
        modelCode: "",
        headerStatus: "",
        outboundTypes: [],
        orderTimeFm: null,
        orderTimeTo: null,
        remark: "",
      },
      outboundTypes: codemaster.WM_OUTBOUND_TYPE,
      records: [],
      total: 0,
      page: 1,
      size: 100,
      listLoading: false,
      loading: true,
      sels: [], //列表选中列
      orderGroup: [],
    };
  },
  methods: {
    getTotalCost(cost, num) {
      return NP.times(cost ? cost : 0, num ? num : 0);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index !== 4 && index !== 5 && index !== 11) {
          sums[index] = "";
          return;
        }
        let values = [];
        if (index === 11) {
          values = data.map((item) => {
            return NP.times(
              item.cost ? item.cost : 0,
              item.outboundNum ? item.outboundNum : 0
            );
          });
        } else if (index === 4 || index === 5) {
          values = data.map((item) => Number(item[column.property]));
        }
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return NP.plus(prev, curr);
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "N/A";
        }
      });
      return sums;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let i = this.arrayContains(this.orderGroup, rowIndex);
        if (i >= 0 && i < this.orderGroup.length - 1) {
          return {
            rowspan: this.orderGroup[i + 1] - this.orderGroup[i],
            colspan: 1,
          };
        } else if (i === this.orderGroup.length - 1) {
          return {
            rowspan: this.records.length - this.orderGroup[i],
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
    formatOrderTime: function (val) {
      if (val !== null) {
        let unixTimestamp = new Date(val);
        return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
      }
    },
    reset() {
      this.$refs["queryForm"].resetFields();
    },
    showMoreConditionHandler: function () {
      this.showMoreQueryCondition = !this.showMoreQueryCondition;
    },
    formatHeaderStatus: function (val) {
      return util.getComboNameByValue(codemaster.WM_OUTBOUND_STATUS, val);
    },
    formatOutboundType: function (val) {
      return util.getComboNameByValue(codemaster.WM_OUTBOUND_TYPE, val);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRecords();
    },
    updateOrderGroup: function () {
      let array = [];
      array.push(0);
      let sum = 0;
      let tongji = {};
      for (let i = 0; i < this.records.length - 1; i++) {
        sum = NP.plus(
          sum,
          this.records[i].totalPrice ? this.records[i].totalPrice : 0
        );
        if (this.records[i].orderNo !== this.records[i + 1].orderNo) {
          array.push(i + 1);
          tongji[this.records[i].orderNo] = sum;
          sum = 0;
        }
        if (i + 1 === this.records.length - 1) {
          tongji[this.records[i].orderNo] = NP.plus(
            sum,
            this.records[i + 1].totalPrice ? this.records[i + 1].totalPrice : 0
          );
        }
      }
      this.totalPriceMap = tongji;
      this.orderGroup = array;
    },
    arrayContains: function (array, num) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === num) return i;
      }
      return -1;
    },
    //获取数据
    getRecords() {
      let para = {
        // page: this.page,
        // size: this.size,
        conditions: JSON.stringify(this.filters),
      };
      this.listLoading = true;
      //NProgress.start();
      queryWmOutboundDetailByPage(para)
        .then((res) => {
          this.total = res.data.size;
          this.records = res.data.list;
          this.listLoading = false;
          this.updateOrderGroup();
          //NProgress.done();
        })
        .catch((data) => {
          this.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    handleEdit: function (index, row) {
      this.$store.commit("changeOutboundOrderNo", row.orderNo);
      this.$store.commit("changeOutboundSkuQueryFilters", this.filters);
      this.$store.commit("changeOutboundDetailFromPath", "/outboundSkuQuery");
      this.$store.commit("changeOutboundStatus", "EDIT");
      this.$router.push({ path: "/outboundDetail" });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  mounted() {
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
    this.getRecords();
  },
};
</script>

<style>
.el-table td,
.el-table th {
  vertical-align: top !important;
}
</style>
