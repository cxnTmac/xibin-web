<template>
  <section>
    <div v-title data-title="入库单产品查询"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters" ref="queryForm">
        <el-row :gutter="0">
          <el-form-item label="供应商" prop="areaName">
            <popwin-button
              popKey="POP_CUSTOMER"
              :showName="true"
              v-model="filters.supplierCode"
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
            <el-input
              v-model="filters.modelCode"
              placeholder="车型"
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="el-icon-caret-bottom"
            v-on:click="showMoreConditionHandler"
          >
          </el-button>
          <el-button type="danger" style="float: right" @click="reset"
            >重置</el-button
          >
          <el-button type="primary" style="float: right" v-on:click="getRecords"
            >查询</el-button
          >
        </el-row>
        <el-row :gutter="0" >
          <el-form-item label="订单时间从" prop="orderTimeFm">
            <el-date-picker
              v-model="filters.orderTimeFm"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="订单时间到" prop="orderTimeTo">
            <el-date-picker
              v-model="filters.orderTimeTo"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
          </el-form-item>
          <el-form-item label="入库单类型" prop="inboundTypes">
            <el-select
              multiple 
              v-model="filters.inboundTypes"
              placeholder="请选择 "
            >
              <el-option
                v-for="item in inboundTypes"
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
        </el-row>
        <transition name="el-zoom-in-top">
          <el-row :gutter="0" v-if="showMoreQueryCondition">
          
          </el-row>
        </transition>
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
    >
      <!-- <el-table-column type="selection" width="40"></el-table-column> -->
      <!-- <el-table-column prop="orderNo" label="入库单号" width="200" sortable>
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            @click="handleEdit(scope.$index, scope.row)"
            style="margin-left: 10px"
            >{{ scope.row.orderNo }}</a
          >
        </template>
      </el-table-column> -->
      <el-table-column prop="orderNo" label="入库单头信息" width="200">
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
            {{ formatInboundType(scope.row.inboundType) }}
          </div>
          <div>
            {{ scope.row.supplierName }}
          </div>
          <div>
            {{ formatOrderTime(scope.row.orderTime) }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="headerStatus"
        label="状态"
        width="80"
        :formatter="formatHeaderStatus"
      >
      </el-table-column>
      <el-table-column
        prop="inboundType"
        label="类别"
        width="80"
        :formatter="formatInboundType"
      >
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="150">
      </el-table-column> -->
      <el-table-column prop="lineNo" label="No" width="40"> </el-table-column>
      <el-table-column prop="fittingSkuName" label="产品" width="200">
      </el-table-column>
      <el-table-column prop="modelCode" label="车型" width="150">
      </el-table-column>
      <el-table-column prop="inboundPreNum" label="预收" width="80">
      </el-table-column>
      <el-table-column prop="inboundNum" label="实收" width="80">
      </el-table-column>
      <el-table-column prop="inboundPrice" label="价格" width="80">
      </el-table-column>
      <el-table-column prop="uomDesc" label="单位" width="50">
      </el-table-column>
      <el-table-column prop="fittingSkuCode" label="产品编码" width="80">
      </el-table-column>
      <el-table-column prop="quickCode" label="快捷编码" width="80">
      </el-table-column>
      <el-table-column prop="isCrossDock" label="是否临时调货" width="80">
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

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <download-excel
        class="export-excel-wrapper"
        :data="records"
        :fields="json_fields"
        name="入库记录导出.xls"
      >
        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
        <el-button type="primary" size="small">导出EXCEL</el-button>
      </download-excel>
      <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
      <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
      <!-- <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="size"
        :total="total"
        style="float: right"
      >
      </el-pagination> -->
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { queryWmInboundDetailByPage } from "../../api/inboundApi";
import NProgress from "nprogress";

var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      json_fields: {
        入库单号: "orderNo", //常规字段
        供应商: "supplierName", //支持嵌套属性
        入库类型: "inboundType",
        行号: "lineNo",
        产品编码: "fittingSkuCode",
        产品名称: "fittingSkuName",
        车型: "modelCode",
        单位: "uomDesc",
        数量: "inboundNum",
        单价: "inboundPrice",
      },
      showMoreQueryCondition: false,
      status: codemaster.WM_INBOUND_STATUS,
      inboundTypes: codemaster.WM_INBOUND_TYPE,
      filters: {
        supplierCode: "",
        fittingSkuCode: "",
        fittingSkuName: "",
        modelCode:"",
        headerStatus: "",
        inboundTypes:[],
        orderTimeFm:"",
        orderTimeTo:""
      },
      records: [],
      total: 0,
      page: 1,
      size: 30,
      listLoading: false,
      loading: true,
      sels: [], //列表选中列
      orderGroup: [],
    };
  },
  methods: {
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
    reset() {
      this.$refs["queryForm"].resetFields();
    },
    showMoreConditionHandler: function () {
      this.showMoreQueryCondition = !this.showMoreQueryCondition;
    },
    formatOrderTime: function (val) {
      if (val !== null) {
        let unixTimestamp = new Date(val);
        return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatHeaderStatus: function (val) {
      return util.getComboNameByValue(codemaster.WM_INBOUND_STATUS, val);
    },
    formatInboundType: function (val) {
      return util.getComboNameByValue(codemaster.WM_INBOUND_TYPE, val);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRecords();
    },
    updateOrderGroup: function () {
      let array = [];
      array.push(0);
      for (let i = 0; i < this.records.length - 1; i++) {
        if (this.records[i].orderNo !== this.records[i + 1].orderNo) {
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
    //获取数据
    getRecords() {
      let para = Object.assign({}, this.filters);
      // let inboundTypes = this.filters.inboundTypes.map(function (elem, index) {
      //     return elem;
      // }).join(",");
      // para.inboundTypes = inboundTypes;
      this.listLoading = true;
      queryWmInboundDetailByPage({
        conditions: JSON.stringify(para),
      })
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
      this.$store.commit("changeInboundOrderNo", row.orderNo);
      this.$store.commit("changeInboundStatus", "EDIT");
      this.$store.commit("changeInboundDetailFromPath", "/inboundSkuQuery");
      this.$router.push({ path: "/inboundDetail" });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  mounted() {
    this.getRecords();
  },
};
</script>

<style scoped></style>
