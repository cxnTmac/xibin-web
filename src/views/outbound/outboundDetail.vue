<template>
	<section>
		<el-steps :active="active" finish-status="success" style="margin-top: 20px;margin-bottom: 20px">
			<el-step title="创建订单"></el-step>
			<el-step title="完成审核（可取消）"></el-step>
			<el-step title="完成分配（可取消）"></el-step>
			<el-step title="完成拣货（可取消）"></el-step>
			<el-step title="完成发货（可取消）"></el-step>
			<el-step title="关闭订单"></el-step>
			<el-step title="完成销售核算"></el-step>
			<el-step title="完成成本核算"></el-step>
		</el-steps>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
				<el-button type="primary" :disabled="btnAuditStatus" @click="audit" :loading="pageControl.auditBtnLoading">审核</el-button>
				<el-button type="danger" :disabled="btnCancelAuditStatus" @click="cancelAudit" :loading="pageControl.cancelAuditBtnLoading">取消审核</el-button>
                <el-button type="primary" :disabled="btnShipByHeaderStatus" @click="shipByHeaderHandler" :loading="pageControl.shipByHeaderBtnLoading">发货</el-button>
                <el-button type="danger" :disabled="btnCancelShipByHeaderStatus" @click="cancelShipByHeaderHandler" :loading="pageControl.cancelShipByHeaderBtnLoading">取消发货</el-button>
				<el-button type="danger" :disabled="btnCloseStatus" @click="close" :loading="pageControl.closeBtnLoading">关闭订单</el-button>
				<el-button type="success" :disabled="btnAccountStatus" @click="account" :loading="pageControl.accountBtnLoading">销售核算</el-button>
				<el-button type="success" :disabled="btnAccountCostStatus" @click="accountCost" :loading="pageControl.accountCostBtnLoading">成本核算</el-button>
			    <el-button  @click="back" style="float: right">返回</el-button>
		</el-col>
		<el-form :model="orderHeader" label-width="80px" :rules="orderHeaderRules" ref="orderHeader">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<el-row :gutter="0">
							<span style="line-height: 36px;">基本信息</span>

							<el-button type="primary" style="float: right;" :disabled="btnSaveHeaderStatus" @click="save" :loading="pageControl.saveBtnLoading">保存单头</el-button>
					</el-row>
				</div>
				<el-row :gutter="0">
					<el-col :span="6">
						<el-form-item label="出库单号" prop="orderNo">
							<el-input v-model="orderHeader.orderNo" disabled auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="客户" prop="buyerCode">
							<popwin-button popKey="POP_CUSTOMER" :selectValue="orderHeader.buyerCode" v-model="orderHeader.buyerCode" ></popwin-button>
							<!--<el-input v-model="orderHeader.supplierCode" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="状态" prop="status">
								<el-select v-model="orderHeader.status" disabled placeholder="请选择">
									<el-option
											v-for="item in outboundStatus"
											:key="item.code"
											:label="item.name"
											:value="item.code">
										<span style="float: left">{{ item.name }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
									</el-option>
								</el-select>
							<!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="订单时间" prop="orderTime">
							<el-date-picker
									v-model="orderHeader.orderTime"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="6">
						<el-form-item label="出库类型" prop="outboundType">
							<el-select v-model="orderHeader.outboundType"  placeholder="请选择">
								<el-option
										v-for="item in outboundType"
										:key="item.code"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.inboundType" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="审核状态" prop="auditStatus">
							<el-select v-model="orderHeader.auditStatus" disabled placeholder="请选择">
								<el-option
										v-for="item in auditStatus"
										:key="item.code"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
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
									placeholder="选择日期时间"
									disabled>
							</el-date-picker>
							<!--<el-input v-model="orderHeader.auditTime" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="审核人"  prop="auditOp">
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
				</el-row>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="line-height: 15px;">出库单明细</span>
				</div>
				<el-table :data="detailGrid.orderDetail" border highlight-current-row v-loading="detailGrid.listLoading" @selection-change="selsChange" stripe style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="lineNo" label="行号" width="100" sortable>
					</el-table-column>
					<el-table-column prop="orderNo" label="出库单号" width="200" sortable>
					</el-table-column>
					<el-table-column prop="buyerName" label="客户名称" width="200" sortable>
					</el-table-column>
					<el-table-column prop="skuName" label="产品编码" width="200" sortable>
					</el-table-column>
					<el-table-column
							label="订货数"
							width="200">
						<template scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-input-number :disabled="rowEditStatus"  @keyup.enter.native="rowSaveDetail(scope.row)" v-model="scope.row.outboundNum"  auto-complete="off"></el-input-number>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="outboundPrice" label="发货价格" width="200">
					</el-table-column>
					<el-table-column prop="cost" label="成本" width="200">
					</el-table-column>
					<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
					</el-table-column>
					<el-table-column prop="skuCode" label="产品编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="buyerCode" label="客户编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="planShipLoc" label="计划发货库位" width="200">
					</el-table-column>
					<el-table-column prop="outboundAllocNum" label="分配数" width="200">
					</el-table-column>
					<el-table-column prop="outboundPickNum" label="拣货数" width="200">
					</el-table-column>
					<el-table-column prop="outboundShipNum" label="发货数" width="200">
					</el-table-column>
					<el-table-column prop="isCreateVoucher" label="是否生成销售凭证" width="200">
					</el-table-column>
					<el-table-column prop="voucherNo" label="销售凭证号" width="200">
					</el-table-column>
					<el-table-column prop="isCreateCostVoucher" label="是否生成成本凭证" width="200">
					</el-table-column>
					<el-table-column prop="costVoucherNo" label="成本凭证号" width="200">
					</el-table-column>
					<el-table-column prop="remark" label="备注" >
					</el-table-column>
					<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
					<!--</el-table-column>-->

					<el-table-column label="操作" fixed="right" min-width="150">
						<template scope="scope">
							<el-button size="small"  @click="handleDetailEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" :disabled="btnDetailGridDelStatus" size="small" @click="handleDetailDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button type="primary" :disabled="btnDetailGridAdd" @click="addDetailHandler">新增</el-button>
					<el-button type="primary" :disabled="btnDetailGridAdd" @click="openBatchAddPopWin">批量新增</el-button>
					<!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange" :page-size="detailGrid.size" :total="detailGrid.total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-card>


			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="line-height: 15px;">出库单分配明细</span>
				</div>
				<el-table :data="detailAllocGrid.orderDetailAlloc" border highlight-current-row v-loading="detailAllocGrid.listLoading" @selection-change="allocSelsChange" stripe style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="lineNo" label="行号" width="100" sortable>
					</el-table-column>
					<el-table-column prop="allocId" label="分配ID" width="150" sortable>
					</el-table-column>
					<el-table-column prop="orderNo" label="出库单号" width="200" sortable>
					</el-table-column>
					<el-table-column prop="buyerCode" label="客户编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="buyerName" label="客户名称" width="200" sortable>
					</el-table-column>
					<el-table-column prop="skuCode" label="产品编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
					</el-table-column>
					<el-table-column prop="allocLocCode" label="分配库位" width="200">
					</el-table-column>
					<el-table-column prop="toLocCode" label="发货库位" width="200">
					</el-table-column>
					<el-table-column prop="outboundNum" label="订货数" width="200"  >
					</el-table-column>
					<el-table-column prop="outboundPrice" label="价格" width="200"  >
					</el-table-column>
					<el-table-column prop="cost" label="成本" width="200"  >
					</el-table-column>
					<el-table-column prop="pickTime" label="拣货时间" width="200" :formatter="formatTime" >
					</el-table-column>
					<el-table-column prop="pickOp" label="拣货人" width="200" >
					</el-table-column>
					<el-table-column prop="shipTime" label="发货时间" width="200" :formatter="formatTime" >
					</el-table-column>
					<el-table-column prop="shipOp" label="发货人" width="200">
					</el-table-column>
					<el-table-column prop="remark" label="备注" >
					</el-table-column>
					<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
					<!--</el-table-column>-->

					<el-table-column label="操作" fixed="right" min-width="80">
						<template scope="scope">
							<el-button size="small" @click="handleAllocDetailEdit(scope.$index, scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<!--<el-button type="primary" @click="recDetailConfirm">收货确认</el-button>-->
					<!--<el-button type="danger" @click="recDetailCancel" :disabled="this.detailGrid.sels.length===0">取消收货</el-button>-->
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentAllocDetailChange" :page-size="detailAllocGrid.size" :total="detailAllocGrid.total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-card>
		</el-form>




		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="pageControl.editFormVisible" :close-on-click-modal="false">
			<el-form :model="detailGrid.editForm" label-width="80px" :rules="detailGrid.editFormRules" ref="editForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户" prop="buyerCode">
							<popwin-button popKey="POP_CUSTOMER" :disabled="true" :selectValue="detailGrid.editForm.buyerCode" v-model="detailGrid.editForm.buyerCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品" prop="skuCode">
							<popwin-button popKey="POP_SKU" :selectValue="detailGrid.editForm.skuCode" v-model="detailGrid.editForm.skuCode" ></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="detailGrid.editForm.status" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in outboundStatus"
										:key="item.code"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="计划发货库位" prop="planShipLoc">
							<popwin-button popKey="POP_LOC" :staticCondition="{useType:'SS'}" :selectValue="detailGrid.editForm.planShipLoc" v-model="detailGrid.editForm.planShipLoc" ></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="发货价格" prop="outboundPrice">
							<el-autocomplete popper-class="my-autocomplete" custom-item="my-priceitem-zh"  :fetch-suggestions="queryHistoryPrice" @select="handlePriceSelect" v-model="detailGrid.editForm.outboundPrice" auto-complete="off"></el-autocomplete>
							<!--<el-input-number v-model="detailGrid.editForm.outboundPrice" auto-complete="off"></el-input-number>-->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="订货数" prop="outboundNum">
							<el-input-number v-model="detailGrid.editForm.outboundNum"  auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="分配数" prop="outboundAllocNum">
							<el-input-number v-model="detailGrid.editForm.outboundAllocNum" :disabled="true" auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="拣货数" prop="outboundPickNum">
							<el-input-number v-model="detailGrid.editForm.outboundPickNum" :disabled="true"  auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="发货数" prop="outboundShipNum">
							<el-input-number v-model="detailGrid.editForm.outboundShipNum" :disabled="true" auto-complete="off"></el-input-number>
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
				<el-button type="primary" :disabled="btnEditSubmitStatus" @click.native="editSubmit" :loading="pageControl.editLoading">提交</el-button>
				<el-button type="primary" :disabled="btnAllocSubmitStatus" @click.native="allocSubmit" :loading="pageControl.allocSubmitLoading">自动分配</el-button>
				<el-button type="danger" :disabled="btnCancelAllocSubmitStatus" @click.native="cancelAllocSubmit" :loading="pageControl.cancelAllocSubmitLoading">取消分配</el-button>
			</div>
		</el-dialog>



		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="pageControl.allocEditFormVisible" :close-on-click-modal="false">
			<el-form :model="detailAllocGrid.editForm" label-width="80px" :rules="detailAllocGrid.editFormRules" ref="allocEditForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户" prop="supplierCode">
							<popwin-button popKey="POP_CUSTOMER" :disabled="true" :selectValue="detailAllocGrid.editForm.buyerCode" v-model="detailAllocGrid.editForm.buyerCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品" prop="skuCode">
							<popwin-button popKey="POP_SKU" :selectValue="detailAllocGrid.editForm.skuCode" :disabled="true" v-model="detailAllocGrid.editForm.skuCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="detailAllocGrid.editForm.status" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in outboundStatus"
										:key="item.code"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
							<el-form-item label="发货价格" prop="outboundPrice">
								<el-input-number v-model="detailAllocGrid.editForm.outboundPrice" auto-complete="off"></el-input-number>
							</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="分配数" prop="outboundNum">
							<el-input v-model="detailAllocGrid.editForm.outboundNum" disabled auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="分配库位" prop="allocLocCode">
							<popwin-button popKey="POP_LOC" :selectValue="detailAllocGrid.editForm.allocLocCode" :disabled="true" v-model="detailAllocGrid.editForm.allocLocCode"></popwin-button>
							<!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="发货库位" prop="toLocCode">
							<popwin-button popKey="POP_LOC" :staticCondition="{useType:'SS'}" :selectValue="detailAllocGrid.editForm.toLocCode" v-model="detailAllocGrid.editForm.toLocCode"></popwin-button>
							<!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input v-model="detailAllocGrid.editForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="pageControl.allocEditFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="pickAllocSubmit" :disabled="btnPickAllocStatus" :loading="pageControl.pickAllocLoading">拣货</el-button>
				<el-button type="danger" @click.native="cancelPickAllocSubmit" :disabled="btnCancelPickAllocStatus" :loading="pageControl.cancelPickAllocLoading">取消拣货</el-button>
				<el-button type="primary" @click.native="shipAllocSubmit" :disabled="btnShipAllocStatus" :loading="pageControl.shipAllocLoading">发货</el-button>
				<el-button type="danger" @click.native="cancelShipAllocSubmit" :disabled="btnCancelShipAllocStatus" :loading="pageControl.cancelShipAllocLoading">取消发货</el-button>
			</div>
		</el-dialog>

		<el-dialog title="批量添加" size="large"  :visible.sync="pageControl.batchAddPopWinVisiable">
			<el-form :inline="true" :model="batchAddPopWin.filters">
				<el-form-item label="配件类型" prop="fittingTypeCode">
					<popwin-button popKey="POP_FITTINGTYPE"  :selectValue="batchAddPopWin.filters.fittingTypeCode" v-model="batchAddPopWin.filters.fittingTypeCode"></popwin-button>
				</el-form-item>
				<el-form-item label="名称" prop="fittingSkuCode">
					<el-input   v-model="batchAddPopWin.filters.fittingSkuCode" ></el-input>
				</el-form-item>
				<el-form-item label="编码" prop="fittingSkuName">
					<el-input   v-model="batchAddPopWin.filters.fittingSkuName" ></el-input>
				</el-form-item>
				<el-form-item label="车型" prop="modelCode">
					<el-input   v-model="batchAddPopWin.filters.modelCode" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="getSkuData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="batchAdd">批量新增</el-button>
				</el-form-item>
			</el-form>
			<el-table max-height="400" :data="batchAddPopWin.skuList" v-loading="batchAddPopWin.listLoading" @selection-change="batchAddSelsChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column property="fittingSkuCode" label="商品编码" width="150"></el-table-column>
				<el-table-column property="fittingSkuName" label="商品名称" width="200"></el-table-column>
				<el-table-column property="modelCode" label="车型"></el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleBatchAddCurrentChange" :page-size="batchAddPopWin.size" :total="batchAddPopWin.total" style="float:right;">
				</el-pagination>
			</el-col>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
    import Vue from 'vue'
    Vue.component('my-priceitem-zh', {
        functional: true,
        render: function (h, ctx) {
            var item = ctx.props.item;
            return h('li', ctx.data, [
                h('div', { attrs: { class: 'price' } }, [item.price]),
                h('span', { attrs: { class: 'date' } }, [item.date])
            ]);
        },
        props: {
            item: { type: Object, required: true }
        }
    });
    import { getFittingSkuListPage} from '../../api/fittingSkuApi';
	import NProgress from 'nprogress'
	import {batchSaveOutboundDetail,queryHistoryPrice,shipByHeader, getOutboundOrderListPage, saveOutboundOrder, getOutboundOrderHeader,getOutboundDetailListPage,saveOutboundDetail,removeOutboundDetail,getOutboundAllocListPage,audit,cancelAudit,alloc,cancelAlloc,pick,cancelPick,ship,cancelShip,cancelShipByHeader,close,accountByOrderNo,accountCostByOrderNo} from '../../api/outboundApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                batchAddPopWin:{
                    skuList:[],
                    page:1,
                    size:10,
                    total:0,
                    listLoading:false,
                    sels:[],
                    queryConditions:[{title:"产品名称",name:"fittingSkuName"},{title:"产品编码",name:"fittingSkuCode"}],
                    filters:{
                        fittingSkuCode:'',
                        fittingSkuName:'',
                        modelCode:'',
                        fittingTypeCode:''
                    }
                },
				orderHeader:{
			        id:'',
					orderNo:'',
					buyerCode:'',
					status:'',
					orderTime:'',
					auditOp:'',
					auditStatus:'',
                    auditTime:'',
                    outboundType:'',
                    isCalculated:'N',
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:'',
                    warehouseId:''
				},
                detailGrid:{
                    currentRow:{},
                    editForm:{
                        id:'',
                        orderNo:'',
                        lineNo:'',
                        status:'',
                        buyerCode:'',
                        skuCode:'',
                        outboundNum:0,
                        outboundAllocNum:0,
                        outboundPickNum:0,
                        outboundShipNum:0,
                        outboundPrice:0,
                        planShipLoc:'',
                        remark:'',
                        creator:'',
                        createTime:'',
                        modifier:'',
                        modifyTime:'',
                        rec_ver:'',
                        companyId:'',
                        warehouseId:''
                    },
                    editFormRules:{
                        buyerCode:[
                            { required: true, message: '请选择客户', trigger: 'blur' }
                        ],
                        skuCode:[
                            { required: true, message: '请选择产品', trigger: 'blur' }
                        ],
                        outboundNum:[
                            { type:'number',required: true, message: '请输入订货数', trigger: 'blur' }
                        ],
                        outboundPrice:[
                            {required: true, message: '请输入价格', trigger: 'blur' }
                        ],
                        planShipLoc:[
                            { required: true, message: '请选择计划发货库位', trigger: 'blur' }
                        ],
					},
                    orderDetail:[],
                    page:1,
                    size:10,
                    total:0,
                    listLoading:false,
                    sels:[]
				},
				pageControl:{
				    saveBtnLoading:false,
					auditBtnLoading:false,
					cancelAuditBtnLoading:false,
                    editFormVisible:false,
                    editLoading:false,
                    allocEditFormVisible:false,
                    allocSubmitLoading:false,
                    cancelAllocSubmitLoading:false,
                    pickAllocLoading:false,
                    cancelPickAllocLoading:false,
                    shipAllocLoading:false,
                    cancelShipAllocLoading:false,
                    shipByHeaderBtnLoading:false,
                    cancelShipByHeaderBtnLoading:false,
                    batchAddPopWinVisiable:false,
                    closeBtnLoading:false,
					accountBtnLoading:false,
                    accountCostBtnLoading:false
				},
				detailAllocGrid:{
                    editForm:{
                        id:'',
                        orderNo:'',
                        buyerCode:'',
                        status:'',
                        lineNo:'',
						allocId:'',
						skuCode:'',
                        outboundNum:0,
                        outboundPrice:0,
                        allocLocCode:'',
						toLocCode:'',
						pickOp:'',
						pickTime:'',
                        shiOp:'',
                        shipTime:'',
                        remark:'',
                        creator:'',
                        createTime:'',
                        modifier:'',
                        modifyTime:'',
                        rec_ver:'',
                        companyId:'',
                        warehouseId:''
                    },
                    editFormRules:{
                        toLocCode:[
                            { required: true, message: '请输入发货库位', trigger: 'blur' }
						],
                        outboundPrice:[
                            { type:'number',required: true, message: '请输入价格', trigger: 'blur' }
                        ]
					},
                    orderDetailAlloc:[],
                    page:1,
                    size:10,
                    total:0,
                    listLoading:false,
                    sels:[]
				},
                orderHeaderRules:{
                    buyerCode:[
                        { required: true, message: '请选择客户', trigger: 'blur' }
                    ],
					outboundType:[
                        { required: true, message: '请选择出库类型', trigger: 'blur' }
                    ],
                    orderTime: [
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ]
				},
                outboundStatus:codemaster.WM_OUTBOUND_STATUS,
				outboundType:codemaster.WM_OUTBOUND_TYPE,
				auditStatus:codemaster.SYS_AUDIT_STATUS
			}
		},
        computed: {
            active:function () {
                if(this.orderHeader === undefined){
                    return 1;
				}
                if(this.orderHeader.status === '00'&&this.orderHeader.auditStatus=== '00'){
                    return 1;
                }else if((this.orderHeader.status == '00'||this.orderHeader.status == '30')&&this.orderHeader.auditStatus!== '00'){
                    return 2;
                }else if(this.orderHeader.status == '40'||this.orderHeader.status == '50'){
                    return 3;
                }else if(this.orderHeader.status == '60'||this.orderHeader.status == '70'){
                    return 4;
                }else if(this.orderHeader.status == '80'){
                    return 5;
                }else if(this.orderHeader.status == '99'){
                    return 6;
                }else if(this.orderHeader.status == '20'){
                    return 7;
                }else if(this.orderHeader.status == '25'){
                    return 8;
                }
            },
            btnCloseStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return true;
                }else if(this.orderHeader.status === '80'){
                    return false;
                }else{
                    return true;
                }
            },
            btnAccountStatus:function () {
                if(this.orderHeader.status === '99'){
                    return false;
                }else{
                    return true;
                }
            },
            btnAccountCostStatus:function () {
                if(this.orderHeader.status === '20'){
                    return false;
                }else{
                    return true;
                }
            },
            rowEditStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            btnShipByHeaderStatus:function() {
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                if(this.orderHeader.status === '50'||this.orderHeader.status ==='60'){
                    return false;
                }else{
                    return true;
                }
            },
            btnCancelShipByHeaderStatus:function () {
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                if(this.orderHeader.status === '80'||this.orderHeader.status ==='70'){
                    return false;
                }else{
                    return true;
                }
            },
            btnPickAllocStatus:function(){
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                if(this.detailAllocGrid.editForm.status === '40'){
                    return false;
				}else{
                    return true;
				}
			},
            btnCancelPickAllocStatus:function(){
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                if(this.detailAllocGrid.editForm.status === '60'){
                    return false;
                }else{
                    return true;
                }
            },
            btnShipAllocStatus:function(){
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                if(this.detailAllocGrid.editForm.status === '60'){
                    return false;
                }else{
                    return true;
                }
            },
            btnCancelShipAllocStatus:function(){
                if(this.orderHeader.auditStatus === '00'||this.orderHeader.status === '99') {
                    return true;
                }
                if(this.detailAllocGrid.editForm.status === '80'){
                    return false;
                }else{
                    return true;
                }
            },
            btnAllocSubmitStatus:function(){
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                
                if(this.detailGrid.editForm.status === '00'&&this.detailGrid.editForm.id!==''){
                    return false;
				}else{
                    return true;
				}
			},
            btnCancelAllocSubmitStatus:function(){
                if(this.orderHeader.auditStatus === '00') {
                    return true;
                }
                if(this.detailGrid.editForm.status == '30'||this.detailGrid.editForm.status == '40'){
                    return false;
                }else{
                    return true;
                }
			},
            btnEditSubmitStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
			},
            btnDetailGridAdd:function(){
                if(this.orderHeader.id === ''){
                    return true;
				}
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
			},
            btnDetailGridDelStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return false;
				}else{
                    return true;
				}
			},
            btnAllocEditStatus:function(){
                if(this.detailAllocGrid.editForm.status ===  '00'){
                    return false;
				}else{
                    return true;
				}
			},
            btnCancelAllocEditStatus:function(){
                if(this.detailAllocGrid.editForm.status ===  '00'){
                    return true;
                }else{
                    return false;
                }
			},
            btnSaveHeaderStatus:function () {
				if(this.orderHeader.auditStatus === '00'){
				    return false;
				}else{
                    return true;
				}
            },
            btnCancelAuditStatus:function () {
                if(this.orderHeader.auditStatus === '00'){
                    return true;
                }else if(this.orderHeader.status === '00'){
                    return false;
                }else{
                    return true;
				}
            },
            btnAuditStatus:function () {
                if(this.orderHeader.id === ''){
                    return true;
				}
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            orderNo:function() {
                return this.$store.state.outboundDetail.orderNo
            },
			status:function(){
                return this.$store.state.outboundDetail.status
			}
        },
		methods: {
            account:function () {
                this.pageControl.accountBtnLoading= true;
                let para = { orderNo:this.orderHeader.orderNo};
                accountByOrderNo(para).then((res) => {
                    this.pageControl.accountBtnLoading= false;
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.getOrder();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((data) => {
                    this.pageControl.accountBtnLoading= false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            accountCost:function () {
                this.pageControl.accountCostBtnLoading= true;
                let para = { orderNo:this.orderHeader.orderNo};
                accountCostByOrderNo(para).then((res) => {
                    this.pageControl.accountCostBtnLoading= false;
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.getOrder();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((data) => {
                    this.pageControl.accountCostBtnLoading= false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            formatTime: function(row, column){
                if(row[column.property]!==null) {
                    let unixTimestamp = new Date(row[column.property])
                    return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_OUTBOUND_STATUS,row.status);
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
            openBatchAddPopWin:function(){
                this.pageControl.batchAddPopWinVisiable = true;
            },

            handleBatchAddCurrentChange(val) {
                this.batchAddPopWin.page = val;
                this.getSkuData();
            },
            batchAddSelsChange: function (sels) {
                this.batchAddPopWin.sels = sels;
            },
            rowSaveDetail(row){
                this.detailGrid.listLoading = true;
                //NProgress.start();
                let para = Object.assign({}, row);
                let newRows = this.detailGrid.orderDetail.concat([]);
                saveOutboundDetail({detail:JSON.stringify(para)}).then((res) => {
                    this.detailGrid.listLoading = false;
                    //NProgress.done();
                    if(res.data.code === 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
//                            row = res.data.data;
                        for(let i = 0;i<newRows.length;i++){
                            if(newRows[i].id === res.data.data.id){
                                console.log(res.data.data);
                                newRows[i] = res.data.data;
                                break;
                            }
                        }
                        this.detailGrid.orderDetail = newRows;
                        console.log(this.detailGrid.orderDetail);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((data) => {
                    this.detailGrid.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            getSkuData:function(){
                let para = {
                    page: this.batchAddPopWin.page,
                    size: this.batchAddPopWin.size,
                    conditions:JSON.stringify(this.batchAddPopWin.filters)
                };
                this.batchAddPopWin.listLoading = true;
                //NProgress.start();
                getFittingSkuListPage(para).then((res) => {
                    this.batchAddPopWin.total = res.data.size;
                    this.batchAddPopWin.skuList = res.data.list;
                    this.batchAddPopWin.listLoading = false;
                    //NProgress.done();
                }).catch((data) => {
                    this.batchAddPopWin.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            batchAdd:function(){
                let skuCodeArray = [];
                for(let i = 0;i<this.batchAddPopWin.sels.length;i++){
                    skuCodeArray.push(this.batchAddPopWin.sels[i].fittingSkuCode);
                }
                let para = {orderNo:this.orderHeader.orderNo,buyerCode:this.orderHeader.buyerCode,skuCodes:skuCodeArray.join(',')};
                batchSaveOutboundDetail(para).then((res) => {
                    //NProgress.done();
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.pageControl.batchAddPopWinVisiable = false;
                    this.getDetails();
                }).catch((data) => {
                    this.pageControl.batchAddPopWinVisiable = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            queryHistoryPrice:function(queryString, cb){
                if(this.detailGrid.editForm.skuCode === ''||this.detailGrid.editForm.skuCode === null){
                    return
                }
                var restaurants = this.restaurants;
                var results = {};
                let para = {};
                para['page'] = 1;
                para['size'] = 10;
                let queryConditions = {};
                queryConditions['buyerCode'] = this.detailGrid.editForm.buyerCode;
                queryConditions['skuCode'] = this.detailGrid.editForm.skuCode;
                para['conditions'] = JSON.stringify(queryConditions);
                queryHistoryPrice(para).then((res) => {
                    results = this.converte(res.data.list);
                    cb(results);
                    //NProgress.done();
                });
            },
            converte(data){
                let result = [];
                for(let i = 0;i<data.length;i++){
                    result.push({price: data[i].outboundPrice,date:util.formatDate.format(new Date(data[i].modifyTime),'yyyy-MM-dd hh:mm:ss') })
                }
                return result;
            },
            handlePriceSelect:function(item){
                this.detailGrid.editForm.outboundPrice = item.price;
            },
            save(){
                this.$refs.orderHeader.validate((valid) => {
                    if (valid) {
                        this.pageControl.saveBtnLoading = true;
                        saveOutboundOrder({order: JSON.stringify(this.orderHeader)}).then((res) => {
                            NProgress.done();
                            this.pageControl.saveBtnLoading = false;
                            if (res.data.code == 200) {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                            this.orderHeader = Object.assign({}, res.data.data);
                            this.$store.commit('changeOrderNo',this.orderHeader.orderNo);
                            this.$store.commit('changeStatus','EDIT');
                            this.getDetails();
                            this.getDetailAllocs();
                        })
                    }
                });
			},
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.pageControl.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailGrid.editForm);
                            saveOutboundDetail({detail:JSON.stringify(para)}).then((res) => {
                                this.pageControl.editLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['editForm'].resetFields();
                                this.pageControl.editFormVisible = false;
                                this.getDetails();
                                this.getDetailAllocs();
                            }).catch((data) => {
                                this.pageControl.editLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
			},
            allocSubmit(){
                this.pageControl.allocSubmitLoading = true;
                //NProgress.start();
                let para = {orderNo:this.orderHeader.orderNo,lineNos:[this.detailGrid.editForm.lineNo].join(',')};
                alloc(para).then((res) => {
                    this.pageControl.allocSubmitLoading = false;
                    //NProgress.done();
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.$refs['editForm'].resetFields();
                    this.pageControl.editFormVisible = false;
                    this.getOrder();
                }).catch((data) => {
                    this.pageControl.allocSubmitLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			cancelAllocSubmit(){
                this.pageControl.allocSubmitLoading = true;
                //NProgress.start();
                let para = {orderNo:this.orderHeader.orderNo,lineNos:[this.detailGrid.editForm.lineNo].join(',')};
                cancelAlloc(para).then((res) => {
                    this.pageControl.allocSubmitLoading = false;
                    //NProgress.done();
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.$refs['editForm'].resetFields();
                    this.pageControl.editFormVisible = false;
                    this.getOrder();
                }).catch((data) => {
                    this.pageControl.allocSubmitLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            pickAllocSubmit(){
                this.$refs.allocEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认拣货吗？', '提示', {}).then(() => {
                            this.pageControl.pickAllocLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailAllocGrid.editForm);
                            pick({alloc:JSON.stringify(para)}).then((res) => {
                                this.pageControl.pickAllocLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['allocEditForm'].resetFields();
                                this.pageControl.allocEditFormVisible = false;
                                this.getOrder();
                            }).catch((data) => {
                                this.pageControl.pickAllocLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
			},
            cancelPickAllocSubmit(){
                this.$refs.allocEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('取消拣货吗？', '提示', {}).then(() => {
                            this.pageControl.pickAllocLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailAllocGrid.editForm);
                            cancelPick({alloc:JSON.stringify(para)}).then((res) => {
                                this.pageControl.pickAllocLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['allocEditForm'].resetFields();
                                this.pageControl.allocEditFormVisible = false;
                                this.getOrder();
                            }).catch((data) => {
                                this.pageControl.pickAllocLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
			},
            shipAllocSubmit(){
                this.$refs.allocEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认发货吗？', '提示', {}).then(() => {
                            this.pageControl.pickAllocLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailAllocGrid.editForm);
                            ship({alloc:JSON.stringify(para)}).then((res) => {
                                this.pageControl.pickAllocLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['allocEditForm'].resetFields();
                                this.pageControl.allocEditFormVisible = false;
                                this.getOrder();
                            }).catch((data) => {
                                this.pageControl.pickAllocLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
            },
            cancelShipAllocSubmit(){
                this.$refs.allocEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('取消发货吗？', '提示', {}).then(() => {
                            this.pageControl.pickAllocLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailAllocGrid.editForm);
                            cancelShip({alloc:JSON.stringify(para)}).then((res) => {
                                this.pageControl.pickAllocLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['allocEditForm'].resetFields();
                                this.pageControl.allocEditFormVisible = false;
                                this.getOrder();
                            }).catch((data) => {
                                this.pageControl.pickAllocLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
            },
            shipByHeaderHandler(){
                this.$confirm('确定发货吗？', '提示', {}).then(() => {
                    this.pageControl.shipByHeaderBtnLoading = true;
                    //NProgress.start();
                    shipByHeader({orderNo:this.orderHeader.orderNo}).then((res) => {
                        this.pageControl.shipByHeaderBtnLoading = false;
                        //NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        this.getOrder();
                    }).catch((data) => {
                        this.pageControl.shipByHeaderBtnLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
                });
            },
            cancelShipByHeaderHandler(){
                this.$confirm('取消发货吗？', '提示', {}).then(() => {
                    this.pageControl.cancelShipByHeaderBtnLoading = true;
                    //NProgress.start();
                    cancelShipByHeader({orderNo:this.orderHeader.orderNo}).then((res) => {
                        this.pageControl.cancelShipByHeaderBtnLoading = false;
                        //NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        this.getOrder();
                    }).catch((data) => {
                        this.pageControl.cancelShipByHeaderBtnLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
                });
            },
            audit(){
                //NProgress.start();
				let orderNos = [this.orderHeader.orderNo].join(',');
                let para = { orderNos:orderNos};
                audit(para).then((res) => {
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.orderHeader = Object.assign({}, res.data.data);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });;
			},
			cancelAudit(){
                let orderNos = [this.orderHeader.orderNo].join(',');
                let para = { orderNos:orderNos};
                cancelAudit(para).then((res) => {
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.orderHeader = Object.assign({}, res.data.data);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            close(){
                //NProgress.start();
                let orderNos = [this.orderHeader.orderNo].join(',');
                let para = { orderNos:orderNos};
                close(para).then((res) => {
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.getOrder();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
			getOrder(){
                getOutboundOrderHeader({orderNo:this.orderNo}).then((res) => {
                    NProgress.done();
                    this.orderHeader = Object.assign({}, res.data);
                    this.getDetails();
                    this.getDetailAllocs();
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            getDetails(){
                this.detailGrid.listLoading = true;
			    let para = {
                    page: this.detailGrid.page,
                    size: this.detailGrid.size,
                    conditions:JSON.stringify({orderNo:this.orderHeader.orderNo})
				}
                getOutboundDetailListPage(para).then((res) => {
                    this.detailGrid.total = res.data.size;
                    this.detailGrid.orderDetail = res.data.list;
                    this.detailGrid.listLoading = false;
                    //NProgress.done();
                }).catch((data) => {
                    this.detailGrid.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
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
            getDetailAllocs(){
                this.detailAllocGrid.listLoading = true;
                let para = {
                    page: this.detailAllocGrid.page,
                    size: this.detailAllocGrid.size,
                    conditions:JSON.stringify({orderNo:this.orderHeader.orderNo})
                }
                getOutboundAllocListPage(para).then((res) => {
                    this.detailAllocGrid.total = res.data.size;
                    this.detailAllocGrid.orderDetailAlloc = res.data.list;
                    this.detailAllocGrid.listLoading = false;
                    //NProgress.done();
                }).catch((data) => {
                    this.detailAllocGrid.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},

            back(){
                this.$router.push({ path: '/outboundOrder' });
			},
            addDetailHandler(){
                this.detailGrid.editForm = {
                    id:'',
                    orderNo:this.orderHeader.orderNo,
                    lineNo:'',
                    status:'00',
                    buyerCode:this.orderHeader.buyerCode,
                    skuCode:'',
                    outboundNum:0,
                    outboundAllocNum:0,
                    outboundPickNum:0,
                    outboundShipNum:0,
                    outboundPrice:0,
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:'',
                    warehouseId:''
                }
				this.pageControl.editFormVisible = true;
			},
            handleDetailEdit(index, row){
                this.detailGrid.editForm = {};
                this.pageControl.editFormVisible = true;
                this.detailGrid.editForm = Object.assign({}, row);
			},
            handleDetailDel(index, row){
                let ids = [row.id].join(",");
                let orderNo = this.orderHeader.orderNo;
                this.$confirm('确认删除记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.detailGrid.listLoading = true;
					//NProgress.start();
					let para = { ids: ids ,orderNo:orderNo};
                    removeOutboundDetail(para).then((res) => {
                        this.detailGrid.listLoading = false;
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
						this.getDetails();
					}).catch((data) => {
                        this.detailGrid.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
				});
            },
            handleAllocDetailEdit(index, row){
                this.detailAllocGrid.editForm = {};
                this.pageControl.allocEditFormVisible = true;
                this.detailAllocGrid.editForm = Object.assign({}, row);
			},
            allocEditSubmit(){
                this.$refs.allocEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认收货吗？', '提示', {}).then(() => {
                            this.pageControl.allocEditLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailAllocGrid.editForm);
                            receive({receive:JSON.stringify(para)}).then((res) => {
                                this.pageControl.allocEditLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['allocEditForm'].resetFields();
                                this.pageControl.allocEditFormVisible = false;
                                this.getOrder();
                            }).catch((data) => {
                                this.pageControl.allocEditFormVisible = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });;
                        });
                    }
                });
			},
            cancleAllocEditSubmit(){
                this.$refs.allocEditForm.validate((valid) => {
					if (valid) {
						this.$confirm('取消收货吗？', '提示', {}).then(() => {
						    debugger
							this.pageControl.cancelAllocEditLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.detailAllocGrid.editForm);
                            cancelReceive({receive:JSON.stringify(para)}).then((res) => {
								this.pageControl.cancelAllocEditLoading = false;
								//NProgress.done();
								if(res.data.code == 200){
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
								}else{
									this.$message.error(res.data.msg);
								}
								this.$refs['allocEditForm'].resetFields();
								this.pageControl.allocEditFormVisible = false;
								this.getOrder();
							}).catch((data) => {
                                this.pageControl.allocEditFormVisible = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
						});
					}
            	});
			}
		},
		mounted(){
		    if(this.status === 'EDIT'){
                this.getOrder();
			}
			else if(this.status === 'ADD'){
                this.orderHeader={
                    id:'',
                    orderNo:'',
                    buyerCode:'',
                    status:'00',
                    orderTime:null,
                    auditOp:'',
                    auditStatus:'00',
                    auditTime:null,
                    outboundType:'',
                    isCalculated:'N',
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:'',
                    warehouseId:''
                }
			}
		}
	}

</script>

<style scoped>

</style>