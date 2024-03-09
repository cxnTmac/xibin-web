<template>
  <section>
    <div v-title data-title="对账"></div>
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
      <el-table-column type="selection" width="55"> </el-table-column>

      <!-- <el-table-column prop="customerCode" label="客户编码" width="150">
      </el-table-column> -->
      <el-table-column prop="date" label="日期时间" width="100">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="200">
      </el-table-column>
      <el-table-column prop="abstractt" label="摘要" width="200">
      </el-table-column>
      <el-table-column prop="orderNo" label="关联单据号" width="150">
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
      <el-table-column prop="balance" :label="getBalanceLabel" width="150">
      </el-table-column>
      <el-table-column prop="voucherId" label="关联凭证ID" width="50">
      </el-table-column>
      <!-- <el-table-column prop="remark" label="备注" width="100">
      </el-table-column> -->
      <el-table-column prop="id" label="id" width="50"> </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <!-- <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="size"
        :total="total"
        style="float: right"
      >
      </el-pagination> -->
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="客户" prop="customerCode">
              <popwin-button
                popKey="POP_CUSTOMER"
                :showName="true"
                @changeValue="editFormCustomerChangeValue"
                :displayName="editForm.customerName"
                v-model="editForm.customerCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联单据号" prop="orderNo">
              <el-input
                v-model="editForm.orderNo"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="摘要" prop="abstractt">
              <el-input
                v-model="editForm.abstractt"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="金额" prop="pay">
              <el-input v-model="editForm.pay" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别" prop="type">
              <el-select
                v-model="editForm.type"
                clearable
                placeholder="请选择 "
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
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="editForm.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="辅助核算ID" prop="orderNo">
              <el-input
                disabled
                v-model="editForm.auxiId"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getCustomerRecordListPage,
  saveCustomerRecord,
  removeCustomerRecord,
  getCustomerRecordListByCustomer,
} from "../../api/customerRecordApi";
import NProgress from "nprogress";
import NP from "number-precision";
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
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      queryRules: {
        customerCode: [
          { required: true, message: "请输入客户", trigger: "blur" },
        ],
      },
      editFormRules: {
        customerCode: [
          { required: true, message: "请输入客户", trigger: "blur" },
        ],
      },
      //编辑界面数据
      editForm: {
        id: 0,
        customerCode: "",
        abstractt: "",
        auxiId: 0,
        orderNo: "",
        pay: 0,
        type: "",
        voucherId: 0,
        date: util.formatDate.format(new Date(), "yyyy-MM-dd"),
        remark: "",
      },
    };
  },
  computed:{
    getBalanceLabel:function(){
      return "余额："+this.balance;
    }
  },
  methods: {
    editFormCustomerChangeValue(row) {
      this.editForm.auxiId = row.auxiId;
    },
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
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
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
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.listLoading = true;
        NProgress.start();
        let para = { id: row.id };
        removeCustomerRecord(para)
          .then((res) => {
            this.listLoading = false;
            NProgress.done();
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getRecords();
          })
          .catch((data) => {
            this.listLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    //编辑
    editSubmit: function () {
      let _this = this;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            saveCustomerRecord({ customerRecord: JSON.stringify(para) })
              .then((res) => {
                this.editLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.editLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },

    //获取用户列表
    getRecords() {
      let _this = this;
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          let para = {
            conditions: JSON.stringify(_this.filters),
          };
          _this.listLoading = true;
          getCustomerRecordListByCustomer(para)
            .then((res) => {
              if (res.data.code == 200) {
                _this.records = res.data.data.list;
                _this.balance = res.data.data.balance;
                _this.calculateBalance();
              } else {
                this.$message.error(res.data.msg);
              }
              _this.listLoading = false;
            })
            .catch((data) => {
              _this.listLoading = false;
              util.errorCallBack(data, _this.$router, _this.$message);
            });
        }
      });
    },
    orderDetail: function (index, row) {
      if(row.orderNo.indexOf("OUB")>=0){
        this.$store.commit("changeOutboundOrderNo", row.orderNo);
        this.$store.commit("changeCustomerRecordFilters", this.filters);
        this.$store.commit("changeOutboundDetailFromPath", "/customerRecord");
        this.$store.commit("changeOutboundStatus", "EDIT");
        this.$router.push({ path: "/outboundDetail" });
      }
      if(row.orderNo.indexOf("INB")>=0){
        this.$store.commit("changeInboundOrderNo", row.orderNo);
        this.$store.commit("changeCustomerRecordFilters", this.filters);
        this.$store.commit("changeInboundDetailFromPath", "/customerRecord");
        this.$store.commit("changeInboundStatus", "EDIT");
        this.$router.push({ path: "/inboundDetail" });
      }
      
    },
    calculateBalance() {
      let _this = this;
      let balanceX = _this.balance;
      this.records.forEach((record) => {
        if(record.pay ===305){
          debugger;
        }
        if (
          record.type === "X_SALE" ||
          record.type === "S_SALE" ||
          record.type === "X_PURCHASE" ||
          record.type === "S_PURCHASE"
        ) {
          //balanceX += record.pay;
          balanceX = NP.plus(balanceX,record.pay);
        } else if (record.type === "FREIGHT_PAID") {
          // 如果是我方付运费，不计入对方账本中
          balanceX = balanceX;
        } else {
          //balanceX -= record.pay;
          balanceX = NP.minus(balanceX,record.pay);
        }
        record.balance = balanceX;
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  mounted() {
    // this.getRecords();
    this.filters = this.$store.state.customerRecord.filters;
    this.page = this.$store.state.customerRecord.page;
  },
};
</script>

<style scoped>
</style>