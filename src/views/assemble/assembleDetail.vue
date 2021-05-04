<template>
  <section>
    <div v-title data-title="组装单详细"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button
        type="primary"
        :disabled="btnAuditStatus"
        @click="audit"
        :loading="pageControl.auditBtnLoading"
        >审核</el-button
      >
      <el-button
        type="danger"
        :disabled="btnCancelAuditStatus"
        @click="cancelAudit"
        :loading="pageControl.cancelAuditBtnLoading"
        >取消审核</el-button
      >
      <el-button
        type="primary"
        :disabled="btnCreateSDetailStatus"
        @click="createSDetail"
        :loading="pageControl.createSDetailBtnLoading"
        >生成子件</el-button
      >
      <el-button
        type="danger"
        :disabled="btnCancelCreateSDetailStatus"
        @click="cancelCreateSDetail"
        :loading="pageControl.cancelCreateSDetailBtnLoading"
        >取消生成子件</el-button
      >
      <el-button type="primary" style="float: right" @click="printPickUpOrder"
        >打印拣货单</el-button
      >
      <el-button @click="back" style="float: right">返回</el-button>
    </el-col>

    <el-form
      :model="orderHeader"
      label-width="80px"
      :rules="orderHeaderRules"
      ref="orderHeader"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-row :gutter="0">
            <span style="line-height: 36px">基本信息</span>

            <el-button
              type="primary"
              style="float: right"
              :disabled="btnSaveHeaderStatus"
              @click="save"
              :loading="pageControl.saveBtnLoading"
              >保存单头</el-button
            >
          </el-row>
        </div>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="组装单号" prop="orderNo">
              <el-input
                v-model="orderHeader.orderNo"
                disabled
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="orderHeader.status"
                disabled
                placeholder="请选择"
              >
                <el-option
                  v-for="item in assembleStatus"
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
          <el-col :span="6">
            <el-form-item label="订单时间" prop="orderTime">
              <el-date-picker
                v-model="orderHeader.orderTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
              <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="组装类型" prop="assembleType">
              <el-select
                v-model="orderHeader.assembleType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in assembleType"
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
              <!--<el-input v-model="orderHeader.inboundType" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="审核状态" prop="auditStatus">
              <el-select
                v-model="orderHeader.auditStatus"
                disabled
                placeholder="请选择"
              >
                <el-option
                  v-for="item in auditStatus"
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
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核时间" prop="auditDate">
              <el-date-picker
                v-model="orderHeader.auditDate"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核人" prop="auditor">
              <el-input
                v-model="orderHeader.auditor"
                disabled
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="orderHeader.remark"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 15px">父件明细</span>
      </div>
      <el-table
        :data="fDetailGrid.fDetail"
        border
        highlight-current-row
        v-loading="fDetailGrid.listLoading"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column prop="lineNo" label="行号" width="50">
        </el-table-column>

        <el-table-column prop="fittingSkuCode" label="产品编码" width="80">
        </el-table-column>
        <el-table-column prop="fittingSkuName" label="产品名称" width="200">
        </el-table-column>
        <el-table-column prop="modelCode" label="车型" width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          :formatter="formatStatus"
        >
        </el-table-column>
        <el-table-column prop="preNum" label="预组装数" width="60">
        </el-table-column>
        <el-table-column prop="num" label="组装数" width="60">
        </el-table-column>
        <el-table-column prop="assembleLoc" label="计划库位" width="80">
        </el-table-column>
        <el-table-column prop="orderNo" label="组装单号" width="200">
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
        <!--</el-table-column>-->

        <el-table-column label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleFDetailEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              :disabled="btnFDetailGridDelStatus"
              size="small"
              @click="handleFDetailDel(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button
          type="primary"
          :disabled="btnFDetailGridAddStatus"
          @click="addFDetailHandler"
          >新增</el-button
        >
        <!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
        <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange" :page-size="detailGrid.size" :total="detailGrid.total" style="float:right;">-->
        <!--</el-pagination>-->
      </el-col>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 15px">子件明细</span>
      </div>
      <el-table
        :data="sDetailGrid.sDetail"
        border
        :row-class-name="tableRowClassName"
        v-loading="sDetailGrid.listLoading"
        @selection-change="sDetailSelsChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column prop="fLineNo" label="父件行号" width="50">
        </el-table-column>
        <el-table-column prop="lineNo" label="行号" width="50">
        </el-table-column>

        <el-table-column prop="fittingSkuCode" label="产品编码" width="80">
        </el-table-column>
        <el-table-column prop="fittingSkuName" label="产品名称" width="200">
        </el-table-column>
        <el-table-column prop="modelCode" label="车型" width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          :formatter="formatStatus"
        >
        </el-table-column>
        <el-table-column prop="num" label="数量" width="60"> </el-table-column>
        <el-table-column prop="allocNum" label="分配数" width="60">
        </el-table-column>
        <el-table-column prop="pickNum" label="拣货数" width="60">
        </el-table-column>
        <el-table-column prop="assembleNum" label="组装数" width="60">
        </el-table-column>
        <el-table-column prop="assembleLoc" label="计划库位" width="120">
        </el-table-column>
        <el-table-column prop="orderNo" label="组装单号" width="200">
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
        <!--</el-table-column>-->

        <el-table-column label="操作" fixed="right" min-width="175">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleSDetailAlloc(scope.$index, scope.row)"
              >分配</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleSDetailCancelAlloc(scope.$index, scope.row)"
              >取消分配</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button
          type="primary"
          @click="batchAlloc"
          :loading="pageControl.batchAllocLoading"
          :disabled="this.sDetailGrid.sels.length === 0"
          >批量分配</el-button
        >
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentSDetailChange"
          :page-size="sDetailGrid.size"
          :total="sDetailGrid.total"
          style="float: right"
        >
        </el-pagination>
      </el-col>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 15px">子件分配明细</span>
      </div>
      <el-table
        :data="allocGrid.alloc"
        border
        highlight-current-row
        v-loading="allocGrid.listLoading"
        stripe
        @selection-change="allocSelsChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column prop="slineNo" label="子件行号" width="50">
        </el-table-column>
        <el-table-column prop="allocId" label="分配ID" width="200">
        </el-table-column>
        <el-table-column prop="fittingSkuCode" label="产品编码" width="80">
        </el-table-column>
        <el-table-column prop="fittingSkuName" label="产品名称" width="200">
        </el-table-column>
        <el-table-column prop="modelCode" label="车型" width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          :formatter="formatStatus"
        >
        </el-table-column>
        <el-table-column prop="allocLoc" label="分配库位" width="120">
        </el-table-column>
        <el-table-column prop="allocNum" label="分配数" width="60">
        </el-table-column>
        <el-table-column prop="toLoc" label="加工库位" width="120">
        </el-table-column>
        <el-table-column prop="pickTime" label="拣货时间" width="200">
        </el-table-column>
        <el-table-column prop="orderNo" label="组装单号" width="200">
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
        <!--</el-table-column>-->

        <el-table-column label="操作" fixed="right" min-width="175">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleSDetailAllocPick(scope.$index, scope.row)"
              >拣货</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleSDetailCancelAllocPick(scope.$index, scope.row)"
              >取消拣货</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-button
          type="primary"
          @click="batchPick"
          :loading="pageControl.batchPickLoading"
          :disabled="this.allocGrid.sels.length === 0"
          >批量拣货</el-button
        >
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentSDetailAllocChange"
          :page-size="allocGrid.size"
          :total="allocGrid.total"
          style="float: right"
        >
        </el-pagination>
      </el-col>
    </el-card>
    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="pageControl.fDetailEditFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="fDetailGrid.editForm"
        label-width="80px"
        :rules="fDetailGrid.editFormRules"
        ref="fDetailEditForm"
      >
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="行号" prop="inboundPreNum">
              <el-input
                v-model="fDetailGrid.editForm.lineNo"
                :disabled="true"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" :offset="6">
            <el-form-item label="产品" prop="skuCode">
              <popwin-button
                popKey="POP_SKU"
                :staticCondition="fSkuCondtion"
                :selectValue="fDetailGrid.editForm.fittingSkuCode"
                v-model="fDetailGrid.editForm.fittingSkuCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="fDetailGrid.editForm.status"
                :disabled="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in assembleStatus"
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
          <el-col :span="12">
            <el-form-item label="预组装数" prop="preNum">
              <el-input-number
                v-model="fDetailGrid.editForm.preNum"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已组装数" prop="num">
              <el-input-number
                v-model="fDetailGrid.editForm.num"
                :disabled="true"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="组装库位" prop="assembleLoc">
              <popwin-button
                popKey="POP_LOC"
                :staticCondition="assembleLocCondition"
                :selectValue="fDetailGrid.editForm.assembleLoc"
                v-model="fDetailGrid.editForm.assembleLoc"
              ></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品库存库位" prop="toLoc">
              <popwin-button
                popKey="POP_LOC"
                :staticCondition="{ useType: 'RS' }"
                :selectValue="fDetailGrid.editForm.toLoc"
                v-model="fDetailGrid.editForm.toLoc"
              ></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="组装数" prop="num">
              <el-input-number
                v-model="fDetailGrid.editForm.toAssembleNum"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="fDetailGrid.editForm.remark"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="pageControl.fDetailEditFormVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="btnFDetailEditSubmitStatus"
          @click.native="fDetailEditSubmit"
          :loading="pageControl.fDetailEditBtnLoading"
          >提交</el-button
        >
        <el-button
          type="primary"
          :disabled="btnFDetailAssembleStatus"
          @click.native="fDetailAssemble"
          :loading="pageControl.fDetailAssembleBtnLoading"
          >组装确认</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import NProgress from "nprogress";
import {
  saveAssembleOrder,
  saveAssembleFDetail,
  removeAssembleFDetail,
  audit,
  cancelAudit,
  getAssembleOrderHeader,
  getAssembleFDetailList,
  getAssembleSDetailList,
  getAllAssembleAllocList,
  createAssembleSDetailByOrderNo,
  cancelCreateByOrderNo,
  allocByOrderNoAndLineNo,
  cancelAllocByOrderNoAndLineNo,
  pickByAlloc,
  cancelPickByAlloc,
  assemble,
  allocByOrderNoAndLineNos,
  pickByAllocIds,
} from "../../api/assembleApi";
var codemaster = require("../../../static/codemaster.json");
export default {
  data() {
    return {
      fSkuCondtion: { needToAssemble: "Y" },
      assembleLocCondition: { useType: "KT" },
      orderHeader: {
        id: "",
        orderNo: "",
        assembleType: "",
        status: "",
        auditStatus: "",
        auditor: "",
        auditDate: "",
        orderTime: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        remark: "",
        creator: "",
        createTime: "",
        modifier: "",
        modifyTime: "",
        rec_ver: "",
        companyId: "",
        warehouseId: "",
      },
      fDetailGrid: {
        editForm: {
          id: "",
          orderNo: "",
          lineNo: "",
          fittingSkuCode: "",
          status: "",
          preNum: 0,
          num: 0,
          assembleLoc: "",
          toLoc: "",
          remark: "",
          creator: "",
          createTime: "",
          modifier: "",
          modifyTime: "",
          rec_ver: "",
          companyId: "",
          warehouseId: "",
          toAssembleNum: 0,
        },
        editFormRules: {
          assembleLoc: [
            { required: true, message: "请选择组装库位", trigger: "blur" },
          ],
          toLoc: [
            {
              required: true,
              message: "请选择成品库位",
              trigger: "blur",
            },
          ],
        },
        fDetail: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
      },
      sDetailGrid: {
        editForm: {
          id: "",
          remark: "",
          creator: "",
          createTime: "",
          modifier: "",
          modifyTime: "",
          rec_ver: "",
          companyId: "",
          warehouseId: "",
        },
        editFormRules: {},
        sDetail: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
      },
      sDetailAllocGrid: {
        editForm: {
          id: "",
          remark: "",
          creator: "",
          createTime: "",
          modifier: "",
          modifyTime: "",
          rec_ver: "",
          companyId: "",
          warehouseId: "",
        },
        editFormRules: {},
        sDetailAlloc: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
      },
      pageControl: {
        saveBtnLoading: false,
        auditBtnLoading: false,
        cancelAuditBtnLoading: false,
        fDetailEditFormVisible: false,
        fDetailAssembleFormVisible: false,
        fDetailEditBtnLoading: false,
        createSDetailBtnLoading: false,
        cancelCreateSDetailBtnLoading: false,
        recEditFormVisible: false,
        recEditLoading: false,
        cancelRecEditLoading: false,
        fDetailAssembleBtnLoading: false,
        batchPickLoading: false,
        batchAllocLoading: false,
      },
      allocGrid: {
        editForm: {
          id: "",
          remark: "",
          creator: "",
          createTime: "",
          modifier: "",
          modifyTime: "",
          rec_ver: "",
          companyId: "",
          warehouseId: "",
        },
        editFormRules: {},
        alloc: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
      },
      orderHeaderRules: {
        assembleType: [
          { required: true, message: "请选择组装类别", trigger: "blur" },
        ],
        orderTime: [
          {
            type: "string",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      assembleStatus: codemaster.WM_ASSEMBLE_STATUS,
      assembleType: codemaster.WM_ASSEMBLE_TYPE,
      auditStatus: codemaster.SYS_AUDIT_STATUS,
    };
  },
  computed: {
    btnSaveHeaderStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnAuditStatus: function () {
      if (this.orderHeader.id === "") {
        return true;
      }
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnCancelAuditStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      } else if (this.orderHeader.status === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnFDetailEditSubmitStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnFDetailAssembleStatus: function () {
      if (
        this.orderHeader.status === "00" ||
        this.orderHeader.status === "70"
      ) {
        return true;
      } else {
        return false;
      }
    },
    btnFDetailGridAddStatus: function () {
      if (this.orderHeader.id === "") {
        return true;
      }
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnFDetailGridDelStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnCreateSDetailStatus: function () {
      if (
        this.orderHeader.auditStatus !== "00" &&
        this.orderHeader.status === "00"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnCancelCreateSDetailStatus: function () {
      if (
        this.orderHeader.auditStatus !== "00" &&
        this.orderHeader.status === "10"
      ) {
        if(this.allocGrid.alloc.length>0){
          return true;
        }else{
          return false;
        }
      } else {
        return true;
      }
    },
    orderNo: function () {
      return this.$store.state.assembleDetail.orderNo;
    },
    status: function () {
      return this.$store.state.assembleDetail.status;
    },
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.status === "00" || row.status === "20") {
        return "un-alloc-row";
      }else if(row.status === "40"){
        return "part-row";
      }
      return "";
    },
    allocSelsChange: function (sels) {
      this.allocGrid.sels = sels;
    },
    sDetailSelsChange: function (sels) {
      this.sDetailGrid.sels = sels;
    },
    handleCurrentSDetailChange(val) {
      this.sDetailGrid.page = val;
      this.getAssembleSDetail();
    },
    handleCurrentSDetailAllocChange(val) {
      this.allocGrid.page = val;
      this.getAllAssembleAlloc();
    },
    printPickUpOrder() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      window.open(
        "/xibin/ReportServer?reportlet=assemblePickUp.cpt&orderNo=" +
          this.orderHeader.orderNo +
          "&companyId=" +
          user.companyId +
          "&warehouseId=" +
          user.warehouseId
      );
    },
    formatTime: function (row, column) {
      if (row[column.property] !== null) {
        let unixTimestamp = new Date(row[column.property]);
        return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatStatus: function (row, column) {
      return util.getComboNameByValue(
        codemaster.WM_ASSEMBLE_STATUS,
        row.status
      );
    },
    save() {
      this.$refs.orderHeader.validate((valid) => {
        if (valid) {
          this.pageControl.saveBtnLoading = true;
          saveAssembleOrder({ order: JSON.stringify(this.orderHeader) }).then(
            (res) => {
              this.pageControl.saveBtnLoading = false;
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
              } else {
                this.$message.error(res.data.msg);
              }
              this.orderHeader = Object.assign({}, res.data.data);
              this.$store.commit(
                "changeInboundOrderNo",
                this.orderHeader.orderNo
              );
              this.$store.commit("changeInboundStatus", "EDIT");
            }
          );
        }
      });
    },
    handleFDetailEdit(index, row) {
      this.fDetailGrid.editForm = {};
      this.pageControl.fDetailEditFormVisible = true;
      this.fDetailGrid.editForm = Object.assign({}, row);
      this.fDetailGrid.editForm.toAssembleNum = 0;
    },
    addFDetailHandler() {
      this.fDetailGrid.editForm = {
        id: "",
        orderNo: this.orderHeader.orderNo,
        lineNo: "",
        status: "00",
        fittingSkuCode: "",
        preNum: 0,
        num: 0,
        assembleLoc: "",
        toLoc: "",
        remark: "",
        creator: "",
        createTime: "",
        modifier: "",
        modifyTime: "",
        rec_ver: "",
        companyId: "",
        warehouseId: "",
        toAssembleNum: 0,
      };
      this.pageControl.fDetailEditFormVisible = true;
    },
    fDetailEditSubmit() {
      let _this = this;
      this.$refs.fDetailEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.pageControl.fDetailEditBtnLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.fDetailGrid.editForm);
            saveAssembleFDetail({ fDetail: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.fDetailEditBtnLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["fDetailEditForm"].resetFields();
                this.pageControl.fDetailEditFormVisible = false;
                this.getAssembleFDetail();
              })
              .catch((data) => {
                this.pageControl.fDetailEditBtnLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    fDetailAssemble() {
      let para = {
        orderNo: this.fDetailGrid.editForm.orderNo,
        lineNo: this.fDetailGrid.editForm.lineNo,
        assembleNum: this.fDetailGrid.editForm.toAssembleNum,
      };
      assemble(para)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.orderHeader = Object.assign({}, res.data.data);
            this.getAssembleFDetail();
            this.getAssembleSDetail();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    handleFDetailDel(index, row) {
      this.$confirm("确认删除记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        //NProgress.start();
        let para = { orderNo: row.orderNo, lineNo: row.lineNo };
        removeAssembleFDetail(para)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getAssembleFDetail();
          })
          .catch((data) => {
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    handleSDetailAlloc(index, row) {
      allocByOrderNoAndLineNo({
        orderNo: this.orderHeader.orderNo,
        lineNo: row.lineNo,
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            //                        this.orderHeader = Object.assign({}, res.data.data);
            this.getAssembleSDetail();
            this.getAllAssembleAlloc();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    handleSDetailCancelAlloc(index, row) {
      cancelAllocByOrderNoAndLineNo({
        orderNo: this.orderHeader.orderNo,
        lineNo: row.lineNo,
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            //                        this.orderHeader = Object.assign({}, res.data.data);
            this.getAssembleSDetail();
            this.getAllAssembleAlloc();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    batchPick() {
      var allocIds = "";
      allocIds = this.allocGrid.sels
        .map(function (elem, index) {
          return elem.allocId;
        })
        .join(",");
      pickByAllocIds({ allocIds: allocIds })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getAssembleSDetail();
            this.getAllAssembleAlloc();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    batchAlloc() {
      var lineNos = "";
      lineNos = this.sDetailGrid.sels
        .map(function (elem, index) {
          return elem.lineNo;
        })
        .join(",");
      allocByOrderNoAndLineNos({
        orderNo: this.orderHeader.orderNo,
        lineNos: lineNos,
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getAssembleSDetail();
            this.getAllAssembleAlloc();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    handleSDetailAllocPick(index, row) {
      let para = Object.assign({}, row);
      pickByAlloc({ alloc: JSON.stringify(para) })
        .then((res) => {
          //NProgress.done();
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.getAssembleSDetail();
          this.getAllAssembleAlloc();
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    handleSDetailCancelAllocPick(index, row) {
      let para = Object.assign({}, row);
      cancelPickByAlloc({ alloc: JSON.stringify(para) })
        .then((res) => {
          //NProgress.done();
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.getAssembleSDetail();
          this.getAllAssembleAlloc();
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    audit() {
      //NProgress.start();
      let orderNos = [this.orderHeader.orderNo].join(",");
      let para = { orderNos: orderNos };
      audit(para)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.orderHeader = Object.assign({}, res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    cancelAudit() {
      let orderNos = [this.orderHeader.orderNo].join(",");
      let para = { orderNos: orderNos };
      cancelAudit(para)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.orderHeader = Object.assign({}, res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    createSDetail() {
      this.createSDetailBtnLoading = true;
      createAssembleSDetailByOrderNo({ orderNo: this.orderHeader.orderNo })
        .then((res) => {
          this.createSDetailBtnLoading = false;
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.orderHeader = Object.assign({}, res.data.data);
            this.getAssembleSDetail();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          this.createSDetailBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    cancelCreateSDetail() {
      this.cancelCreateSDetailBtnLoading = true;
      debugger;
      if(this.sDetailAllocGrid.sDetailAlloc.size>0){
        this.$message.error("请取消所有分配后再取消生成子件！");
        return;
      }
      cancelCreateByOrderNo({ orderNo: this.orderHeader.orderNo })
        .then((res) => {
          this.cancelCreateSDetailBtnLoading = false;
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.orderHeader = Object.assign({}, res.data.data);
            this.getAssembleSDetail();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          this.cancelCreateSDetailBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    getOrder() {
      getAssembleOrderHeader({ orderNo: this.orderNo })
        .then((res) => {
          this.orderHeader = Object.assign({}, res.data);
          //处理时间
          this.orderHeader.orderTime = res.data.orderTime?util.formatDate.format(new Date(res.data.orderTime), "yyyy-MM-dd hh:mm:ss"):'';
          this.orderHeader.auditTime = res.data.auditTime?util.formatDate.format(new Date(res.data.auditTime), "yyyy-MM-dd hh:mm:ss"):'';
          this.getAssembleFDetail();
          this.getAssembleSDetail();
          this.getAllAssembleAlloc();
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    getAssembleFDetail() {
      this.fDetailGrid.listLoading = true;
      let para = {
        conditions: JSON.stringify({ orderNo: this.orderHeader.orderNo }),
      };
      getAssembleFDetailList(para)
        .then((res) => {
          this.fDetailGrid.total = res.data.size;
          this.fDetailGrid.fDetail = res.data.list;
          this.fDetailGrid.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.fDetailGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    getAssembleSDetail() {
      this.sDetailGrid.listLoading = true;
      let para = {
        page: this.sDetailGrid.page,
        size: this.sDetailGrid.size,
        conditions: JSON.stringify({ orderNo: this.orderHeader.orderNo }),
      };
      getAssembleSDetailList(para)
        .then((res) => {
          this.sDetailGrid.total = res.data.size;
          this.sDetailGrid.sDetail = res.data.list;
          this.sDetailGrid.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.sDetailGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    getAllAssembleAlloc() {
      this.allocGrid.listLoading = true;
      let para = {
        page: this.allocGrid.page,
        size: this.allocGrid.size,
        conditions: JSON.stringify({ orderNo: this.orderHeader.orderNo }),
      };
      getAllAssembleAllocList(para)
        .then((res) => {
          this.allocGrid.total = res.data.size;
          this.allocGrid.alloc = res.data.list;
          this.allocGrid.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.allocGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    back() {
      this.$router.push({ path: "/assembleOrder" });
    },
  },
  mounted() {
    if (this.status === "EDIT") {
      this.getOrder();
    } else if (this.status === "ADD") {
      this.orderHeader = {
        id: "",
        orderNo: "",
        assembleType: "",
        status: "00",
        auditStatus: "00",
        auditor: "",
        auditDate: null,
        orderTime: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        remark: "",
        creator: "",
        createTime: "",
        modifier: "",
        modifyTime: "",
        rec_ver: "",
        companyId: "",
        warehouseId: "",
      };
    }
  },
};
</script>

<style>
.el-table .un-alloc-row {
  background: #f6ab00;
}
.el-table .part-row {
  background: #F5DA81;
}
</style>
