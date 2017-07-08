<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
				<el-button type="primary" :disabled="btnAuditStatus" @click="audit" :loading="pageControl.auditBtnLoading">审核</el-button>
				<el-button type="primary" :disabled="btnCancelAuditStatus" @click="cancelAudit" :loading="pageControl.cancelAuditBtnLoading">取消审核</el-button>
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
						<el-form-item label="入库单号" prop="orderNo">
							<el-input v-model="orderHeader.orderNo" disabled auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="货主" prop="supplierCode">
							<popwin-button popKey="POP_CUSTOMER" :selectValue="orderHeader.supplierCode" @changeValue="changePopValueForSupplierCode"></popwin-button>
							<!--<el-input v-model="orderHeader.supplierCode" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="状态" prop="status">
								<el-select v-model="orderHeader.status" disabled placeholder="请选择">
									<el-option
											v-for="item in inboundStatus"
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
						<el-form-item label="入库类型" prop="inboundType">
							<el-select v-model="orderHeader.inboundType"  placeholder="请选择">
								<el-option
										v-for="item in inboundType"
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
					<span style="line-height: 15px;">入库单明细</span>
				</div>
				<el-table :data="detailGrid.orderDetail" highlight-current-row v-loading="detailGrid.listLoading" @selection-change="selsChange" stripe style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="lineNo" label="行号" width="100" sortable>
					</el-table-column>
					<el-table-column prop="orderNo" label="入库单号" width="200" sortable>
					</el-table-column>
					<el-table-column prop="supplierCode" label="客户编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="supplierName" label="客户名称" width="200" sortable>
					</el-table-column>
					<el-table-column prop="skuCode" label="产品编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
					</el-table-column>
					<el-table-column prop="inboundPreNum" label="预收数" width="200">
					</el-table-column>
					<el-table-column prop="inboundNum" label="实收数" width="200">
					</el-table-column>
					<el-table-column prop="inboundPrice" label="收货价格" width="200">
					</el-table-column>
					<el-table-column prop="planLoc" label="计划库位" width="200">
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
					<el-button type="primary" :disabled="btnDetailGridAddStatus" @click="addDetailHandler">新增</el-button>
					<!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange" :page-size="detailGrid.size" :total="detailGrid.total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-card>


			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="line-height: 15px;">入库单收货明细</span>
				</div>
				<el-table :data="detailReceiveGrid.orderDetailReceive" highlight-current-row v-loading="detailReceiveGrid.listLoading" @selection-change="recSelsChange" stripe style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="lineNo" label="行号" width="100" sortable>
					</el-table-column>
					<el-table-column prop="recLineNo" label="收货明细行号" width="150" sortable>
					</el-table-column>
					<el-table-column prop="orderNo" label="入库单号" width="200" sortable>
					</el-table-column>
					<el-table-column prop="supplierCode" label="客户编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="supplierName" label="客户名称" width="200" sortable>
					</el-table-column>
					<el-table-column prop="skuCode" label="产品编码" width="200" sortable>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
					</el-table-column>
					<el-table-column prop="inboundLocCode" label="收货库位" width="200">
					</el-table-column>
					<el-table-column prop="recTime" label="收货时间" width="200" :formatter="formatTime" >
					</el-table-column>
					<el-table-column prop="inboundPreNum" label="预收数" width="200">
					</el-table-column>
					<el-table-column prop="inboundNum" label="实收数" width="200">
					</el-table-column>
					<el-table-column prop="inboundPrice" label="收货价格" width="200">
					</el-table-column>
					<el-table-column prop="planLoc" label="计划库位" width="200">
					</el-table-column>
					<el-table-column prop="remark" label="备注" >
					</el-table-column>
					<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
					<!--</el-table-column>-->

					<el-table-column label="操作" fixed="right" min-width="80">
						<template scope="scope">
							<el-button size="small" @click="handleRecDetailEdit(scope.$index, scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<!--<el-button type="primary" @click="recDetailConfirm">收货确认</el-button>-->
					<!--<el-button type="danger" @click="recDetailCancel" :disabled="this.detailGrid.sels.length===0">取消收货</el-button>-->
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange" :page-size="detailReceiveGrid.size" :total="detailReceiveGrid.total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-card>
		</el-form>




		<!--编辑界面-->
		<el-dialog title="编辑" v-model="pageControl.editFormVisible" :close-on-click-modal="false">
			<el-form :model="detailGrid.editForm" label-width="80px" :rules="detailGrid.editFormRules" ref="editForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="货主" prop="supplierCode">
							<popwin-button popKey="POP_CUSTOMER" :disabled="true" :selectValue="detailGrid.editForm.supplierCode" @changeValue="changeEditPopValueForSupplierCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品" prop="skuCode">
							<popwin-button popKey="POP_SKU" :selectValue="detailGrid.editForm.skuCode"  @changeValue="changeEditPopValueForSkuCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="detailGrid.editForm.status" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in inboundStatus"
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
                        <el-form-item label="收货价格" prop="inboundPrice">
                            <el-input-number v-model="detailGrid.editForm.inboundPrice" auto-complete="off"></el-input-number>
                        </el-form-item>
                    </el-col>
				</el-row>
				<el-row :gutter="0">

					<el-col :span="12">
						<el-form-item label="预收数" prop="inboundPreNum">
							<el-input-number v-model="detailGrid.editForm.inboundPreNum"  auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="实收数" prop="inboundNum">
							<el-input-number v-model="detailGrid.editForm.inboundNum" :disabled="true" auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="计划库位" prop="planLoc">
							<popwin-button popKey="POP_LOC" :selectValue="detailGrid.editForm.planLoc"  @changeValue="changeEditPopValueForPlanLoc"></popwin-button>
							<!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
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
			</div>
		</el-dialog>



		<!--编辑界面-->
		<el-dialog title="编辑" v-model="pageControl.recEditFormVisible" :close-on-click-modal="false">
			<el-form :model="detailReceiveGrid.editForm" label-width="80px" :rules="detailReceiveGrid.editFormRules" ref="recEditForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="货主" prop="supplierCode">
							<popwin-button popKey="POP_CUSTOMER" :disabled="true" :selectValue="detailReceiveGrid.editForm.supplierCode" @changeValue="changeRecEditPopValueForSupplierCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品" prop="skuCode">
							<popwin-button popKey="POP_SKU" :selectValue="detailReceiveGrid.editForm.skuCode" :disabled="true" @changeValue="changeRecEditPopValueForSkuCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="detailReceiveGrid.editForm.status" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in inboundStatus"
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
							<el-form-item label="收货价格" prop="inboundPrice">
								<el-input-number v-model="detailReceiveGrid.editForm.inboundPrice" auto-complete="off"></el-input-number>
							</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="预收数" prop="inboundPreNum">
							<el-input-number v-model="detailReceiveGrid.editForm.inboundPreNum" disabled auto-complete="off"></el-input-number>
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
							<popwin-button popKey="POP_LOC" :selectValue="detailReceiveGrid.editForm.planLoc" :disabled="true" @changeValue="changeRecevieEditPopValueForPlanLoc"></popwin-button>
							<!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="实际库位" prop="inboundLocCode">
							<popwin-button popKey="POP_LOC" :selectValue="detailReceiveGrid.editForm.inboundLocCode" @changeValue="changeRecevieEditPopValueForInboundLoc"></popwin-button>
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
				<el-button type="primary" @click.native="recEditSubmit" :disabled="btnRecEditStatus" :loading="pageControl.recEditLoading">收货确认</el-button>
				<el-button type="danger" @click.native="cancleRecEditSubmit" :disabled="btnCancelRecEditStatus" :loading="pageControl.cancelRecEditLoading">取消收货</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
	import { getInboundOrderListPage, saveInboundOrder, getInboundOrderHeader,getInboundDetailListPage,saveInboundDetail,removeInboundDetail,getInboundRecListPage,receive,cancelReceive,audit,cancelAudit} from '../../api/inboundApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
				orderHeader:{
			        id:'',
					orderNo:'',
					supplierCode:'',
					status:'',
					orderTime:'',
					auditOp:'',
					auditStatus:'',
                    auditTime:'',
                    inboundType:'',
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
                    editForm:{
                        id:'',
                        orderNo:'',
                        lineNo:'',
                        status:'',
                        supplierCode:'',
                        skuCode:'',
                        inboundPreNum:0,
                        inboundNum:0,
                        inboundPrice:0,
                        planLoc:'',
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
                        supplierCode:[
                            { required: true, message: '请选择货主', trigger: 'blur' }
                        ],
                        inboundPreNum:[
                            { type: 'number',required: true, message: '请输入预收数', trigger: 'blur' }
                        ],
                        inboundPrice:[
                            { type: 'number',required: true, message: '请输入价格', trigger: 'blur' }
                        ],
                        planLoc:[
                            { required: true, message: '请输入计划库位', trigger: 'blur' }
                        ]
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
                    recEditFormVisible:false,
                    recEditLoading:false,
                    cancelRecEditLoading:false
				},
				detailReceiveGrid:{
                    editForm:{
                        id:'',
                        orderNo:'',
                        supplierCode:'',
                        status:'',
                        lineNo:'',
						recLineNo:'',
						skuCode:'',
                        inboundPreNum:0,
                        inboundNum:0,
                        inboundPrice:0,
                        planLoc:'',
						inboundLocCode:'',
						recTime:'',
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
                        inboundLocCode:[
                            { required: true, message: '请输入实收库位', trigger: 'blur' }
						],
                        inboundPrice:[
                            { type: 'number',required: true, message: '请输入价格', trigger: 'blur' }
                        ],
                        inboundNum:[
                            { type: 'number',required: true, message: '请输入实际收货数', trigger: 'blur' }
                        ]
					},
                    orderDetailReceive:[],
                    page:1,
                    size:10,
                    total:0,
                    listLoading:false,
                    sels:[]
				},
                orderHeaderRules:{
                    supplierCode:[
                        { required: true, message: '请选择货主', trigger: 'blur' }
                    ],
					inboundType:[
                        { required: true, message: '请选择货主', trigger: 'blur' }
                    ],
                    orderTime: [
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ]
				},
                inboundStatus:codemaster.WM_INBOUND_STATUS,
				inboundType:codemaster.WM_INBOUND_TYPE,
				auditStatus:codemaster.SYS_AUDIT_STATUS
			}
		},
        computed: {
            btnEditSubmitStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
			},
            btnDetailGridAddStatus:function(){
                if(this.orderHeader.id ===''){
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
            btnRecEditStatus:function(){
                if(this.orderHeader.auditStatus == '00'){
                    return true;
				}
                if(this.detailReceiveGrid.editForm.status ===  '00'){
                    return false;
				}else{
                    return true;
				}
			},
            btnCancelRecEditStatus:function(){
                if(this.orderHeader.auditStatus == '00'){
                    return true;
                }
                if(this.detailReceiveGrid.editForm.status ===  '00'){
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
                return this.$store.state.inboundDetail.orderNo
            },
			status:function(){
                return this.$store.state.inboundDetail.status
			}
        },
		methods: {
            changeEditPopValueForSupplierCode:function(value){
                this.detailGrid.editForm.supplierCode = value[0];
            },
            changeEditPopValueForSkuCode:function(value){
                this.detailGrid.editForm.skuCode = value[0];
            },
            changeRecEditPopValueForSupplierCode:function(value){
                this.detailReceiveGrid.editForm.supplierCode = value[0];
            },
            changeRecEditPopValueForSkuCode:function(value){
                this.detailReceiveGrid.editForm.skuCode = value[0];
            },
            changeEditPopValueForPlanLoc:function(value){
                this.detailGrid.editForm.planLoc = value[0];
            },
            changeRecevieEditPopValueForPlanLoc:function(value){
                this.detailReceiveGrid.editForm.planLoc = value[0];
            },
            changeRecevieEditPopValueForInboundLoc:function(value){
                this.detailReceiveGrid.editForm.inboundLocCode = value[0];
            },
            formatTime: function(row, column){
                if(row[column.property]!==null) {
                    let unixTimestamp = new Date(row[column.property])
                    return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_INBOUND_STATUS,row.status);
            },
            selsChange: function (sels) {
                this.detailGrid.sels = sels;
            },
            recSelsChange: function (sels) {
                this.detailReceiveGrid.sels = sels;
            },
//            batchRemove(){
//
//			},
            save(){
                this.$refs.orderHeader.validate((valid) => {
                    if (valid) {
                        this.pageControl.saveBtnLoading = true;
                        saveInboundOrder({order: JSON.stringify(this.orderHeader)}).then((res) => {
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
                            debugger
                            this.$store.commit('changeInboundOrderNo',this.orderHeader.orderNo);
                            this.$store.commit('changeInboundStatus','EDIT');
                            this.getDetails();
                            this.getDetailReceives();
                        });
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
                            saveInboundDetail({detail:JSON.stringify(para)}).then((res) => {
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
                                this.getDetailReceives();
                            }).catch((data) => {
                                this.pageControl.editLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
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
                });
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
			getOrder(){
                NProgress.start();
                getInboundOrderHeader({orderNo:this.orderNo}).then((res) => {
                    NProgress.done();
                    this.orderHeader = Object.assign({}, res.data);
                    this.getDetails();
                    this.getDetailReceives();
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
                getInboundDetailListPage(para).then((res) => {
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
            handleCurrentReceivesDetailChange(val) {
                this.detailReceiveGrid.page = val;
                this.getDetailReceives();
            },
            getDetailReceives(){
                this.detailReceiveGrid.listLoading = true;
                let para = {
                    page: this.detailReceiveGrid.page,
                    size: this.detailReceiveGrid.size,
                    conditions:JSON.stringify({orderNo:this.orderHeader.orderNo})
                }
                getInboundRecListPage(para).then((res) => {
                    this.detailReceiveGrid.total = res.data.size;
                    this.detailReceiveGrid.orderDetailReceive = res.data.list;
                    this.detailReceiveGrid.listLoading = false;
                    //NProgress.done();
                }).catch((data) => {
                    this.detailReceiveGrid.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            changePopValueForSupplierCode(value){
                this.orderHeader.supplierCode = value[0];
			},
            back(){
                this.$router.push({ path: '/inboundOrder' });
			},
            addDetailHandler(){
                this.detailGrid.editForm = {
                    id:'',
					orderNo:this.orderHeader.orderNo,
                    lineNo:'',
                    status:'00',
                    supplierCode:this.orderHeader.supplierCode,
                    skuCode:'',
                    inboundPreNum:0,
                    inboundNum:0,
                    inboundPrice:0,
                    planLoc:'',
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
                    removeInboundDetail(para).then((res) => {
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
                        this.getDetailReceives();
					}).catch((data) => {
                        this.detailGrid.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
				});
            },
            handleRecDetailEdit(index, row){
                this.detailReceiveGrid.editForm = {};
                this.pageControl.recEditFormVisible = true;
                this.detailReceiveGrid.editForm = Object.assign({}, row);
			},
            recEditSubmit(){
                this.$refs.recEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认收货吗？', '提示', {}).then(() => {
                            this.pageControl.recEditLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.detailReceiveGrid.editForm);
                            receive({receive:JSON.stringify(para)}).then((res) => {
                                this.pageControl.recEditLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['recEditForm'].resetFields();
                                this.pageControl.recEditFormVisible = false;
                                this.getOrder();
                            }).catch((data) => {
                                this.pageControl.recEditFormVisible = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
			},
            cancleRecEditSubmit(){
                this.$refs.recEditForm.validate((valid) => {
					if (valid) {
						this.$confirm('取消收货吗？', '提示', {}).then(() => {
						    debugger
							this.pageControl.cancelRecEditLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.detailReceiveGrid.editForm);
                            cancelReceive({receive:JSON.stringify(para)}).then((res) => {
								this.pageControl.cancelRecEditLoading = false;
								//NProgress.done();
								if(res.data.code == 200){
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
								}else{
									this.$message.error(res.data.msg);
								}
								this.$refs['recEditForm'].resetFields();
								this.pageControl.recEditFormVisible = false;
								this.getOrder();
							}).catch((data) => {
                                this.pageControl.cancelRecEditLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
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
		    if(this.status === 'EDIT'){
                this.getOrder();
			}
			else if(this.status === 'ADD'){
                this.orderHeader={
                    id:'',
					orderNo:'',
					supplierCode:'',
					status:'00',
					orderTime:'',
					auditOp:'',
                    auditStatus:'00',
					auditTime:'',
					inboundType:'',
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