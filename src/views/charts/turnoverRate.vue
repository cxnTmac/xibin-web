<template>
  <section>
    <div v-title data-title="库存周转率"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters" ref="queryForm">
        <el-row :gutter="0">
          <el-form-item label="产品名称" prop="fittingSkuName">
            <el-input
              v-model="filters.fittingSkuName"
              placeholder="产品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="车型" prop="modelCode">
            <el-input v-model="filters.modelCode" placeholder="车型"></el-input>
          </el-form-item>
          <el-form-item label="配件类型" prop="fittingTypeCode">
            <popwin-button
              popKey="POP_FITTINGTYPE"
              :showName="true"
              :displayName="filters.fittingTypeName"
              v-model="filters.fittingTypeCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="库存数大于" prop="invFm">
            <el-input
              v-model="filters.invFm"
            ></el-input>
          </el-form-item>
          <el-form-item label="总出库小于" prop="oubTo">
            <el-input
              v-model="filters.oubTo"
            ></el-input>
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
	  border
      :data="records"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      stripe
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="skuCode" label="产品编码" width="100" >
      </el-table-column>
      <el-table-column prop="skuName" label="产品名称" width="200" >
      </el-table-column>
      <el-table-column prop="modelCode" label="车型" width="200" >
      </el-table-column>
      <el-table-column prop="INB" label="总入库数" width="100" >
      </el-table-column>
      <el-table-column prop="ASS" label="总加工数" width="100" >
      </el-table-column>
      <el-table-column prop="OUB" label="总出库数" width="100" >
      </el-table-column>
	    <el-table-column prop="INV" label="当前库存" width="100" >
      </el-table-column>
      <el-table-column prop="INVPRICE" label="库存价值" width="100" >
      </el-table-column>
      <el-table-column prop="DAYS" label="已销售天数" width="100" >
      </el-table-column>
      <el-table-column prop="OUBDAYS" label="预计清仓天数" width="100" >
      </el-table-column>
      <el-table-column prop="ROT" label="周转率" >
      </el-table-column>
      <!-- <el-table-column label="操作" fixed="right" min-width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
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
import { turnoverRate } from "../../api/chartsApi";
import NProgress from "nprogress";
var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      showMoreQueryCondition: false,
      filters: {
        fittingSkuName: "",
        modelCode: "",
        fittingTypeCode: "",
        fittingTypeName: "",
        oubTo:null,
		    invFm:0
      },
      records: [],
      total: 0,
      page: 1,
      size: 10,
      listLoading: false,
      loading: true,
      sels: [],
    };
  },
  methods: {
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
      let para = {
        page: this.page,
        size: this.size,
        conditions: JSON.stringify(this.filters),
      };
      this.listLoading = true;
      //NProgress.start();
      turnoverRate(para)
        .then((res) => {
          this.total = res.data.size;
          this.records = res.data.list;
          this.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
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

<style scoped>
</style>