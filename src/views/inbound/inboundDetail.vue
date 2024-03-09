<template>
  <section>
    <div v-title data-title="入库单详情"></div>
    <el-steps :active="active" finish-status="success" style="margin-top: 20px; margin-bottom: 20px">
      <el-step title="创建订单"></el-step>
      <el-step title="完成审核（可取消）"></el-step>
      <el-step title="完成收货（可取消）"></el-step>
      <el-step title="完成入库核算"></el-step>
      <el-step title="关闭订单"></el-step>
    </el-steps>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" :disabled="btnAuditStatus" @click="audit"
        :loading="pageControl.auditBtnLoading">审核</el-button>
      <el-button type="primary" :disabled="btnCancelAuditStatus" @click="cancelAudit"
        :loading="pageControl.cancelAuditBtnLoading">取消审核</el-button>
      <el-button type="success" :disabled="btnAccountStatus" @click="account"
        :loading="pageControl.accountBtnLoading">入库核算</el-button>
      <el-button type="success" :disabled="btnCancelAccountStatus" @click="cancelAccount"
        :loading="pageControl.cancelAccountBtnLoading">取消核算</el-button>
      <el-button type="danger" :disabled="btnCloseStatus" @click="close"
        :loading="pageControl.closeBtnLoading">关闭订单</el-button>
      <!-- <el-button
        type="success"
        :disabled="btnAccountCostStatus"
        @click="accountCost"
        :loading="pageControl.accountCostBtnLoading"
        >成本核算</el-button
      > -->
      <el-button @click="back" style="float: right">返回</el-button>
      <el-button @click="nextOrder" icon="el-icon-caret-right" type="primary" style="float: right" circle></el-button>
      <el-button @click="preOrder" icon="el-icon-caret-left" type="primary" style="float: right" circle></el-button>
      <!-- <el-button
        type="primary"
        style="float: right"
        @click="printInboundOrder"
        >打印收货单</el-button
      > -->
      <el-popover placement="bottom" trigger="click">
        <el-date-picker v-model="receiveTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
        </el-date-picker>
        <el-button type="primary" style="float: right" @click="printInboundOrder">打印</el-button>
        <el-button type="primary" style="float: right" slot="reference">打印收货单</el-button>
      </el-popover>
    </el-col>

    <el-form :model="orderHeader" label-width="80px" :rules="orderHeaderRules" ref="orderHeader">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-row :gutter="0">
            <span style="line-height: 36px">基本信息</span>

            <el-button type="primary" style="float: right" :disabled="btnSaveHeaderStatus" @click="save"
              :loading="pageControl.saveBtnLoading">保存单头</el-button>
          </el-row>
        </div>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="入库单号" prop="orderNo">
              <el-input v-model="orderHeader.orderNo" disabled auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货主" prop="supplierCode">
              <popwin-button popKey="POP_CUSTOMER" :showName="true" :displayName="orderHeader.supplierName"
                @changeValue="headerSupplierChangeValue" v-model="orderHeader.supplierCode"></popwin-button>
              <!--<el-input v-model="orderHeader.supplierCode" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="orderHeader.status" disabled placeholder="请选择">
                <el-option v-for="item in inboundStatus" :key="item.code" :label="item.name" :value="item.code">
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
              <el-date-picker v-model="orderHeader.orderTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
              <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item label="入库类型" prop="inboundType">
              <el-select v-model="orderHeader.inboundType" placeholder="请选择">
                <el-option v-for="item in inboundType" :key="item.code" :label="item.name" :value="item.code">
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
              <el-select v-model="orderHeader.auditStatus" disabled placeholder="请选择">
                <el-option v-for="item in auditStatus" :key="item.code" :label="item.name" :value="item.code">
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
              <el-date-picker v-model="orderHeader.auditTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间" disabled>
              </el-date-picker>
              <!--<el-input v-model="orderHeader.auditTime" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核人" prop="auditOp">
              <el-input v-model="orderHeader.auditOp" disabled auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="orderHeader.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总价" prop="totalPrice">
              <el-input v-model="totalPrice" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库核算" prop="isCalculated">
              <el-select :disabled="true" v-model="orderHeader.isCalculated" placeholder="请选择">
                <el-option v-for="item in YESORNO" :key="item.code" :label="item.name" :value="item.code">
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
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 15px">入库单明细</span>
        </div>
        <el-table :data="detailGrid.orderDetail" border highlight-current-row v-loading="detailGrid.listLoading"
          @selection-change="selsChange" stripe style="width: 100%">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="lineNo" label="行号" width="80" sortable>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
          </el-table-column>
          <el-table-column prop="skuCode" label="产品编码" width="100">
          </el-table-column>
          <el-table-column prop="quickCode" label="快速编码" width="100">
          </el-table-column>
          <el-table-column prop="fittingSkuName" label="产品名称" width="200">
          </el-table-column>
          <el-table-column prop="modelCode" label="车型" width="200">
          </el-table-column>
          <el-table-column prop="inboundPreNum" label="预收数" width="80">
          </el-table-column>
          <el-table-column prop="inboundPrice" label="收货价格" width="80">
          </el-table-column>
          <el-table-column prop="inboundNum" label="实收数" width="80">
          </el-table-column>
          <el-table-column prop="orderNo" label="入库单号" width="200">
          </el-table-column>
          <el-table-column prop="supplierCode" label="客户编码" width="200">
          </el-table-column>
          <el-table-column prop="supplierName" label="客户名称" width="200">
          </el-table-column>

          <el-table-column prop="cost" label="成本" width="200">
          </el-table-column>
          <el-table-column prop="planLoc" label="计划库位" width="200">
          </el-table-column>
          <el-table-column prop="isCreatedVoucher" label="是否已生成凭证" width="200">
          </el-table-column>
          <el-table-column prop="voucherNo" label="凭证号" width="200">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
          <!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
          <!--</el-table-column>-->

          <el-table-column label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button size="small" @click="handleDetailEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" :disabled="btnDetailGridDelStatus" size="small"
                @click="handleDetailDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-button type="primary" :disabled="btnDetailGridAddStatus" @click="addDetailHandler">新增</el-button>

          <el-button type="primary" :disabled="btnDetailGridAddStatus" @click="openBatchAddPopWin">快速新增</el-button>
          <!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange"
            :page-size="detailGrid.size" :total="detailGrid.total" style="float: right">
          </el-pagination>
        </el-col>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 15px">入库单收货明细</span>
        </div>
        <el-table :data="detailReceiveGrid.orderDetailReceive" border highlight-current-row
          v-loading="detailReceiveGrid.listLoading" @selection-change="recSelsChange" stripe style="width: 100%">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="lineNo" label="行号" width="80" sortable>
          </el-table-column>
          <el-table-column prop="recLineNo" label="收货明细行号" width="80" sortable>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
          </el-table-column>
          <el-table-column prop="skuCode" label="产品编码" width="80">
          </el-table-column>
          <el-table-column prop="fittingSkuName" label="产品名称" width="200">
          </el-table-column>
          <el-table-column prop="modelCode" label="车型" width="200">
          </el-table-column>
          <el-table-column prop="inboundPreNum" label="预收数" width="80">
          </el-table-column>
          <el-table-column prop="inboundNum" label="实收数" width="80">
          </el-table-column>
          <el-table-column prop="inboundPrice" label="收货价格" width="80">
          </el-table-column>
          <el-table-column prop="recTime" label="收货时间" width="155" :formatter="formatTime">
          </el-table-column>
          <el-table-column prop="inboundLocCode" label="收货库位" width="80">
          </el-table-column>
          <el-table-column prop="orderNo" label="入库单号" width="200">
          </el-table-column>
          <el-table-column prop="supplierCode" label="客户编码" width="80">
          </el-table-column>
          <el-table-column prop="supplierName" label="客户名称" width="200">
          </el-table-column>
          <el-table-column prop="cost" label="成本" width="80">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
          <!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
          <!--</el-table-column>-->

          <el-table-column label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <el-button size="small" @click="handleRecDetailEdit(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-button type="primary" @click="batchRecEditSubmit" :loading="pageControl.batchRecEditSubmitLoading"
            :disabled="this.detailReceiveGrid.sels.length === 0">批量收货</el-button>
          <!--<el-button type="primary" @click="recDetailConfirm">收货确认</el-button>-->
          <!--<el-button type="danger" @click="recDetailCancel" :disabled="this.detailGrid.sels.length===0">取消收货</el-button>-->
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentReceivesDetailChange"
            :page-size="detailReceiveGrid.size" :total="detailReceiveGrid.total" style="float: right">
          </el-pagination>
        </el-col>
      </el-card>
    </el-form>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="pageControl.editFormVisible" :close-on-click-modal="false">
      <el-form :model="detailGrid.editForm" label-width="80px" :rules="detailGrid.editFormRules" ref="editForm">
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="货主" prop="supplierCode">
              <popwin-button popKey="POP_CUSTOMER" :disabled="true" :showName="true"
                :displayName="detailGrid.editForm.supplierName"
                v-model="detailGrid.editForm.supplierCode"></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="skuCode">
              <popwin-button popKey="POP_SKU" @changeValue="editFormSkuChangeValue"
                v-model="detailGrid.editForm.skuCode"></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="fittingSkuName">
              <el-input v-model="detailGrid.editForm.fittingSkuName" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="modelCode">
              <el-input v-model="detailGrid.editForm.modelCode" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="detailGrid.editForm.status" :disabled="true" placeholder="请选择">
                <el-option v-for="item in inboundStatus" :key="item.code" :label="item.name" :value="item.code">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.code
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货价格" prop="inboundPrice">
              <el-input-number v-model="detailGrid.editForm.inboundPrice" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="预收数" prop="inboundPreNum">
              <el-input-number v-model="detailGrid.editForm.inboundPreNum" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实收数" prop="inboundNum">
              <el-input-number v-model="detailGrid.editForm.inboundNum" :disabled="true"
                auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="计划库位" prop="planLoc">
              <popwin-button popKey="POP_LOC" :staticCondition="{ useType: 'RS' }"
                :selectValue="detailGrid.editForm.planLoc" v-model="detailGrid.editForm.planLoc"></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本" prop="cost">
              <el-input-number v-model="detailGrid.editForm.cost" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="detailGrid.editForm.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="pageControl.editFormVisible = false">取消</el-button>
        <el-button type="primary" :disabled="btnEditSubmitStatus" @click.native="editSubmit"
          :loading="pageControl.editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="pageControl.recEditFormVisible" :close-on-click-modal="false">
      <el-form :model="detailReceiveGrid.editForm" label-width="80px" :rules="detailReceiveGrid.editFormRules"
        ref="recEditForm">
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="货主" prop="supplierCode">
              <popwin-button popKey="POP_CUSTOMER" :disabled="true" :selectValue="detailReceiveGrid.editForm.supplierCode"
                v-model="detailReceiveGrid.editForm.supplierCode"></popwin-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="skuCode">
              <popwin-button popKey="POP_SKU" :selectValue="detailReceiveGrid.editForm.skuCode" :disabled="true"
                v-model="detailReceiveGrid.editForm.skuCode"></popwin-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="fittingSkuName">
              <el-input v-model="detailReceiveGrid.editForm.fittingSkuName" :disabled="true"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="modelCode">
              <el-input v-model="detailReceiveGrid.editForm.modelCode" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="detailReceiveGrid.editForm.status" :disabled="true" placeholder="请选择">
                <el-option v-for="item in inboundStatus" :key="item.code" :label="item.name" :value="item.code">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.code
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货价格" prop="inboundPrice">
              <el-input-number v-model="detailReceiveGrid.editForm.inboundPrice" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="预收数" prop="inboundPreNum">
              <el-input-number v-model="detailReceiveGrid.editForm.inboundPreNum" disabled
                auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实收数" prop="inboundNum">
              <el-input-number v-model="detailReceiveGrid.editForm.inboundNum" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="计划库位" prop="planLoc">
              <popwin-button popKey="POP_LOC" :staticCondition="{ useType: 'RS' }"
                :selectValue="detailReceiveGrid.editForm.planLoc" :disabled="true"
                v-model="detailReceiveGrid.editForm.planLoc"></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本" prop="cost">
              <el-input-number v-model="detailReceiveGrid.editForm.cost" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="实际库位" prop="inboundLocCode">
              <popwin-button popKey="POP_LOC" :staticCondition="{ useType: 'RS' }"
                :selectValue="detailReceiveGrid.editForm.inboundLocCode"
                v-model="detailReceiveGrid.editForm.inboundLocCode"></popwin-button>
              <!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="detailReceiveGrid.editForm.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="pageControl.recEditFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="recEditSubmit" :disabled="btnRecEditStatus"
          :loading="pageControl.recEditLoading">收货确认</el-button>
        <el-button type="danger" @click.native="cancleRecEditSubmit" :disabled="btnCancelRecEditStatus"
          :loading="pageControl.cancelRecEditLoading">取消收货</el-button>
      </div>
    </el-dialog>
    <el-dialog title="快速新增" border :visible.sync="pageControl.batchAddPopWinVisiable">
      <el-form :inline="true" :model="batchAddPopWin.filters">
        <el-form-item label="配件类型" prop="fittingTypeCode">
          <popwin-button popKey="POP_FITTINGTYPE" :selectValue="batchAddPopWin.filters.fittingTypeCode"
            v-model="batchAddPopWin.filters.fittingTypeCode"></popwin-button>
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
        <el-form-item label="供应商" prop="supplierCode">
          <popwin-button popKey="POP_CUSTOMER" :selectValue="batchAddPopWin.filters.supplierCode"
            v-model="batchAddPopWin.filters.supplierCode"></popwin-button>
          <!--<el-input v-model="orderHeader.supplierCode" auto-complete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="客户" prop="buyerCode">
          <popwin-button popKey="POP_CUSTOMER" :selectValue="batchAddPopWin.filters.buyerCode"
            v-model="batchAddPopWin.filters.buyerCode"></popwin-button>
          <!--<el-input v-model="orderHeader.supplierCode" auto-complete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="当前数量" prop="currentNum">
          <el-input-number :precision="1" :min="0.5" v-model="batchAddPopWin.currentNum"
            auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="收货价格" prop="inboundPrice">
          <el-input-number v-model="batchAddPopWin.inboundPrice" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="退货成本" prop="cost">
          <el-input-number v-model="batchAddPopWin.cost" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="batchAddPopWinQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="batchAddPopWin.batchAddPopWinActiveName">
        <el-tab-pane label="采购历史" name="procure">
          <el-table max-height="500" border :data="batchAddPopWin.procureList" @row-dblclick="addProcure"
            v-loading="batchAddPopWin.procureListLoading" @selection-change="batchAddProcureSelsChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="skuCode" label="商品编码" width="150"></el-table-column>
            <el-table-column property="fittingSkuName" label="商品名称" width="200"></el-table-column>
            <el-table-column property="customerName" label="供应商名称" width="200"></el-table-column>
            <el-table-column property="modelCode" label="车型"></el-table-column>
            <el-table-column property="inboundPrice" label="入库价格"></el-table-column>
            <el-table-column property="modifyTime" label="入库时间" :formatter="formatTime"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-button type="primary" v-on:click="batchAdd">批量新增</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleBatchProcureAddCurrentChange"
              :page-size="batchAddPopWin.procureSize" :total="batchAddPopWin.procureTotal" style="float: right">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="产品信息" name="sku">
          <el-table max-height="500" border :data="batchAddPopWin.skuList" v-loading="batchAddPopWin.listLoading"
            @row-dblclick="addSku" @selection-change="batchAddSelsChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="fittingSkuCode" label="商品编码" width="150"></el-table-column>
            <el-table-column property="fittingSkuName" label="商品名称" width="200"></el-table-column>
            <el-table-column property="modelCode" label="车型"></el-table-column>
            <el-table-column property="price" label="参考价格" width="200"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-button type="primary" v-on:click="batchAdd">批量新增</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleBatchAddCurrentChange"
              :page-size="batchAddPopWin.size" :total="batchAddPopWin.total" style="float: right">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="销售历史" name="sale">
          <el-table max-height="500" border :data="batchAddPopWin.saleList" @row-dblclick="addSale"
            v-loading="batchAddPopWin.saleListLoading" @selection-change="batchAddSaleSelsChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="skuCode" label="商品编码" width="80"></el-table-column>
            <el-table-column property="fittingSkuName" label="商品名称" width="200"></el-table-column>
            <el-table-column property="customerName" label="客户名称" width="200"></el-table-column>
            <el-table-column property="modelCode" label="车型"></el-table-column>
            <el-table-column property="outboundPrice" label="价格"></el-table-column>
            <el-table-column property="cost" label="成本"></el-table-column>
            <el-table-column property="packageCode" label="包装"></el-table-column>
            <el-table-column property="modifyTime" label="发货时间" :formatter="formatTime"></el-table-column>
          </el-table>
          <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleBatchSaleAddCurrentChange"
              :page-size="batchAddPopWin.saleSize" :total="batchAddPopWin.saleTotal" style="float: right">
            </el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import NProgress from "nprogress";
import NP from "number-precision";
import {
  getInboundOrderListPage,
  saveInboundOrder,
  getInboundOrderHeader,
  getInboundDetailListPage,
  saveInboundDetail,
  removeInboundDetail,
  getInboundRecListPage,
  receive,
  batchReceive,
  cancelReceive,
  audit,
  cancelAudit,
  close,
  accountByOrderNo,
  cancelAccountByOrderNo,
  accountCostByOrderNo,
  batchSaveInboundDetail,
  queryHistoryProcure,
  queryHistorySale,
  selectNextOrderNo,
  selectPreOrderNo,
  getMaxInventoryBySkuCode
} from "../../api/inboundApi";
import { getFittingSkuListPage } from "../../api/fittingSkuApi";
var codemaster = require("../../../static/codemaster.json");
var config = require("../../../static/config.json");
export default {
  data() {
    return {
      receiveTime: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
      orderHeader: {
        id: "",
        orderNo: "",
        supplierCode: "",
        status: "",
        isCalculated: "",
        isCostCalculated: "",
        voucherId: 0,
        costVoucherId: 0,
        orderTime: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        auditOp: "",
        auditStatus: "",
        auditTime: "",
        inboundType: "",
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
        editForm: {
          id: "",
          orderNo: "",
          lineNo: "",
          status: "",
          supplierCode: "",
          skuCode: "",
          inboundPreNum: 0,
          inboundNum: 0,
          inboundPrice: 0,
          cost: 0,
          planLoc: "",
          isCreatedVoucher: "N",
          voucherNo: "",
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
          supplierCode: [
            { required: true, message: "请选择货主", trigger: "blur" },
          ],
          skuCode: [{ required: true, message: "请选择产品", trigger: "blur" }],
          inboundPreNum: [
            {
              type: "number",
              required: true,
              message: "请输入预收数",
              trigger: "blur",
            },
          ],
          inboundPrice: [
            {
              type: "number",
              required: true,
              message: "请输入价格",
              trigger: "blur",
            },
          ],
          planLoc: [
            { required: true, message: "请输入计划库位", trigger: "blur" },
          ],
        },
        orderDetail: [],
        page: 1,
        size: 999,
        total: 0,
        listLoading: false,
        sels: [],
      },
      pageControl: {
        saveBtnLoading: false,
        auditBtnLoading: false,
        cancelAuditBtnLoading: false,
        editFormVisible: false,
        editLoading: false,
        recEditFormVisible: false,
        recEditLoading: false,
        cancelRecEditLoading: false,
        closeBtnLoading: false,
        accountBtnLoading: false,
        cancelAccountBtnLoading: false,
        batchRecEditSubmitLoading: false,
        accountCostBtnLoading: false,
        batchAddPopWinVisiable: false,
      },
      detailReceiveGrid: {
        editForm: {
          id: "",
          orderNo: "",
          supplierCode: "",
          status: "",
          lineNo: "",
          recLineNo: "",
          skuCode: "",
          inboundPreNum: 0,
          inboundNum: 0,
          inboundPrice: 0,
          cost: 0,
          planLoc: "",
          inboundLocCode: "",
          recTime: "",
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
          inboundLocCode: [
            { required: true, message: "请输入实收库位", trigger: "blur" },
          ],
          inboundPrice: [
            {
              type: "number",
              required: true,
              message: "请输入价格",
              trigger: "blur",
            },
          ],
          inboundNum: [
            {
              type: "number",
              required: true,
              message: "请输入实际收货数",
              trigger: "blur",
            },
          ],
        },
        orderDetailReceive: [],
        page: 1,
        size: 10,
        total: 0,
        listLoading: false,
        sels: [],
      },
      orderHeaderRules: {
        supplierCode: [
          { required: true, message: "请选择货主", trigger: "blur" },
        ],
        inboundType: [
          { required: true, message: "请选择货主", trigger: "blur" },
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
      batchAddPopWin: {
        batchAddPopWinActiveName: "procure",
        procureList: [],
        procurePage: 1,
        procureSize: 10,
        procureTotal: 0,
        procureListLoading: false,
        procureSels: [],
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
          supplierCode: "",
        },
        currentNum: 0,
        inboundPrice: 0.0,
        cost: 0.0
      },
      inboundStatus: codemaster.WM_INBOUND_STATUS,
      inboundType: codemaster.WM_INBOUND_TYPE,
      auditStatus: codemaster.SYS_AUDIT_STATUS,
      YESORNO: codemaster.SYS_YES_NO,
    };
  },
  computed: {
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
        (this.orderHeader.status === "00" ||
          this.orderHeader.status === "10") &&
        this.orderHeader.auditStatus !== "00"
      ) {
        return 2;
      } else if (this.orderHeader.status === "20") {
        return 3;
      } else if (
        this.orderHeader.status === "99" &&
        this.orderHeader.isCalculated === "N"
      ) {
        return 4;
      } else if (this.orderHeader.status === "99") {
        return 5;
      }
    },
    totalPrice: function () {
      let totalPrice = 0;
      this.detailGrid.orderDetail.forEach((row, index) => {
        totalPrice = NP.plus(
          totalPrice,
          NP.times(row.inboundPrice, row.inboundNum)
        );
      });
      return totalPrice;
    },
    btnEditSubmitStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnDetailGridAddStatus: function () {
      if (this.orderHeader.id === "") {
        return true;
      }
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnDetailGridDelStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnRecEditStatus: function () {
      if (this.orderHeader.auditStatus == "00") {
        return true;
      }
      if (this.detailReceiveGrid.editForm.status === "00") {
        return false;
      } else {
        return true;
      }
    },
    btnCancelRecEditStatus: function () {
      if (
        this.orderHeader.auditStatus == "00" ||
        this.orderHeader.status == "99"
      ) {
        return true;
      }
      if (this.detailReceiveGrid.editForm.status === "00") {
        return true;
      } else {
        return false;
      }
    },
    btnSaveHeaderStatus: function () {
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
    btnCloseStatus: function () {
      if (this.orderHeader.auditStatus === "00") {
        return true;
      }
      if (this.orderHeader.status === "99") {
        return true;
      } else if (this.orderHeader.isCalculated === "Y") {
        return false;
      } else {
        return true;
      }
    },
    btnAccountStatus: function () {
      if (
        this.orderHeader.isCalculated === "N" &&
        this.orderHeader.status === "20"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnCancelAccountStatus: function () {
      if (
        this.orderHeader.isCalculated === "Y" &&
        this.orderHeader.status === "20"
      ) {
        return false;
      } else {
        return true;
      }
    },
    btnAccountCostStatus: function () {
      if (
        this.orderHeader.inboundType == "RI" &&
        this.orderHeader.isCostCalculated === "N" &&
        this.orderHeader.status === "99"
      ) {
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
    orderNo: function () {
      return this.$store.state.inboundDetail.orderNo;
    },
    status: function () {
      return this.$store.state.inboundDetail.status;
    },
  },
  methods: {
    nextOrder() {
      selectNextOrderNo({
        id: this.orderHeader.id,
      })
        .then((res) => {
          if (res.data === null || res.data === "" || res.data == undefined) {
            this.$message.error("已经是最后一个订单");
          } else {
            this.$store.commit("changeInboundOrderNo", res.data);
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
        id: this.orderHeader.id,
      })
        .then((res) => {
          if (res.data === null || res.data === "" || res.data == undefined) {
            this.$message.error("已经是第一个订单");
          } else {
            this.$store.commit("changeInboundOrderNo", res.data);
            this.getOrder();
          }
          // this.$router.push({ path: "/outboundDetail" });
        })
        .catch((data) => {
          this.pageControl.allocByHeaderBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    openBatchAddPopWin: function () {
      this.pageControl.batchAddPopWinVisiable = true;
    },
    handleBatchProcureAddCurrentChange(val) {
      this.batchAddPopWin.procurePage = val;
      this.getProcureData();
    },
    handleBatchSaleAddCurrentChange(val) {
      this.batchAddPopWin.salePage = val;
      this.getSaleData();
    },
    handleBatchAddCurrentChange(val) {
      this.batchAddPopWin.page = val;
      this.getSkuData();
    },
    batchAddProcureSelsChange: function (sels) {
      this.batchAddPopWin.procureSels = sels;
    },
    batchAddSaleSelsChange: function (sels) {
      this.batchAddPopWin.saleSels = sels;
    },
    batchAddSelsChange: function (sels) {
      this.batchAddPopWin.sels = sels;
    },
    batchAddPopWinQuery: function () {
      if (this.batchAddPopWin.batchAddPopWinActiveName === "procure") {
        this.getProcureData();
      } else if (this.batchAddPopWin.batchAddPopWinActiveName === "sku") {
        this.getSkuData();
      } else if (this.batchAddPopWin.batchAddPopWinActiveName === "sale") {
        this.getSaleData();
      }
    },
    // 获取历史销售记录
    getSaleData: function () {
      let para = {
        page: this.batchAddPopWin.salePage,
        size: this.batchAddPopWin.saleSize,
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
    // 获取历史入库记录
    getProcureData: function () {
      let para = {
        page: this.batchAddPopWin.procurePage,
        size: this.batchAddPopWin.procureSize,
        conditions: JSON.stringify(this.batchAddPopWin.filters),
      };
      this.batchAddPopWin.procureListLoading = true;
      //NProgress.start();
      queryHistoryProcure(para)
        .then((res) => {
          this.batchAddPopWin.procureTotal = res.data.size;
          this.batchAddPopWin.procureList = res.data.list;
          this.batchAddPopWin.procureListLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.batchAddPopWin.procureListLoading = false;
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
    printInboundOrder() {
      let user = JSON.parse(localStorage.getItem("user"));
      window.open(
        config.reportUrl +
        "inboundOrder?orderNo=" +
        this.orderHeader.orderNo +
        "&companyId=" +
        user.companyId +
        "&warehouseId=" +
        user.warehouseId +
        "&inboundTime=" +
        this.receiveTime
      );
    },
    addProcure: function (row, event) {
      let para = {};
      para.supplierCode = this.orderHeader.supplierCode;
      para.status = "00";
      para.skuCode = row.skuCode;
      para.orderNo = this.orderHeader.orderNo;
      getMaxInventoryBySkuCode({ skuCode: row.skuCode })
        .then((res) => {
          if (res.data !== '') {
            para.planLoc = res.data.loc_code;
          } else {
            this.$message.error("产品[" + row.skuCode + "]当前没有库存，计划收货库位默认指定为[F3]");
            para.planLoc = "F3";
          }
          para.inboundPreNum = this.batchAddPopWin.currentNum;
          para.inboundNum = 0;
          para.inboundPrice = row.inboundPrice;
          if (this.orderHeader.inboundType === "RI") {
            para.cost = row.inboundPrice;
            if (this.batchAddPopWin.inboundPrice <= 0) {
              this.$message.error("客户退货价格不能为0，请手动填写再双击！");
              return;
            } else {
              para.inboundPrice = this.batchAddPopWin.inboundPrice;
            }
          }
          saveInboundDetail({ detail: JSON.stringify(para) })
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
              this.getDetailReceives();
            })
            .catch((data) => {
              util.errorCallBack(data, this.$router, this.$message);
            });
        });
    },
    addSale: function (row, event) {
      let para = {};
      para.supplierCode = this.orderHeader.supplierCode;
      para.status = "00";
      para.skuCode = row.skuCode;
      para.orderNo = this.orderHeader.orderNo;
      getMaxInventoryBySkuCode({ skuCode: row.skuCode })
        .then((res) => {
          if (res.data !== '') {
            para.planLoc = res.data.loc_code;
          } else {
            this.$message.error("产品[" + row.skuCode + "]当前没有库存，计划收货库位默认指定为[F3]");
            para.planLoc = "F3";
          }
          para.inboundPreNum = this.batchAddPopWin.currentNum;
          para.inboundNum = 0;
          para.inboundPrice = this.batchAddPopWin.inboundPrice;
          if (this.orderHeader.inboundType === "RI") {
            para.inboundPrice = row.outboundPrice;
            para.cost = row.cost;
          }
          saveInboundDetail({ detail: JSON.stringify(para) })
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
              this.getDetailReceives();
            })
            .catch((data) => {
              util.errorCallBack(data, this.$router, this.$message);
            });
        }
        );

    },
    addSku: function (row, event) {
      let para = {};
      para.supplierCode = this.orderHeader.supplierCode;
      para.status = "00";
      para.skuCode = row.fittingSkuCode;
      para.orderNo = this.orderHeader.orderNo;
      getMaxInventoryBySkuCode({ skuCode: row.fittingSkuCode })
        .then((res) => {
          if (res.data !== '') {
            para.planLoc = res.data.loc_code;
          } else {
            this.$message.error("产品[" + row.fittingSkuCode + "]当前没有库存，计划收货库位默认指定为[F3]");
            para.planLoc = "F3";
          }
          para.inboundPreNum = this.batchAddPopWin.currentNum;
          para.inboundNum = 0;
          para.inboundPrice = this.batchAddPopWin.inboundPrice > 0 ? this.batchAddPopWin.inboundPrice : row.price === null ? 0 : row.price;
          if (this.orderHeader.inboundType === "RI") {
            if (this.batchAddPopWin.cost <= 0) {
              this.$message.error("退货入库的入库成本不能为0,请手动填写！");
              return;
            } else {
              para.cost = this.batchAddPopWin.cost;
            }
          }
          saveInboundDetail({ detail: JSON.stringify(para) })
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
              this.getDetailReceives();
            })
            .catch((data) => {
              util.errorCallBack(data, this.$router, this.$message);
            });
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
      for (let i = 0; i < data.length; i++) {
        if (this.batchAddPopWin.batchAddPopWinActiveName === "sale") {
          skuCodeArray.push(data[i].skuCode);
        } else if (this.batchAddPopWin.batchAddPopWinActiveName === "sku") {
          skuCodeArray.push(data[i].fittingSkuCode);
        }
        if (
          data[i].inboundPrice !== "" &&
          data[i].inboundPrice !== null &&
          data[i].inboundPrice !== undefined
        ) {
          priceArray.push(data[i].inboundPrice);
        } else {
          priceArray.push(0);
        }
      }
      let para = {
        orderNo: this.orderHeader.orderNo,
        supplierCode: this.orderHeader.supplierCode,
        skuCodes: skuCodeArray.join(","),
        prices: priceArray.join(","),
      };
      batchSaveInboundDetail(para)
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
    headerSupplierChangeValue(row) {
      this.orderHeader.supplierName = row.customerName;
    },
    autoGetPlanLocCodeBySkuCode(code) {
      let para = { skuCode: code };
      getMaxInventoryBySkuCode(para)
        .then((res) => {
          if (res.data !== '') {
            this.detailGrid.editForm.planLoc = res.data.loc_code;
          } else {
            this.$message.error("产品[" + row.fittingSkuCode + "]当前没有库存，请手动指定一个计划库位！");
          }
        });
    },
    editFormSkuChangeValue(row) {
      this.detailGrid.editForm.fittingSkuName = row.fittingSkuName;
      this.detailGrid.editForm.modelCode = row.modelCode;
      this.autoGetPlanLocCodeBySkuCode(row.fittingSkuCode);
    },
    recEditFormSkuChangeValue(row) {
      this.detailReceiveGrid.editForm.fittingSkuName = row.fittingSkuName;
      this.detailReceiveGrid.editForm.modelCode = row.modelCode;
    },
    formatTime: function (row, column) {
      if (row[column.property] !== null) {
        let unixTimestamp = new Date(row[column.property]);
        return util.formatDate.format(unixTimestamp, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatStatus: function (row, column) {
      return util.getComboNameByValue(codemaster.WM_INBOUND_STATUS, row.status);
    },
    selsChange: function (sels) {
      this.detailGrid.sels = sels;
    },
    recSelsChange: function (sels) {
      this.detailReceiveGrid.sels = sels;
    },
    updateOrderHeader(data) {
      this.orderHeader = Object.assign({}, data);
      //处理时间
      this.orderHeader.orderTime = data.orderTime;
      this.orderHeader.auditTime = data.auditTime;
    },
    save() {
      this.$refs.orderHeader.validate((valid) => {
        if (valid) {
          this.pageControl.saveBtnLoading = true;
          saveInboundOrder({ order: JSON.stringify(this.orderHeader) }).then(
            (res) => {
              NProgress.done();
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
                "changeInboundOrderNo",
                this.orderHeader.orderNo
              );
              this.$store.commit("changeInboundStatus", "EDIT");
              this.getDetails();
              this.getDetailReceives();
            }
          );
        }
      });
    },
    editSubmit() {
      let _this = this;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.pageControl.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailGrid.editForm);
            saveInboundDetail({ detail: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.editLoading = false;
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
                this.getDetails();
                this.getDetailReceives();
              })
              .catch((data) => {
                this.pageControl.editLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
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
      this.pageControl.closeBtnLoading = true;

      //NProgress.start();
      let orderNos = [this.orderHeader.orderNo].join(",");
      let para = { orderNos: orderNos };
      close(para)
        .then((res) => {
          this.pageControl.closeBtnLoading = false;
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
          this.pageControl.closeBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    account() {
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
    cancelAccount() {
      this.pageControl.cancelAccountBtnLoading = true;
      let para = { orderNo: this.orderHeader.orderNo };
      cancelAccountByOrderNo(para)
        .then((res) => {
          this.pageControl.cancelAccountBtnLoading = false;
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
          this.pageControl.cancelAccountBtnLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    accountCost() {
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
    getOrder() {
      getInboundOrderHeader({ orderNo: this.orderNo })
        .then((res) => {
          this.updateOrderHeader(res.data);
          this.getDetails();
          this.getDetailReceives();
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
      getInboundDetailListPage(para)
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
    handleCurrentReceivesDetailChange(val) {
      this.detailReceiveGrid.page = val;
      this.getDetailReceives();
    },
    getDetailReceives() {
      this.detailReceiveGrid.listLoading = true;
      let para = {
        page: this.detailReceiveGrid.page,
        size: this.detailReceiveGrid.size,
        conditions: JSON.stringify({ orderNo: this.orderHeader.orderNo }),
      };
      getInboundRecListPage(para)
        .then((res) => {
          this.detailReceiveGrid.total = res.data.size;
          this.detailReceiveGrid.orderDetailReceive = res.data.list;
          this.detailReceiveGrid.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.detailReceiveGrid.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },

    back() {
      this.$router.push({ path: this.$store.state.inboundDetail.fromPath });
    },
    addDetailHandler() {
      this.detailGrid.editForm = {
        id: "",
        orderNo: this.orderHeader.orderNo,
        lineNo: "",
        status: "00",
        supplierCode: this.orderHeader.supplierCode,
        skuCode: "",
        inboundPreNum: 0,
        inboundNum: 0,
        inboundPrice: 0,
        planLoc: "",
        isCreatedVoucher: "N",
        voucherNo: "",
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
    handleDetailEdit(index, row) {
      this.detailGrid.editForm = {};
      this.pageControl.editFormVisible = true;
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
        removeInboundDetail(para)
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
            this.getDetailReceives();
          })
          .catch((data) => {
            this.detailGrid.listLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    handleRecDetailEdit(index, row) {
      this.detailReceiveGrid.editForm = {};
      this.pageControl.recEditFormVisible = true;
      this.detailReceiveGrid.editForm = Object.assign({}, row);
    },
    recEditSubmit() {
      let _this = this;
      this.$refs.recEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认收货吗？", "提示", {}).then(() => {
            this.pageControl.recEditLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailReceiveGrid.editForm);
            receive({ receive: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.recEditLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["recEditForm"].resetFields();
                this.pageControl.recEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.recEditFormVisible = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    batchRecEditSubmit: function () {
      this.pageControl.batchRecEditSubmitLoading = true;
      let lineNos = [];
      let recLineNos = [];
      for (let i = 0; i < this.detailReceiveGrid.sels.length; i++) {
        lineNos.push(this.detailReceiveGrid.sels[i].lineNo);
        recLineNos.push(this.detailReceiveGrid.sels[i].recLineNo);
      }
      let para = {
        orderNo: this.orderHeader.orderNo,
        lineNos: lineNos.join(","),
        recLineNos: recLineNos.join(","),
      };
      batchReceive(para)
        .then((res) => {
          this.pageControl.batchRecEditSubmitLoading = false;
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
            this.getOrder();
          } else {
            this.$alert(res.data.msg, "执行结果", {
              confirmButtonText: "确定",
            });
            //this.$message.error(res.data.msgs);
          }
        })
        .catch((data) => {
          this.pageControl.batchRecEditSubmitLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    cancleRecEditSubmit() {
      let _this = this;
      this.$refs.recEditForm.validate((valid) => {
        if (valid) {
          this.$confirm("取消收货吗？", "提示", {}).then(() => {
            this.pageControl.cancelRecEditLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.detailReceiveGrid.editForm);
            cancelReceive({ receive: JSON.stringify(para) })
              .then((res) => {
                this.pageControl.cancelRecEditLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["recEditForm"].resetFields();
                this.pageControl.recEditFormVisible = false;
                this.getOrder();
              })
              .catch((data) => {
                this.pageControl.cancelRecEditLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    //            recDetailConfirm(){
    //
    //			},
    //            recDetailCancel(){
    //
    //			}
  },
  mounted() {
    if (this.status === "EDIT") {
      this.getOrder();
    } else if (this.status === "ADD") {
      this.orderHeader = {
        id: "",
        orderNo: "",
        supplierCode: "",
        status: "00",
        orderTime: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        auditOp: "",
        auditStatus: "00",
        auditTime: "",
        inboundType: "",
        isCalculated: "N",
        isCostCalculated: "N",
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
      };
    }
  },
};
</script>

<style scoped></style>
