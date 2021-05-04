<template>
  <section>
    <div v-title data-title="库存移动"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters" ref="queryForm">
        <el-row :gutter="0">
          <el-form-item label="产品" prop="skuCode">
            <popwin-button
              popKey="POP_SKU"
              :selectValue="filters.skuCode"
              v-model="filters.skuCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="库位" prop="locCode">
            <popwin-button
              popKey="POP_LOC"
              :selectValue="filters.locCode"
              v-model="filters.locCode"
            ></popwin-button>
          </el-form-item>
          <el-form-item label="产品名称" prop="skuName">
            <el-input
              v-model="filters.skuName"
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
      <el-table-column prop="skuCode" label="产品编码" width="80" sortable>
      </el-table-column>
      <el-table-column prop="skuName" label="产品名称" width="260" sortable>
      </el-table-column>
      <el-table-column prop="modelCode" label="车型" width="200" sortable>
      </el-table-column>
      <!--<el-table-column prop="lot" label="批次号" width="200" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="locCode" label="库位编码" width="120" sortable>
      </el-table-column>
      <el-table-column prop="allocNum" label="待分配数" width="80">
      </el-table-column>
      <el-table-column prop="invNum" label="库存数" width="80">
      </el-table-column>
      <el-table-column prop="invAvailableNum" label="可用数" width="80">
      </el-table-column>
      <el-table-column prop="price" label="单位价值" width="80">
        <template slot-scope="scope">
            {{getPerPrice(scope.row.totalPrice,scope.row.invAvailableNum)}}
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价值" width="80">
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="150">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleOperate(scope.$index, scope.row)"
            >移动</el-button
          >
          <el-button
            size="small"
            @click="handleTransfer(scope.$index, scope.row)"
            >转变</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="handleAdd">手动新增库存</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="size"
        :total="total"
        style="float: right"
      >
      </el-pagination>
    </el-col>

    <!--移动界面-->
    <el-dialog
      title="移动"
      :visible.sync="operateFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="operateForm"
        label-width="80px"
        :rules="operateFormRules"
        ref="operateForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品编码" prop="skuCode">
              <el-input
                v-model="operateForm.skuCode"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="skuName">
              <el-input
                v-model="operateForm.skuName"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="库位编码" prop="locCode">
              <el-input
                v-model="operateForm.locCode"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存可用数" prop="invAvailableNum">
              <el-input-number
                v-model="operateForm.invAvailableNum"
                :disabled="true"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="目标库位" prop="toLoc">
              <popwin-button
                popKey="POP_LOC"
                :selectValue="operateForm.toLoc"
                v-model="operateForm.toLoc"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="移动数" prop="moveNum">
              <el-input-number
                v-model="operateForm.moveNum"
                :min="0"
                :max="operateForm.invAvailableNum"
                label="输入要移动的数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="operateFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="moveSubmit"
          :loading="operateLoading"
          >执行移动</el-button
        >
      </div>
    </el-dialog>

    <!--移动界面-->
    <el-dialog
      title="移动"
      :visible.sync="transferFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="transferForm"
        label-width="80px"
        :rules="transferFormRules"
        ref="transferForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品编码" prop="skuCode">
              <el-input
                v-model="transferForm.skuCode"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="skuName">
              <el-input
                v-model="transferForm.skuName"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="库位编码" prop="locCode">
              <el-input
                v-model="transferForm.locCode"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存可用数" prop="invAvailableNum">
              <el-input-number
                v-model="transferForm.invAvailableNum"
                :disabled="true"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="目标库位" prop="toLoc">
              <popwin-button
                popKey="POP_LOC"
                :selectValue="transferForm.toLoc"
                v-model="transferForm.toLoc"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标产品" prop="toLoc">
              <popwin-button
                popKey="POP_SKU"
                :selectValue="transferForm.toSku"
                v-model="transferForm.toSku"
              ></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="转变数" prop="transferNum">
              <el-input-number
                v-model="transferForm.transferNum"
                :min="0"
                :max="transferForm.invAvailableNum"
                label="输入要移动的数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="transferFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="transferSubmit"
          :loading="transferLoading"
          >执行转变</el-button
        >
      </div>
    </el-dialog>
    <!--新增库存界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品编码" prop="toLoc">
              <popwin-button
                popKey="POP_SKU"
                :selectValue="addForm.skuCode"
                v-model="addForm.skuCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="skuName">
              <el-input
                v-model="addForm.skuName"
                auto-complete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="库位" prop="toLoc">
              <popwin-button
                popKey="POP_LOC"
                :selectValue="addForm.locCode"
                v-model="addForm.locCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存可用数" prop="invAvailableNum">
              <el-input-number
                v-model="addForm.invAvailableNum"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品价值" prop="price">
              <el-input-number
                v-model="addForm.price"
                :min="0"
                label="输入产品价值"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
          >新增库存</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getAvailbleInventoryListPage,
  move,
  transfer,
  add,
} from "../../api/inventoryApi";
import NProgress from "nprogress";
var codemaster = require("../../../static/codemaster.json");
import NP from "number-precision";
export default {
  data() {
    return {
      showMoreQueryCondition: false,
      filters: {
        skuCode: "",
        locCode: "",
      },
      records: [],
      total: 0,
      page: 1,
      size: 10,
      listLoading: false,
      loading: true,
      sels: [], //列表选中列

      operateFormVisible: false, //移动界面是否显示
      operateLoading: false,
      operateFormRules: {
        toLoc: [{ required: true, message: "请输入目标库位", trigger: "blur" }],
        moveNum: [
          {
            type: "number",
            required: true,
            message: "请输入移动数",
            trigger: "blur",
          },
        ],
      },
      //操作界面数据
      operateForm: {
        id: 0,
        skuCode: "",
        locCode: "",
        toLoc: "",
        moveNum: 0,
        invAvailableNum: 0,
      },
      transferFormVisible: false, //转移界面是否显示
      transferLoading: false,
      transferFormRules: {
        toSku: [{ required: true, message: "请输入目标产品", trigger: "blur" }],
        toLoc: [{ required: true, message: "请输入目标库位", trigger: "blur" }],
        tranferNum: [
          {
            type: "number",
            required: true,
            message: "请输入移动数",
            trigger: "blur",
          },
        ],
      },
      transferForm: {
        id: 0,
        skuCode: "",
        skuName: "",
        locCode: "",
        toLoc: "",
        toSku: "",
        transferNum: 0,
        invAvailableNum: 0,
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        skuCode: [{ required: true, message: "请输入产品", trigger: "blur" }],
        locCode: [{ required: true, message: "请输入库位", trigger: "blur" }],
        invAvailableNum: [
          {
            type: "number",
            required: true,
            message: "请输入库存可用数",
            trigger: "blur",
          },
        ],
      },
      addForm: {
        id: 0,
        skuCode: "",
        skuName: "",
        locCode: "",
        invAvailableNum: 0,
        price: 0,
      },
    };
  },
  methods: {
    reset() {
      this.$refs["queryForm"].resetFields();
    },
     getPerPrice(totalPrice,num){
      return NP.divide(totalPrice,num);
    },
    showMoreConditionHandler: function () {
      this.showMoreQueryCondition = !this.showMoreQueryCondition;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRecords();
    },
    //显示新中能界面
    handleAdd: function () {
      this.addFormVisible = true;
    },
    //显示操作界面
    handleOperate: function (index, row) {
      this.operateFormVisible = true;
      this.operateForm = Object.assign({}, row);
    },
    //移动操作提交
    moveSubmit: function () {
      let _this = this;
      this.$refs.operateForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.operateLoading = true;
            //NProgress.start();
            move({
              skuCode: this.operateForm.skuCode,
              locCode: this.operateForm.locCode,
              toLoc: this.operateForm.toLoc,
              moveNum: this.operateForm.moveNum,
            })
              .then((res) => {
                this.operateLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["operateForm"].resetFields();
                this.operateFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.operateLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    //显示操作界面
    handleTransfer: function (index, row) {
      this.transferFormVisible = true;
      this.transferForm = Object.assign({}, row);
    },
    transferSubmit: function () {
      let _this = this;
      this.$refs.transferForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.transferLoading = true;
            //NProgress.start();
            transfer({
              skuCode: this.transferForm.skuCode,
              locCode: this.transferForm.locCode,
              toLoc: this.transferForm.toLoc,
              toSku: this.transferForm.toSku,
              transferNum: this.transferForm.transferNum,
            })
              .then((res) => {
                this.transferLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["transferForm"].resetFields();
                this.transferFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.transferLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    addSubmit: function () {
      let _this = this;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            add({
              skuCode: this.addForm.skuCode,
              locCode: this.addForm.locCode,
              invAvailableNum: this.addForm.invAvailableNum,
              price: this.addForm.price,
            })
              .then((res) => {
                this.transferLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.addLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
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
      getAvailbleInventoryListPage(para)
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

<style scoped></style>
