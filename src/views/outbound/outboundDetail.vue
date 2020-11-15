<template>
  <section>
    <div v-title data-title="出库单详情"></div>
    <el-steps
      :active="active"
      finish-status="success"
      style="margin-top: 20px; margin-bottom: 20px"
    >
      <el-step title="创建订单"></el-step>
      <el-step title="完成审核（可取消）"></el-step>
      <el-step title="完成分配（可取消）"></el-step>
      <el-step title="完成拣货（可取消）"></el-step>
      <el-step title="完成发货（可取消）"></el-step>
      <el-step title="关闭订单"></el-step>
      <el-step title="完成核算"></el-step>
    </el-steps>
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
        :disabled="btnAllocByHeaderStatus"
        @click="allocByHeaderHandler"
        :loading="pageControl.allocByHeaderBtnLoading"
        >自动分配</el-button
      >
      <el-button
        type="danger"
        :disabled="btnCancelAllocByHeaderStatus"
        @click="cancelAllocByHeaderHandler"
        :loading="pageControl.cancelAllocByHeaderBtnLoading"
        >取消分配</el-button
      >
      <el-button
        type="primary"
        :disabled="btnPickByHeaderStatus"
        @click="pickByHeaderHandler"
        :loading="pageControl.pickByHeaderBtnLoading"
        >拣货</el-button
      >
      <el-button
        type="primary"
        :disabled="btnShipByHeaderStatus"
        @click="shipByHeaderHandler"
        :loading="pageControl.shipByHeaderBtnLoading"
        >发货</el-button
      >
      <el-button
        type="danger"
        :disabled="btnCancelShipByHeaderStatus"
        @click="cancelShipByHeaderHandler"
        :loading="pageControl.cancelShipByHeaderBtnLoading"
        >取消发货</el-button
      >
      <el-button
        type="danger"
        :disabled="btnCloseStatus"
        @click="close"
        :loading="pageControl.closeBtnLoading"
        >关闭订单</el-button
      >
      <el-button
        type="success"
        :disabled="btnAccountStatus"
        @click="account"
        :loading="pageControl.accountBtnLoading"
        >销售核算</el-button
      >
      <el-button
        type="success"
        :disabled="btnAccountCostStatus"
        @click="accountCost"
        :loading="pageControl.accountCostBtnLoading"
        >成本核算</el-button
      >
      <el-button @click="back" style="float: right">返回</el-button>
      <el-button
        @click="nextOrder"
        icon="el-icon-caret-right"
        type="primary"
        style="float: right"
        circle
      ></el-button>
      <el-button
        @click="preOrder"
        icon="el-icon-caret-left"
        type="primary"
        style="float: right"
        circle
      ></el-button>

      <!-- <el-button
        type="primary"
        style="float: right"
        :disabled="btnPrintShipOrderStatus"
        @click="printShipOrder"
        >打印发货单</el-button
      > -->
      <el-button
        type="primary"
        style="float: right"
        :disabled="btnPrintShipOrderStatus"
        @click="printShipOrder"
        >打印发货单</el-button
      >
      <el-button
        type="primary"
        style="float: right"
        :disabled="btnPrintPickUpOrderStatus"
        @click="printPickUpOrder"
        >打印拣货单</el-button
      >
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
            <el-popover
              style="margin-left: 2%"
              placement="bottom"
              width="200"
              trigger="click"
            >
              <img :src="qrCodeUrl" />
              <el-button @click="clipboardPickInfo" slot="reference"
                >出库单二维码</el-button
              >
            </el-popover>
            <download-excel
              class="export-excel-wrapper"
              :data="detailGrid.orderDetail"
              :fields="json_fields"
              name="出库明细导出.xls"
            >
              <el-button>导出EXCEL</el-button>
            </download-excel>
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
            <el-form-item label="出库单号" prop="orderNo">
              <el-input
                v-model="orderHeader.orderNo"
                disabled
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户" prop="buyerCode">
              <popwin-button
                popKey="POP_CUSTOMER"
                :disabled="orderHeader.auditStatus === '00' ? false : true"
                :showName="true"
                :displayName="orderHeader.buyerName"
                v-model="orderHeader.buyerCode"
              ></popwin-button>
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
                  v-for="item in outboundStatus"
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
              <!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单时间" prop="orderTime">
              <el-date-picker
                :disabled="orderHeader.auditStatus === '00' ? false : true"
                v-model="orderHeader.orderTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              >
              </el-date-picker>
              <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="出库类型" prop="outboundType">
              <el-select
                :disabled="orderHeader.auditStatus === '00' ? false : true"
                v-model="orderHeader.outboundType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in outboundType"
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
            <el-form-item label="审核时间" prop="auditTime">
              <el-date-picker
                v-model="orderHeader.auditTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                disabled
              >
              </el-date-picker>
              <!--<el-input v-model="orderHeader.auditTime" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核人" prop="auditOp">
              <el-input
                v-model="orderHeader.auditOp"
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
          <el-col :span="6">
            <el-form-item label="总价" prop="remark">
              <el-input
                v-model="totalPrice"
                :disabled="true"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="物流公司" prop="logisticsNo">
              <popwin-button
                popKey="POP_CUSTOMER"
                :staticCondition="{ customerType: '物流公司' }"
                :showName="true"
                :displayName="orderHeader.logisticsCompany"
                v-model="orderHeader.logisticsNo"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物流单号" prop="trackingNo">
              <el-input
                v-model="orderHeader.trackingNo"
                :disabled="logisticsInfoStatus"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运费" prop="freight">
              <el-input
                v-model="orderHeader.freight"
                :disabled="logisticsInfoStatus"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button
              @click="alert('还没完成')"
              :disabled="logisticsInfoStatus"
              >历史物流信息</el-button
            >
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 15px">出库单明细</span>
        </div>
        <el-table
          :data="detailGrid.orderDetail"
          :row-class-name="tableRowClassName"
          height="800"
          show-summary
          :summary-method="getSummaries"
          border
          v-loading="detailGrid.listLoading"
          @selection-change="selsChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="id" label="id" width="50" sortable>
          </el-table-column>
          <el-table-column prop="lineNo" label="行号" width="80" sortable>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            :formatter="formatStatus"
          >
          </el-table-column>
          <el-table-column prop="skuCode" label="产品编码" width="80">
          </el-table-column>
          <el-table-column prop="quickCode" label="快捷编码" width="80">
          </el-table-column>
          <el-table-column prop="skuName" label="产品名称" width="200">
          </el-table-column>
          <el-table-column prop="modelCode" label="车型" width="200">
          </el-table-column>
          <!-- <el-table-column prop="outboundNum" label="订货数" width="80">
          </el-table-column> -->
          <el-table-column prop="outboundNum" label="订货数" width="80">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-input
                  :ref="scope.row.id"
                  :disabled="rowEditStatus"
                  @keyup.enter.native="
                    rowSaveDetail(scope.row, scope.$index, $event)
                  "
                  v-model="scope.row.outboundNum"
                  auto-complete="off"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="outboundPrice" label="发货价格" width="80">
          </el-table-column>
          <el-table-column prop="outboundOriginNum" label="源单数" width="80">
          </el-table-column>
          <el-table-column prop="outboundShipNum" label="发货数" width="80">
          </el-table-column>
          <el-table-column prop="outboundAllocNum" label="分配数" width="80">
          </el-table-column>
          <el-table-column prop="outboundPickNum" label="拣货数" width="80">
          </el-table-column>

          <el-table-column prop="cost" label="成本" width="80">
          </el-table-column>
          <el-table-column prop="groupCode" label="通用组编码" width="80">
          </el-table-column>
          <el-table-column prop="needToAssemble" label="是否组装件" width="80">
          </el-table-column>
          <el-table-column prop="orderNo" label="出库单号" width="200">
          </el-table-column>
          <el-table-column prop="buyerName" label="客户名称" width="200">
          </el-table-column>
          <el-table-column prop="buyerCode" label="客户编码" width="80">
          </el-table-column>
          <el-table-column prop="planShipLoc" label="计划发货库位" width="100">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="150">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleDetailEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                :disabled="btnDetailGridDelStatus"
                size="small"
                @click="handleDetailDel(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-button
            type="primary"
            :disabled="btnDetailGridAdd"
            @click="addDetailHandler"
            >新增</el-button
          >
          <el-button
            type="danger"
            :disabled="btnDetailGridAdd"
            @click="handelBatchDel"
            >批量删除</el-button
          >
          <el-button
            type="danger"
            :disabled="btnDetailGridAdd"
            @click="handelBatchDelAndCreateNew"
            >批量删除并生成新的出库单</el-button
          >
          <el-button
            type="primary"
            :disabled="btnDetailGridAdd"
            @click="openBatchAddPopWin"
            >快速新增</el-button
          >
          <el-button
            type="primary"
            :disabled="btnDetailGridAdd"
            @click="openExcelImportPopWin"
            >EXCEL导入</el-button
          >
          <!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentDetailChange"
            :page-size="detailGrid.size"
            :total="detailGrid.total"
            style="float: right"
          >
          </el-pagination>
        </el-col>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 15px">出库单分配明细</span>
        </div>
        <el-table
          :data="detailAllocGrid.orderDetailAlloc"
          border
          highlight-current-row
          v-loading="detailAllocGrid.listLoading"
          @selection-change="allocSelsChange"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="id" label="id" width="50" sortable>
          </el-table-column>
          <el-table-column prop="lineNo" label="行号" width="80" sortable>
          </el-table-column>
          <el-table-column prop="allocId" label="分配ID" width="100" sortable>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
            :formatter="formatStatus"
          >
          </el-table-column>
          <el-table-column prop="skuCode" label="产品编码" width="80">
          </el-table-column>
          <el-table-column prop="skuName" label="产品名称" width="200">
          </el-table-column>
          <el-table-column prop="modelCode" label="车型" width="200">
          </el-table-column>
          <el-table-column prop="outboundNum" label="订货数" width="80">
          </el-table-column>
          <el-table-column prop="pickNum" label="拣货数" width="80">
          </el-table-column>
          <el-table-column prop="outboundPrice" label="价格" width="80">
          </el-table-column>
          <el-table-column prop="cost" label="成本" width="200">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-input-number
                  :disabled="allocCostEditStatus"
                  @keyup.enter.native="rowSaveDetailAlloc(scope.row)"
                  v-model="scope.row.cost"
                  auto-complete="off"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="allocLocCode" label="分配库位" width="80">
          </el-table-column>
          <el-table-column prop="toLocCode" label="发货库位" width="80">
          </el-table-column>
          <el-table-column
            prop="pickTime"
            label="拣货时间"
            width="155"
            :formatter="formatTime"
          >
          </el-table-column>
          <el-table-column prop="pickOp" label="拣货人" width="80">
          </el-table-column>
          <el-table-column
            prop="shipTime"
            label="发货时间"
            width="155"
            :formatter="formatTime"
          >
          </el-table-column>
          <el-table-column prop="shipOp" label="发货人" width="80">
          </el-table-column>
          <el-table-column prop="orderNo" label="出库单号" width="200">
          </el-table-column>
          <el-table-column prop="buyerCode" label="客户编码" width="80">
          </el-table-column>
          <el-table-column prop="buyerName" label="客户名称" width="200">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleAllocDetailEdit(scope.$index, scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <!--<el-button type="primary" @click="recDetailConfirm">收货确认</el-button>-->
          <!--<el-button type="danger" @click="recDetailCancel" :disabled="this.detailGrid.sels.length===0">取消收货</el-button>-->
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentAllocDetailChange"
            :page-size="detailAllocGrid.size"
            :total="detailAllocGrid.total"
            style="float: right"
          >
          </el-pagination>
        </el-col>
      </el-card>
    </el-form>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="pageControl.editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="detailGrid.editForm"
        label-width="80px"
        :rules="detailGrid.editFormRules"
        ref="editForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="客户" prop="buyerCode">
              <popwin-button
                popKey="POP_CUSTOMER"
                :disabled="true"
                :showName="true"
                :displayName="detailGrid.editForm.buyerName"
                v-model="detailGrid.editForm.buyerCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="skuCode">
              <popwin-button
                popKey="POP_SKU"
                id="1"
                :disabled="editFormSkuCodeStatus"
                @changeValue="editFormSkuChangeValue"
                v-model="detailGrid.editForm.skuCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="fittingSkuName">
              <el-input
                v-model="detailGrid.editForm.skuName"
                :disabled="true"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="modelCode">
              <el-input
                v-model="detailGrid.editForm.modelCode"
                :disabled="true"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="detailGrid.editForm.status"
                :disabled="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in outboundStatus"
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
          <el-col :span="12">
            <el-form-item label="计划发货库位" prop="planShipLoc">
              <popwin-button
                popKey="POP_LOC"
                :staticCondition="{ useType: 'SS' }"
                :selectValue="detailGrid.editForm.planShipLoc"
                v-model="detailGrid.editForm.planShipLoc"
              ></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="订货数" prop="outboundNum">
              <el-input-number
                @change="outboundNumChange"
                v-model="detailGrid.editForm.outboundNum"
                :disabled="editFormOutboundNumStatus"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="源单数" prop="outboundOriginNum">
              <el-input-number
                v-model="detailGrid.editForm.outboundOriginNum"
                :disabled="editFormOutboundOriginNumStatus"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="发货价格" prop="outboundPrice">
              <!--<el-autocomplete popper-class="my-autocomplete" custom-item="my-priceitem-zh"  :fetch-suggestions="queryHistoryPrice" @select="handlePriceSelect" v-model.number="detailGrid.editForm.outboundPrice" auto-complete="off"></el-autocomplete>-->
              <el-input-number
                v-model.number="detailGrid.editForm.outboundPrice"
                :disabled="editFormOutboundPriceStatus"
                auto-complete="off"
                @keyup.enter.native="editSubmit"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配数" prop="outboundAllocNum">
              <el-input-number
                v-model="detailGrid.editForm.outboundAllocNum"
                :disabled="true"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="拣货数" prop="outboundPickNum">
              <el-input-number
                v-model="detailGrid.editForm.outboundPickNum"
                :disabled="true"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货数" prop="outboundShipNum">
              <el-input-number
                v-model="detailGrid.editForm.outboundShipNum"
                :disabled="true"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="detailGrid.editForm.remark"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="pageControl.editFormVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="btnEditSubmitStatus"
          @click.native="editSubmit"
          :loading="pageControl.editLoading"
          >提交</el-button
        >
        <el-button
          type="primary"
          :disabled="btnAllocSubmitStatus"
          @click.native="allocSubmit"
          :loading="pageControl.allocSubmitLoading"
          >自动分配</el-button
        >
        <el-button
          type="primary"
          :disabled="btnPreAssembleAllocSubmitStatus"
          @click.native="preAssembleAllocSubmit"
          :loading="pageControl.preAssembleAllocSubmitLoading"
          >组装预分配</el-button
        >
        <el-button
          type="danger"
          :disabled="btnCancelAllocSubmitStatus"
          @click.native="cancelAllocSubmit"
          :loading="pageControl.cancelAllocSubmitLoading"
          >取消分配</el-button
        >
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="pageControl.allocEditFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="detailAllocGrid.editForm"
        label-width="80px"
        :rules="detailAllocGrid.editFormRules"
        ref="allocEditForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="客户" prop="supplierCode">
              <popwin-button
                popKey="POP_CUSTOMER"
                :disabled="true"
                :showName="true"
                :displayName="detailAllocGrid.editForm.buyerName"
                v-model="detailAllocGrid.editForm.buyerCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="skuCode">
              <popwin-button
                popKey="POP_SKU"
                :disabled="true"
                @changeValue="allocEditFormSkuChangeValue"
                v-model="detailAllocGrid.editForm.skuCode"
              ></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="fittingSkuName">
              <el-input
                v-model="detailAllocGrid.editForm.skuName"
                :disabled="true"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="modelCode">
              <el-input
                v-model="detailAllocGrid.editForm.modelCode"
                :disabled="true"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="detailAllocGrid.editForm.status"
                :disabled="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in outboundStatus"
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
          <el-col :span="12">
            <el-form-item label="发货价格" prop="outboundPrice">
              <el-input-number
                v-model="detailAllocGrid.editForm.outboundPrice"
                disabled
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="分配数" prop="outboundNum">
              <el-input
                v-model="detailAllocGrid.editForm.outboundNum"
                disabled
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拣货数" prop="pickNum">
              <el-input-number
                v-model="detailAllocGrid.editForm.pickNum"
                auto-complete="off"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="分配库位" prop="allocLocCode">
              <popwin-button
                popKey="POP_LOC"
                :selectValue="detailAllocGrid.editForm.allocLocCode"
                :disabled="true"
                v-model="detailAllocGrid.editForm.allocLocCode"
              ></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货库位" prop="toLocCode">
              <popwin-button
                popKey="POP_LOC"
                :staticCondition="{ useType: 'SS' }"
                :selectValue="detailAllocGrid.editForm.toLocCode"
                v-model="detailAllocGrid.editForm.toLocCode"
              ></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="detailAllocGrid.editForm.remark"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="pageControl.allocEditFormVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click.native="pickAllocSubmit"
          :disabled="btnPickAllocStatus"
          :loading="pageControl.pickAllocLoading"
          >拣货</el-button
        >
        <el-button
          type="danger"
          @click.native="cancelPickAllocSubmit"
          :disabled="btnCancelPickAllocStatus"
          :loading="pageControl.cancelPickAllocLoading"
          >取消拣货</el-button
        >
        <el-button
          type="primary"
          @click.native="shipAllocSubmit"
          :disabled="btnShipAllocStatus"
          :loading="pageControl.shipAllocLoading"
          >发货</el-button
        >
        <el-button
          type="danger"
          @click.native="cancelShipAllocSubmit"
          :disabled="btnCancelShipAllocStatus"
          :loading="pageControl.cancelShipAllocLoading"
          >取消发货</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="快速新增"
      border
      :visible.sync="pageControl.batchAddPopWinVisiable"
    >
      <el-form :inline="true" :model="batchAddPopWin.filters">
        <el-form-item label="配件类型" prop="fittingTypeCode">
          <popwin-button
            popKey="POP_FITTINGTYPE"
            :selectValue="batchAddPopWin.filters.fittingTypeCode"
            v-model="batchAddPopWin.filters.fittingTypeCode"
          ></popwin-button>
        </el-form-item>
        <el-form-item label="编码" prop="fittingSkuCode">
          <el-input v-model="batchAddPopWin.filters.fittingSkuCode"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="fittingSkuName">
          <el-input v-model="batchAddPopWin.filters.fittingSkuName"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="modelCode">
          <el-input v-model="batchAddPopWin.filters.modelCode"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="buyerCode">
          <popwin-button
            popKey="POP_CUSTOMER"
            :selectValue="batchAddPopWin.filters.buyerCode"
            v-model="batchAddPopWin.filters.buyerCode"
          ></popwin-button>
          <!--<el-input v-model="orderHeader.supplierCode" auto-complete="off"></el-input>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="batchAddPopWinQuery"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <el-tabs v-model="batchAddPopWin.batchAddPopWinActiveName">
        <el-tab-pane label="销售历史" name="sale">
          <el-table
            max-height="500"
            border
            :data="batchAddPopWin.saleList"
            @row-dblclick="addSale"
            v-loading="batchAddPopWin.saleListLoading"
            @selection-change="batchAddSaleSelsChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              property="skuCode"
              label="商品编码"
              width="150"
            ></el-table-column>
            <el-table-column
              property="fittingSkuName"
              label="商品名称"
              width="200"
            ></el-table-column>
            <el-table-column
              property="customerName"
              label="客户名称"
              width="200"
            ></el-table-column>
            <el-table-column
              property="modelCode"
              label="车型"
            ></el-table-column>
            <el-table-column
              property="outboundPrice"
              label="发货价格"
            ></el-table-column>
            <el-table-column
              property="modifyTime"
              label="发货时间"
              :formatter="formatTime"
            ></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-button type="primary" v-on:click="batchAdd">批量新增</el-button>
            <el-pagination
              layout="prev, pager, next"
              @current-change="handleBatchSaleAddCurrentChange"
              :page-size="batchAddPopWin.saleSize"
              :total="batchAddPopWin.saleTotal"
              style="float: right"
            >
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="产品信息" name="sku">
          <el-table
            max-height="500"
            border
            :data="batchAddPopWin.skuList"
            v-loading="batchAddPopWin.listLoading"
            @row-dblclick="addSku"
            @selection-change="batchAddSelsChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              property="fittingSkuCode"
              label="商品编码"
              width="150"
            ></el-table-column>
            <el-table-column
              property="fittingSkuName"
              label="商品名称"
              width="200"
            ></el-table-column>
            <el-table-column
              property="modelCode"
              label="车型"
            ></el-table-column>
            <el-table-column
              property="price"
              label="参考价格"
              width="200"
            ></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-button type="primary" v-on:click="batchAdd">批量新增</el-button>
            <el-pagination
              layout="prev, pager, next"
              @current-change="handleBatchAddCurrentChange"
              :page-size="batchAddPopWin.size"
              :total="batchAddPopWin.total"
              style="float: right"
            >
            </el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      title="excel导入出库单明细"
      :visible.sync="pageControl.excelImportPopWinVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="detailGrid.excelImportPopWinForm"
        label-width="80px"
        ref="excelImportPopWinForm"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="订单号" prop="orderNo">
              <el-input
                v-model="detailGrid.excelImportPopWinForm.orderNo"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货库位" prop="loc">
              <popwin-button
                popKey="POP_LOC"
                :staticCondition="{ useType: 'SS' }"
                :selectValue="detailGrid.excelImportPopWinForm.loc"
                v-model="detailGrid.excelImportPopWinForm.loc"
              ></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品编码列名" prop="skuCodeColumnName">
              <el-input
                v-model="detailGrid.excelImportPopWinForm.skuCodeColumnName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格列名" prop="priceColumnName">
              <el-input
                v-model="detailGrid.excelImportPopWinForm.priceColumnName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="订货数列名" prop="numColumnName">
              <el-input
                v-model="detailGrid.excelImportPopWinForm.numColumnName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :data="detailGrid.excelImportPopWinForm"
        :on-success="uploadConnectSuccess"
        :on-error="uploadConnectFail"
        :before-upload="beforeExcelUplaod"
        action="/xibin/outbound/importOutboundDetailByExcel.shtml"
        :file-list="detailGrid.excelFileList"
        multiple
        list-type="text"
        :auto-upload="true"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import Vue from "vue";
Vue.component("my-priceitem-zh", {
  functional: true,
  render: function (h, ctx) {
    var item = ctx.props.item;
    return h("li", ctx.data, [
      h("div", { attrs: { class: "price" } }, [item.price]),
      h("span", { attrs: { class: "date" } }, [item.date]),
    ]);
  },
  props: {
    item: { type: Object, required: true },
  },
});
import { getFittingSkuListPage } from "../../api/fittingSkuApi";
import NProgress from "nprogress";
import {
  removeOutboundDetailAndCreateNewOrder,
  importOutboundDetailByExcel,
  saveOutboundAllocDetail,
  allocByHeader,
  pickByHeader,
  cancelAllocByHeader,
  queryHistorySale,
  batchSaveOutboundDetail,
  queryHistoryPrice,
  shipByHeader,
  getOutboundOrderListPage,
  saveOutboundOrder,
  getOutboundOrderHeader,
  getOutboundDetailListPage,
  saveOutboundDetail,
  removeOutboundDetail,
  getOutboundAllocListPage,
  audit,
  cancelAudit,
  alloc,
  cancelAlloc,
  pick,
  cancelPick,
  ship,
  cancelShip,
  cancelShipByHeader,
  close,
  accountByOrderNo,
  accountCostByOrderNo,
  selectNextOrderNo,
  selectPreOrderNo,
} from "../../api/outboundApi";
var codemaster = require("../../../static/codemaster.json");
var config = require("../../../static/config.json");
import NP from "number-precision";
const qrCodeOptions = {
  padding: 10,
  width: 200,
  height: 200,
  reverse: false,
  background: "#ffffff",
  foreground: "#000000",
};
export default {
  data() {
    var validatePickNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入拣货数"));
      } else {
        if (this.detailAllocGrid.editForm.outboundNum > value) {
          callback(new Error("拣货数不能小于分配数"));
        }
        callback();
      }
    };
    return {
      json_fields: {
        出库单号: "orderNo", //常规字段
        客户: "buyerName", //支持嵌套属性
        行号: "lineNo",
        产品编码: "skuCode",
        产品名称: "skuName",
        车型: "modelCode",
        数量: "outboundNum",
        单价: "outboundPrice",
      },
      testFocus: true,
      batchAddPopWin: {
        batchAddPopWinActiveName: "sale",
        saleList: [],
        salePage: 1,
        saleSize: 10,
        saleTotal: 0,
        saleListLoading: false,
        saleSels: [],
        skuList: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
        queryConditions: [
          { title: "产品名称", name: "fittingSkuName" },
          { title: "产品编码", name: "fittingSkuCode" },
        ],
        filters: {
          fittingSkuCode: "",
          fittingSkuName: "",
          modelCode: "",
          fittingTypeCode: "",
          buyerCode: "",
        },
      },
      orderHeader: {
        id: "",
        orderNo: "",
        buyerCode: "",
        status: "",
        orderTime: "",
        auditOp: "",
        auditStatus: "",
        auditTime: "",
        outboundType: "",
        isCalculated: "N",
        isCostCaculated: "N",
        voucherId: 0,
        costVoucherId: 0,
        remark: "",
        creator: "",
        createTime: "",
        modifier: "",
        modifyTime: "",
        rec_ver: "",
        companyId: "",
        warehouseId: "",
      },
      detailGrid: {
        currentIndex: 0,
        currentRow: {},
        editForm: {
          id: "",
          orderNo: "",
          lineNo: "",
          status: "",
          buyerCode: "",
          skuCode: "",
          outboundNum: 0,
          outboundAllocNum: 0,
          outboundPickNum: 0,
          outboundShipNum: 0,
          outboundPrice: 0,
          planShipLoc: "",
          cost: 0,
          remark: "",
          creator: "",
          createTime: "",
          modifier: "",
          modifyTime: "",
          rec_ver: "",
          companyId: "",
          warehouseId: "",
        },
        editFormRules: {
          buyerCode: [
            { required: true, message: "请选择客户", trigger: "blur" },
          ],
          skuCode: [{ required: true, message: "请选择产品", trigger: "blur" }],
          outboundNum: [
            {
              type: "number",
              required: true,
              message: "请输入订货数",
              trigger: "blur",
            },
          ],
          outboundPrice: [
            {
              type: "number",
              required: true,
              message: "价格必须为数字",
              trigger: "blur",
            },
          ],
          planShipLoc: [
            { required: true, message: "请选择计划发货库位", trigger: "blur" },
          ],
        },
        orderDetail: [],
        page: 1,
        size: 200,
        total: 0,
        listLoading: false,
        sels: [],
        excelImportPopWinForm: {
          orderNo: "",
          skuCodeColumnName: "",
          priceColumnName: "",
          numColumnName: "",
          loc: "",
        },
        excelFileList: [],
      },
      pageControl: {
        saveBtnLoading: false,
        auditBtnLoading: false,
        cancelAuditBtnLoading: false,
        editFormVisible: false,
        editLoading: false,
        allocEditFormVisible: false,
        allocSubmitLoading: false,
        cancelAllocSubmitLoading: false,
        pickAllocLoading: false,
        cancelPickAllocLoading: false,
        shipAllocLoading: false,
        cancelShipAllocLoading: false,
        shipByHeaderBtnLoading: false,
        pickByHeaderBtnLoading: false,
        allocByHeaderBtnLoading: false,
        cancelAllocByHeaderBtnLoading: false,
        cancelShipByHeaderBtnLoading: false,
        batchAddPopWinVisiable: false,
        closeBtnLoading: false,
        accountBtnLoading: false,
        accountCostBtnLoading: false,
        preAssembleAllocSubmitLoading: false,
        excelImportPopWinVisible: false,
      },
      detailAllocGrid: {
        editForm: {
          id: "",
          orderNo: "",
          buyerCode: "",
          status: "",
          lineNo: "",
          allocId: "",
          skuCode: "",
          outboundNum: 0,
          pickNum: 0,
          outboundPrice: 0,
          allocLocCode: "",
          toLocCode: "",
          pickOp: "",
          pickTime: "",
          shiOp: "",
          shipTime: "",
          remark: "",
          creator: "",
          createTime: "",
          modifier: "",
          modifyTime: "",
          rec_ver: "",
          companyId: "",
          warehouseId: "",
        },
        editFormRules: {
          toLocCode: [
            { required: true, message: "请输入发货库位", trigger: "blur" },
          ],
          outboundPrice: [
            {
              type: "number",
              required: true,
              message: "请输入价格",
              trigger: "blur",
            },
          ],
          pickNum: [{ validator: validatePickNum, trigger: "blur" }],
        },
        orderDetailAlloc: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
      },
      orderHeaderRules: {
        buyerCode: [{ required: true, message: "请选择客户", trigger: "blur" }],
        outboundType: [
          { required: true, message: "请选择出库类型", trigger: "blur" },
        ],
        orderTime: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      outboundStatus: codemaster.WM_OUTBOUND_STATUS,
      outboundType: codemaster.WM_OUTBOUND_TYPE,
      auditStatus: codemaster.SYS_AUDIT_STATUS,
    };
  },
  computed: {
    qrCodeUrl: function () {
      if (
        this.orderHeader.orderNo !== null &&
        this.orderHeader.orderNo !== ""
      ) {
        return jrQrcode.getQrBase64(this.orderHeader.orderNo, qrCodeOptions);
      }
    },
    totalPrice: function () {
      let totalPrice = 0;
      this.detailGrid.orderDetail.forEach((row, index) => {
        totalPrice = NP.plus(
          totalPrice,
          NP.times(row.outboundPrice, row.outboundNum)
        );
      });
      return totalPrice;
    },
    // 物流信息状态
    logisticsInfoStatus: function () {
      if (this.orderHeader.status === "99") {
        return true;
      }
      return false;
    },
    editFormSkuCodeStatus: function () {
      if (this.orderHeader.status === "99") {
        return true;
      }
      if (this.detailGrid.editForm.status === "00") {
        return false;
      } else {
        return true;
      }
    },
    editFormOutboundPriceStatus: function () {
      if (this.orderHeader.status === "99") {
        return true;
      } else {
        return false;
      }
    },
    editFormOutboundNumStatus: function () {
      if (this.orderHeader.status === "99") {
        return true;
      }
      if (this.detailGrid.editForm.status === "00") {
        return false;
      } else {
        return true;
      }
    },
    editFormOutboundOriginNumStatus: function () {
      if (this.orderHeader.status === "99") {
        return true;
      }
      if (this.detailGrid.editForm.status === "00") {
        if (
          this.detailGrid.editForm.id === "" ||
          this.detailGrid.editForm.id === null
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    active: function () {
      if (this.orderHeader === undefined) {
        return 1;
      }
      if (
        this.orderHeader.status === "00" &&
        this.orderHeader.auditStatus === "00"
      ) {
        return 1;
      } else if (
        (this.orderHeader.status == "00" || this.orderHeader.status == "30") &&
        this.orderHeader.auditStatus !== "00"
      ) {
        return 2;
      } else if (
        this.orderHeader.status == "40" ||
        this.orderHeader.status == "50"
      ) {
        return 3;
      } else if (
        this.orderHeader.status == "60" ||
        this.orderHeader.status == "70"
      ) {
        return 4;
      } else if (this.orderHeader.status == "80") {
        return 5;
      } else if (
        this.orderHeader.status == "99" &&
        (this.orderHeader.isCalculated === "N" ||
          this.orderHeader.isCostCalculated === "N")
      ) {
        return 6;
      } else if (this.orderHeader.status == "99") {
        return 7;
      }
    },
    btnCloseStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      } else if (this.orderHeader.status === "80") {
        return false;
      } else {
        return true;
      }
    },
    btnAccountStatus: function () {
      if (
        this.orderHeader.isCalculated === "N" &&
        this.orderHeader.status === "99"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnAccountCostStatus: function () {
      if (
        this.orderHeader.outboundType !== "PO" &&
        this.orderHeader.outboundType !== "XX"
      ) {
        return true;
      }
      if (
        this.orderHeader.isCostCalculated === "N" &&
        this.orderHeader.status === "99"
      ) {
        return false;
      } else {
        return true;
      }
    },
    rowEditStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    allocCostEditStatus: function () {
      if (this.orderHeader.auditStatus === "99") {
        return true;
      } else {
        return true;
      }
    },
    btnAllocByHeaderStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.orderHeader.status === "50" ||
        this.orderHeader.status === "30" ||
        this.orderHeader.status === "00"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnCancelAllocByHeaderStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.orderHeader.status === "50" ||
        this.orderHeader.status === "30" ||
        this.orderHeader.status === "40"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnPickByHeaderStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.orderHeader.status === "00" ||
        this.orderHeader.status === "60" ||
        this.orderHeader.status === "80" ||
        this.orderHeader.status === "99"
      ) {
        return true;
      } else {
        return false;
      }
    },
    btnShipByHeaderStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.orderHeader.status === "50" ||
        this.orderHeader.status === "60"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnCancelShipByHeaderStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.orderHeader.status === "80" ||
        this.orderHeader.status === "70"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnPickAllocStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (this.detailAllocGrid.editForm.status === "40") {
        return false;
      } else {
        return true;
      }
    },
    btnCancelPickAllocStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.detailAllocGrid.editForm.status === "60" ||
        this.detailAllocGrid.editForm.status === "65"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnShipAllocStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.detailAllocGrid.editForm.status === "60" ||
        this.detailAllocGrid.editForm.status === "65"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnCancelShipAllocStatus: function () {
      if (
        this.orderHeader.auditStatus === "00" ||
        this.orderHeader.status === "99"
      ) {
        return true;
      }
      if (this.detailAllocGrid.editForm.status === "80") {
        return false;
      } else {
        return true;
      }
    },
    btnAllocSubmitStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }

      if (
        (this.detailGrid.editForm.status === "00" ||
          this.detailGrid.editForm.status === "30") &&
        this.detailGrid.editForm.id !== ""
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnPreAssembleAllocSubmitStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }

      if (
        (this.detailGrid.editForm.status === "00" ||
          this.detailGrid.editForm.status === "30") &&
        this.detailGrid.editForm.id !== ""
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnCancelAllocSubmitStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (
        this.detailGrid.editForm.status == "30" ||
        this.detailGrid.editForm.status == "40"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnEditSubmitStatus: function () {
      return false;
    },
    btnDetailGridAdd: function () {
      if (this.orderHeader.id === "") {
        return true;
      }
      if (this.orderHeader.status === "99") {
        return true;
      } else {
        return false;
      }
    },
    btnDetailGridDelStatus: function () {
      if (this.orderHeader.status === "99") {
        return true;
      } else {
        return false;
      }
    },
    btnAllocEditStatus: function () {
      if (this.detailAllocGrid.editForm.status === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnCancelAllocEditStatus: function () {
      if (this.detailAllocGrid.editForm.status === "00") {
        return true;
      } else {
        return false;
      }
    },
    btnSaveHeaderStatus: function () {
      // if (this.orderHeader.auditStatus === "00") {
      //   return false;
      // } else {
      //   return true;
      // }
      return false;
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
    btnPrintShipOrderStatus: function () {
      // if (
      //   this.orderHeader.status === "60" ||
      //   this.orderHeader.status === "65" ||
      //   this.orderHeader.status === "70"
      // ) {
      //   return false;
      // } else {
      //   return true;
      // }
      return false;
    },
    btnPrintPickUpOrderStatus: function () {
      // if (
      //   this.orderHeader.status === "40" ||
      //   this.orderHeader.status === "30" ||
      //   this.orderHeader.status === "50"
      // ) {
      //   return false;
      // } else {
      //   return true;
      // }
      return false;
    },
    orderNo: function () {
      return this.$store.state.outboundDetail.orderNo;
    },
    status: function () {
      return this.$store.state.outboundDetail.status;
    },
  },
  methods: {
    clipboardPickInfo() {
      let _this = this;
      let pickInfo =
        "http://www.xbjg.org/xibin-mobile/#/outboundPick2?orderNo=" +
        this.orderHeader.orderNo;
      this.$copyText(pickInfo).then(
        function (e) {
          _this.$message({
            message: "已复制拣货URL地址到剪切板！",
            type: "success",
          });
        },
        function (e) {
          alert("Can not copy");
          console.log(e);
        }
      );
    },
    outboundNumChange(val) {
      this.detailGrid.editForm.outboundOriginNum = val;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index !== 7 && index !== 8 && index !== 9 && index !== 10) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
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
    allocEditFormSkuChangeValue(row) {
      this.detailAllocGrid.editForm.skuName = row.fittingSkuName;
      this.detailAllocGrid.editForm.modelCode = row.modelCode;
    },
    editFormSkuChangeValue(row) {
      this.detailGrid.editForm.skuName = row.fittingSkuName;
      this.detailGrid.editForm.modelCode = row.modelCode;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === "00" || row.status === "30") {
        return "un-alloc-row";
      }
      return "";
    },
    beforeExcelUplaod: function (file) {
      if (
        this.detailGrid.excelImportPopWinForm.loc === "" ||
        this.detailGrid.excelImportPopWinForm.skuCodeColumnName === "" ||
        this.detailGrid.excelImportPopWinForm.priceColumnName === "" ||
        this.detailGrid.excelImportPopWinForm.numColumnName === ""
      ) {
        this.$message.error("请填写完整数据！");
        return false;
      }
      return true;
    },
    uploadConnectSuccess: function (response, file, fileList) {
      if (response.code == 0) {
        this.$message.error(res.data.msg);
      } else if (response.code == 200) {
        this.getDetails();
        this.$message({
          message: response.msg,
          type: "success",
        });
      }
    },
    uploadConnectFail: function (err, file, fileList) {
      this.$message.error("网络连接错误，上传失败！");
    },
    updateOrderHeader(data) {
      this.orderHeader = Object.assign({}, data);
      //处理时间
      this.orderHeader.orderTime = new Date(data.orderTime);
      this.orderHeader.auditTime = new Date(data.auditTime);
    },
    printPickUpOrder() {
      let user = JSON.parse(localStorage.getItem("user"));
      window.open(
        config.reportUrl +
          "?url=pickUp&orderNo=" +
          this.orderHeader.orderNo +
          "&companyId=" +
          user.companyId +
          "&warehouseId=" +
          user.warehouseId +
          "&mobileUrl=" +
          config.mobileUrl +
          "outboundPick?orderNo="
      );
    },
    printShipOrder() {
      let user = JSON.parse(localStorage.getItem("user"));
      window.open(
        config.reportUrl +
          "?url=shipOrder&orderNo=" +
          this.orderHeader.orderNo +
          "&companyId=" +
          user.companyId +
          "&warehouseId=" +
          user.warehouseId
      );
    },
    account: function () {
      this.pageControl.accountBtnLoading = true;
      let para = { orderNo: this.orderHeader.orderNo };
      accountByOrderNo(para)
        .then((res) => {
          this.pageControl.accountBtnLoading = false;
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          this.pageControl.accountBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    accountCost: function () {
      this.pageControl.accountCostBtnLoading = true;
      let para = { orderNo: this.orderHeader.orderNo };
      accountCostByOrderNo(para)
        .then((res) => {
          this.pageControl.accountCostBtnLoading = false;
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          this.pageControl.accountCostBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    formatTime: function (row, column) {
      if (row[column.property] !== null) {
        let unixTimestamp = new Date(row[column.property]);
        return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatStatus: function (row, column) {
      return util.getComboNameByValue(
        codemaster.WM_OUTBOUND_STATUS,
        row.status
      );
    },
    selsChange: function (sels) {
      this.detailGrid.sels = sels;
    },
    allocSelsChange: function (sels) {
      this.detailAllocGrid.sels = sels;
    },
    //            batchRemove(){
    //
    //			},
    openBatchAddPopWin: function () {
      this.pageControl.batchAddPopWinVisiable = true;
    },
    handleBatchSaleAddCurrentChange(val) {
      this.batchAddPopWin.salePage = val;
      this.getSaleData();
    },
    handleBatchAddCurrentChange(val) {
      this.batchAddPopWin.page = val;
      this.getSkuData();
    },
    batchAddSaleSelsChange: function (sels) {
      this.batchAddPopWin.saleSels = sels;
    },
    batchAddSelsChange: function (sels) {
      this.batchAddPopWin.sels = sels;
    },
    rowSaveDetailAlloc(row) {
      this.detailAllocGrid.listLoading = true;
      let para = Object.assign({}, row);
      let newRows = this.detailAllocGrid.orderDetailAlloc.concat([]);
      saveOutboundAllocDetail({ detailAlloc: JSON.stringify(para) })
        .then((res) => {
          this.detailAllocGrid.listLoading = false;
          //NProgress.done();
          if (res.data.code === 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            //                            row = res.data.data;
            for (let i = 0; i < newRows.length; i++) {
              if (newRows[i].id === res.data.data.id) {
                console.log(res.data.data);
                newRows[i] = res.data.data;
                break;
              }
            }
            this.detailAllocGrid.orderDetailAlloc = newRows;
            console.log(this.detailAllocGrid.orderDetailAlloc);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          this.detailAllocGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    rowSaveDetail(row, index, e) {
      this.detailGrid.listLoading = true;
      //NProgress.start();
      let _this = this;
      let para = Object.assign({}, row);
      let newRows = this.detailGrid.orderDetail.concat([]);
      saveOutboundDetail({ detail: JSON.stringify(para) })
        .then((res) => {
          this.detailGrid.listLoading = false;
          //NProgress.done();
          if (res.data.code === 200) {
            // this.$message({
            //   message: res.data.msg,
            //   type: "success",
            // });
            //                            row = res.data.data;
            for (let i = 0; i < newRows.length; i++) {
              if (newRows[i].id === res.data.data.id) {
                console.log(res.data.data);
                newRows[i] = res.data.data;
                break;
              }
            }
            this.detailGrid.orderDetail = newRows;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          this.detailGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    batchAddPopWinQuery: function () {
      if (this.batchAddPopWin.batchAddPopWinActiveName === "sale") {
        this.getSaleData();
      } else if (this.batchAddPopWin.batchAddPopWinActiveName === "sku") {
        this.getSkuData();
      }
    },
    getSaleData: function () {
      let para = {
        page: this.batchAddPopWin.page,
        size: this.batchAddPopWin.size,
        conditions: JSON.stringify(this.batchAddPopWin.filters),
      };
      this.batchAddPopWin.saleListLoading = true;
      //NProgress.start();
      queryHistorySale(para)
        .then((res) => {
          this.batchAddPopWin.saleTotal = res.data.size;
          this.batchAddPopWin.saleList = res.data.list;
          this.batchAddPopWin.saleListLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.batchAddPopWin.saleListLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },

    getSkuData: function () {
      let para = {
        page: this.batchAddPopWin.page,
        size: this.batchAddPopWin.size,
        conditions: JSON.stringify(this.batchAddPopWin.filters),
      };
      this.batchAddPopWin.listLoading = true;
      //NProgress.start();
      getFittingSkuListPage(para)
        .then((res) => {
          this.batchAddPopWin.total = res.data.size;
          this.batchAddPopWin.skuList = res.data.list;
          this.batchAddPopWin.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.batchAddPopWin.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    addSale: function (row, event) {
      let para = {};
      para.buyerCode = this.orderHeader.buyerCode;
      para.status = "00";
      para.skuCode = row.skuCode;
      para.orderNo = this.orderHeader.orderNo;
      para.planShipLoc = "SORTATION";
      para.outboundNum = 0;
      para.outboundOriginNum = 0;
      para.outboundAllocNum = 0;
      para.outboundPickNum = 0;
      para.outboundShipNum = 0;
      para.outboundPrice = row.outboundPrice;
      saveOutboundDetail({ detail: JSON.stringify(para) })
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
          this.getDetails();
          this.getDetailAllocs();
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    addSku: function (row, event) {
      let para = {};
      para.buyerCode = this.orderHeader.buyerCode;
      para.status = "00";
      para.skuCode = row.fittingSkuCode;
      para.orderNo = this.orderHeader.orderNo;
      para.planShipLoc = "SORTATION";
      para.outboundNum = 0;
      para.outboundOriginNum = 0;
      para.outboundAllocNum = 0;
      para.outboundPickNum = 0;
      para.outboundShipNum = 0;
      para.outboundPrice = row.price === null ? 0 : row.price;
      saveOutboundDetail({ detail: JSON.stringify(para) })
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
          this.getDetails();
          this.getDetailAllocs();
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    batchAdd: function () {
      let skuCodeArray = [];
      let priceArray = [];
      let data = null;
      if (this.batchAddPopWin.batchAddPopWinActiveName === "sale") {
        data = this.batchAddPopWin.saleSels;
      } else if (this.batchAddPopWin.batchAddPopWinActiveName === "sku") {
        data = this.batchAddPopWin.sels;
      }
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        if (this.batchAddPopWin.batchAddPopWinActiveName === "sale") {
          skuCodeArray.push(data[i].skuCode);
        } else if (this.batchAddPopWin.batchAddPopWinActiveName === "sku") {
          skuCodeArray.push(data[i].fittingSkuCode);
        }
        if (
          data[i].outboundPrice !== "" &&
          data[i].outboundPrice !== null &&
          data[i].outboundPrice !== undefined
        ) {
          priceArray.push(data[i].outboundPrice);
        } else {
          priceArray.push(0);
        }
      }
      let para = {
        orderNo: this.orderHeader.orderNo,
        buyerCode: this.orderHeader.buyerCode,
        skuCodes: skuCodeArray.join(","),
        prices: priceArray.join(","),
      };
      console.log(para);
      batchSaveOutboundDetail(para)
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
          // this.pageControl.batchAddPopWinVisiable = false;
          this.getDetails();
        })
        .catch((data) => {
          this.pageControl.batchAddPopWinVisiable = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    queryHistoryPrice: function (queryString, cb) {
      if (
        this.detailGrid.editForm.skuCode === "" ||
        this.detailGrid.editForm.skuCode === null
      ) {
        return;
      }
      var restaurants = this.restaurants;
      var results = {};
      let para = {};
      para["page"] = 1;
      para["size"] = 10;
      let queryConditions = {};
      queryConditions["buyerCode"] = this.detailGrid.editForm.buyerCode;
      queryConditions["skuCode"] = this.detailGrid.editForm.skuCode;
      para["conditions"] = JSON.stringify(queryConditions);
      queryHistoryPrice(para).then((res) => {
        results = this.converte(res.data.list);
        cb(results);
        //NProgress.done();
      });
    },
    converte(data) {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        result.push({
          price: data[i].outboundPrice,
          date: util.formatDate.format(
            new Date(data[i].modifyTime),
            "yyyy-MM-dd hh:mm:ss"
          ),
        });
      }
      return result;
    },
    handlePriceSelect: function (item) {
      this.detailGrid.editForm.outboundPrice = item.price;
    },
    save() {
      this.$refs.orderHeader.validate((valid) => {
        if (valid) {
          this.pageControl.saveBtnLoading = true;
          saveOutboundOrder({ order: JSON.stringify(this.orderHeader) }).then(
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
              this.updateOrderHeader(res.data.data);
              this.$store.commit(
                "changeOutboundOrderNo",
                this.orderHeader.orderNo
              );
              this.$store.commit("changeOutboundStatus", "EDIT");
              this.getDetails();
              this.getDetailAllocs();
            }
          );
        }
      });
    },
    editSubmit() {
      let _this = this;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.pageControl.editLoading = true;
          //NProgress.start();
          let para = Object.assign({}, this.detailGrid.editForm);
          saveOutboundDetail({ detail: JSON.stringify(para) })
            .then((res) => {
              this.pageControl.editLoading = false;
              //NProgress.done();
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 500,
                });
              } else {
                this.$message.error(res.data.msg);
              }
              _this.$refs["editForm"].resetFields();
              // _this.$refs["popWinInput"].focus();
              // this.pageControl.editFormVisible = false;
              // 新增
              if (this.detailGrid.editForm.id == "") {
                this.addDetailHandler();
              } else {
                // 更新
                this.detailGrid.editForm = {};
                if (
                  this.detailGrid.currentIndex ===
                  this.detailGrid.orderDetail.length - 1
                ) {
                  this.detailGrid.currentIndex = 0;
                  alert("已编辑完最后一条数据，回到第一条数据！");
                } else {
                  this.detailGrid.currentIndex++;
                }
                this.detailGrid.editForm = Object.assign(
                  {},
                  this.detailGrid.orderDetail[this.detailGrid.currentIndex]
                );
              }
              this.getDetails();
              this.getDetailAllocs();
            })
            .catch((data) => {
              this.pageControl.editLoading = false;
              util.errorCallBack(data, this.$router, this.$message);
            });
        }
      });
    },
    allocSubmit() {
      this.pageControl.allocSubmitLoading = true;
      //NProgress.start();
      let para = {
        orderNo: this.orderHeader.orderNo,
        lineNos: [this.detailGrid.editForm.lineNo].join(","),
        type: "AUTO",
      };
      let _this = this;
      alloc(para)
        .then((res) => {
          this.pageControl.allocSubmitLoading = false;
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
          this.pageControl.editFormVisible = false;
          this.getOrder();
        })
        .catch((data) => {
          this.pageControl.allocSubmitLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    preAssembleAllocSubmit() {
      this.pageControl.preAssembleAllocSubmitLoading = true;
      //NProgress.start();
      let para = {
        orderNo: this.orderHeader.orderNo,
        lineNos: [this.detailGrid.editForm.lineNo].join(","),
        type: "ASS",
      };
      let _this = this;
      alloc(para)
        .then((res) => {
          this.pageControl.preAssembleAllocSubmitLoading = false;
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
          this.pageControl.editFormVisible = false;
          this.getOrder();
        })
        .catch((data) => {
          this.pageControl.preAssembleAllocSubmitLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    cancelAllocSubmit() {
      this.pageControl.allocSubmitLoading = true;
      //NProgress.start();
      let para = {
        orderNo: this.orderHeader.orderNo,
        lineNos: [this.detailGrid.editForm.lineNo].join(","),
      };
      let _this = this;
      cancelAlloc(para)
        .then((res) => {
          this.pageControl.allocSubmitLoading = false;
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
          this.pageControl.editFormVisible = false;
          this.getOrder();
        })
        .catch((data) => {
          this.pageControl.allocSubmitLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    pickAllocSubmit() {
      let _this = this;
      this.$refs.allocEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认拣货吗？", "提示", {}).then(() => {
            this.pageControl.pickAllocLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailAllocGrid.editForm);
            pick({
              alloc: JSON.stringify(para),
              pickNum: this.detailAllocGrid.editForm.pickNum,
            })
              .then((res) => {
                this.pageControl.pickAllocLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["allocEditForm"].resetFields();
                this.pageControl.allocEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.pickAllocLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    cancelPickAllocSubmit() {
      let _this = this;
      this.$refs.allocEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("取消拣货吗？", "提示", {}).then(() => {
            this.pageControl.pickAllocLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailAllocGrid.editForm);
            cancelPick({ alloc: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.pickAllocLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["allocEditForm"].resetFields();
                this.pageControl.allocEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.pickAllocLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    shipAllocSubmit() {
      let _this = this;
      this.$refs.allocEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认发货吗？", "提示", {}).then(() => {
            this.pageControl.pickAllocLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailAllocGrid.editForm);
            ship({ alloc: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.pickAllocLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["allocEditForm"].resetFields();
                this.pageControl.allocEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.pickAllocLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    cancelShipAllocSubmit() {
      let _this = this;
      this.$refs.allocEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("取消发货吗？", "提示", {}).then(() => {
            this.pageControl.pickAllocLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailAllocGrid.editForm);
            cancelShip({ alloc: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.pickAllocLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["allocEditForm"].resetFields();
                this.pageControl.allocEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.pickAllocLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    allocByHeaderHandler() {
      this.pageControl.allocByHeaderBtnLoading = true;
      //NProgress.start();
      allocByHeader({ orderNo: this.orderHeader.orderNo })
        .then((res) => {
          this.pageControl.allocByHeaderBtnLoading = false;
          //NProgress.done();
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else if (res.data.code == 100) {
            let str = "";
            for (let i = 0; i < res.data.msgs.length; i++) {
              str = str + res.data.msgs[i] + "</br>";
            }
            this.$alert(str, "操作结果", {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "确定",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.getOrder();
        })
        .catch((data) => {
          this.pageControl.allocByHeaderBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    cancelAllocByHeaderHandler() {
      this.pageControl.cancelAllocByHeaderBtnLoading = true;
      //NProgress.start();
      cancelAllocByHeader({ orderNo: this.orderHeader.orderNo })
        .then((res) => {
          this.pageControl.cancelAllocByHeaderBtnLoading = false;
          //NProgress.done();
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else if (res.data.code == 100) {
            let str = "";
            for (let i = 0; i < res.data.msgs.length; i++) {
              str = str + res.data.msgs[i] + "</br>";
            }
            this.$alert(str, "操作结果", {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "确定",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.getOrder();
        })
        .catch((data) => {
          this.pageControl.cancelAllocByHeaderBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    pickByHeaderHandler() {
      this.$confirm("确定拣货吗？", "提示", {}).then(() => {
        this.pageControl.pickByHeaderBtnLoading = true;
        //NProgress.start();
        pickByHeader({ orderNo: this.orderHeader.orderNo })
          .then((res) => {
            this.pageControl.pickByHeaderBtnLoading = false;
            //NProgress.done();
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getOrder();
          })
          .catch((data) => {
            this.pageControl.pickByHeaderBtnLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    shipByHeaderHandler() {
      this.$confirm("确定发货吗？", "提示", {}).then(() => {
        this.pageControl.shipByHeaderBtnLoading = true;
        //NProgress.start();
        shipByHeader({ orderNo: this.orderHeader.orderNo })
          .then((res) => {
            this.pageControl.shipByHeaderBtnLoading = false;
            //NProgress.done();
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getOrder();
          })
          .catch((data) => {
            this.pageControl.shipByHeaderBtnLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    cancelShipByHeaderHandler() {
      this.$confirm("取消发货吗？", "提示", {}).then(() => {
        this.pageControl.cancelShipByHeaderBtnLoading = true;
        //NProgress.start();
        cancelShipByHeader({ orderNo: this.orderHeader.orderNo })
          .then((res) => {
            this.pageControl.cancelShipByHeaderBtnLoading = false;
            //NProgress.done();
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getOrder();
          })
          .catch((data) => {
            this.pageControl.cancelShipByHeaderBtnLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
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
            this.updateOrderHeader(res.data.data);
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
            this.updateOrderHeader(res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    close() {
      //NProgress.start();
      let orderNos = [this.orderHeader.orderNo].join(",");
      let para = { orderNos: orderNos };
      close(para)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    getOrder() {
      getOutboundOrderHeader({ orderNo: this.orderNo })
        .then((res) => {
          this.updateOrderHeader(res.data);
          this.getDetails();
          this.getDetailAllocs();
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    getDetails() {
      this.detailGrid.listLoading = true;
      let para = {
        page: this.detailGrid.page,
        size: this.detailGrid.size,
        conditions: JSON.stringify({ orderNo: this.orderHeader.orderNo }),
      };
      getOutboundDetailListPage(para)
        .then((res) => {
          this.detailGrid.total = res.data.size;
          this.detailGrid.orderDetail = res.data.list;
          this.detailGrid.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.detailGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    handleCurrentDetailChange(val) {
      this.detailGrid.page = val;
      this.getDetails();
    },
    handleCurrentAllocDetailChange(val) {
      this.detailAllocGrid.page = val;
      this.getDetailAllocs();
    },
    getDetailAllocs() {
      this.detailAllocGrid.listLoading = true;
      let para = {
        page: this.detailAllocGrid.page,
        size: this.detailAllocGrid.size,
        conditions: JSON.stringify({ orderNo: this.orderHeader.orderNo }),
      };
      getOutboundAllocListPage(para)
        .then((res) => {
          this.detailAllocGrid.total = res.data.size;
          this.detailAllocGrid.orderDetailAlloc = res.data.list;
          this.detailAllocGrid.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.detailAllocGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },

    back() {
      console.log(this.$store.state.outboundDetail.fromPath);
      this.$router.push({ path: this.$store.state.outboundDetail.fromPath });
      // this.$router.push({ path: '/outbound' });
    },
    nextOrder() {
      selectNextOrderNo({
        orderTime: util.formatDate.format(
          this.orderHeader.orderTime,
          "yyyy-MM-dd hh:mm:ss"
        ),
      })
        .then((res) => {
          if (res.data === null || res.data === "" || res.data == undefined) {
            this.$message.error("已经是最后一个订单");
          } else {
            this.$store.commit("changeOutboundOrderNo", res.data);
            this.getOrder();
          }
          // this.$router.push({ path: "/outboundDetail" });
        })
        .catch((data) => {
          this.pageControl.allocByHeaderBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    preOrder() {
      selectPreOrderNo({
        orderTime: util.formatDate.format(
          this.orderHeader.orderTime,
          "yyyy-MM-dd hh:mm:ss"
        ),
      })
        .then((res) => {
          if (res.data === null || res.data === "" || res.data == undefined) {
            this.$message.error("已经是第一个订单");
          } else {
            this.$store.commit("changeOutboundOrderNo", res.data);
            this.getOrder();
          }
          // this.$router.push({ path: "/outboundDetail" });
        })
        .catch((data) => {
          this.pageControl.allocByHeaderBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    addDetailHandler() {
      this.detailGrid.editForm = {
        id: "",
        orderNo: this.orderHeader.orderNo,
        lineNo: "",
        status: "00",
        buyerCode: this.orderHeader.buyerCode,
        skuCode: "",
        outboundNum: 0,
        outboundAllocNum: 0,
        outboundPickNum: 0,
        outboundShipNum: 0,
        outboundPrice: 0,
        planShipLoc: "SORTATION",
        cost: 0,
        remark: "",
        creator: "",
        createTime: "",
        modifier: "",
        modifyTime: "",
        rec_ver: "",
        companyId: "",
        warehouseId: "",
      };
      this.pageControl.editFormVisible = true;
    },
    openExcelImportPopWin() {
      this.pageControl.excelImportPopWinVisible = true;
      this.detailGrid.excelImportPopWinForm = {
        orderNo: "",
        skuCodeColumnName: "",
        priceColumnName: "",
        numColumnName: "",
        loc: "",
      };
      this.detailGrid.excelImportPopWinForm.orderNo = this.orderHeader.orderNo;
    },
    handleDetailEdit(index, row) {
      this.detailGrid.editForm = {};
      this.pageControl.editFormVisible = true;
      this.detailGrid.currentIndex = index;
      this.detailGrid.editForm = Object.assign({}, row);
    },
    handleDetailDel(index, row) {
      let ids = [row.id].join(",");
      let orderNo = this.orderHeader.orderNo;
      this.$confirm("确认删除记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.detailGrid.listLoading = true;
        //NProgress.start();
        let para = { ids: ids, orderNo: orderNo };
        removeOutboundDetail(para)
          .then((res) => {
            this.detailGrid.listLoading = false;
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.getDetails();
          })
          .catch((data) => {
            this.detailGrid.listLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    handelBatchDelAndCreateNew() {
      let idArray = [];
      let errorMsg = "";
      for (let i = 0; i < this.detailGrid.sels.length; i++) {
        if (this.detailGrid.sels[i].status === "00") {
          idArray.push(this.detailGrid.sels[i].id);
        } else {
          errorMsg +=
            "行号[" +
            this.detailGrid.sels[i].lineNo +
            "]的明细不是创建状态，不能删除</br>";
        }
      }
      if (idArray.length === 0) {
        this.$alert(errorMsg, "操作结果", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
        });
        return;
      }
      let ids = idArray.join(",");
      let orderNo = this.orderHeader.orderNo;
      this.$confirm("确认删除记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.detailGrid.listLoading = true;
        //NProgress.start();
        let para = { ids: ids, orderNo: orderNo };
        removeOutboundDetailAndCreateNewOrder(para)
          .then((res) => {
            this.detailGrid.listLoading = false;
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$alert(errorMsg + res.data.msg, "操作结果", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
              });
              //this.$message.error();
            }
            this.getDetails();
          })
          .catch((data) => {
            this.detailGrid.listLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    handelBatchDel() {
      let idArray = [];
      let errorMsg = "";
      for (let i = 0; i < this.detailGrid.sels.length; i++) {
        if (this.detailGrid.sels[i].status === "00") {
          idArray.push(this.detailGrid.sels[i].id);
        } else {
          errorMsg +=
            "行号[" +
            this.detailGrid.sels[i].lineNo +
            "]的明细不是创建状态，不能删除</br>";
        }
      }
      if (idArray.length === 0) {
        this.$alert(errorMsg, "操作结果", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
        });
        return;
      }
      let ids = idArray.join(",");
      let orderNo = this.orderHeader.orderNo;
      this.$confirm("确认删除记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.detailGrid.listLoading = true;
        //NProgress.start();
        let para = { ids: ids, orderNo: orderNo };
        removeOutboundDetail(para)
          .then((res) => {
            this.detailGrid.listLoading = false;
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$alert(errorMsg + res.data.msg, "操作结果", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
              });
              //this.$message.error();
            }
            this.getDetails();
          })
          .catch((data) => {
            this.detailGrid.listLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    handleAllocDetailEdit(index, row) {
      this.detailAllocGrid.editForm = {};
      this.pageControl.allocEditFormVisible = true;
      this.detailAllocGrid.editForm = Object.assign({}, row);
    },
    allocEditSubmit() {
      let _this = this;
      this.$refs.allocEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认收货吗？", "提示", {}).then(() => {
            this.pageControl.allocEditLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailAllocGrid.editForm);
            receive({ receive: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.allocEditLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["allocEditForm"].resetFields();
                this.pageControl.allocEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.allocEditFormVisible = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    cancleAllocEditSubmit() {
      let _this = this;
      this.$refs.allocEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("取消收货吗？", "提示", {}).then(() => {
            this.pageControl.cancelAllocEditLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailAllocGrid.editForm);
            cancelReceive({ receive: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.cancelAllocEditLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["allocEditForm"].resetFields();
                this.pageControl.allocEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.allocEditFormVisible = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
  },
  mounted() {
    if (this.status === "EDIT") {
      this.getOrder();
    } else if (this.status === "ADD") {
      this.orderHeader = {
        id: "",
        orderNo: "",
        buyerCode: "",
        status: "00",
        orderTime: new Date(),
        auditOp: "",
        auditStatus: "00",
        auditTime: null,
        outboundType: "",
        isCalculated: "N",
        isCostCalculated: "N",
        voucherId: 0,
        costVoucherId: 0,
        trackingNo: null,
        logisticsNo: null,
        freight: 0,
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

.el-table .picksuccess-row {
  background: #4eb319;
}
.export-excel-wrapper {
  display: inline;
}
</style>
