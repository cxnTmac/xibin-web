<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
				<el-button type="primary" :disabled="btnAuditStatus" @click="audit" :loading="pageControl.auditBtnLoading">审核</el-button>
				<el-button type="danger" :disabled="btnCancelAuditStatus" @click="cancelAudit" :loading="pageControl.cancelAuditBtnLoading">取消审核</el-button>
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
						<el-form-item label="组装单号" prop="orderNo">
							<el-input v-model="orderHeader.orderNo" disabled auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="状态" prop="status">
								<el-select v-model="orderHeader.status" disabled placeholder="请选择">
									<el-option
											v-for="item in assembleStatus"
											:key="item.code"
											:label="item.name"
											:value="item.code">
										<span style="float: left">{{ item.name }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
									</el-option>
								</el-select>
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
					<el-col :span="6">
						<el-form-item label="组装类型" prop="assembleType">
							<el-select v-model="orderHeader.assembleType"  placeholder="请选择">
								<el-option
										v-for="item in assembleType"
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
				</el-row>
				<el-row :gutter="0">
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
						<el-form-item label="审核时间" prop="auditDate">
							<el-date-picker
									v-model="orderHeader.auditDate"
									type="datetime"
									placeholder="选择日期时间"
									disabled>
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="审核人"  prop="auditor">
							<el-input v-model="orderHeader.auditor" disabled auto-complete="off"></el-input>
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
		</el-form>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span style="line-height: 15px;">父件明细</span>
			</div>
			<el-table :data="fDetailGrid.fDetail" border highlight-current-row v-loading="fDetailGrid.listLoading" stripe style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="lineNo" label="行号" width="100" >
				</el-table-column>
				<el-table-column prop="orderNo" label="组装单号" width="200" >
				</el-table-column>
				<el-table-column prop="fittingSkuCode" label="产品编码" width="200" >
				</el-table-column>
				<el-table-column prop="fittingSkuName" label="产品名称" width="200" >
				</el-table-column>
				<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
				</el-table-column>
				<el-table-column prop="preNum" label="预组装数" width="200">
				</el-table-column>
				<el-table-column prop="num" label="组装数" width="200">
				</el-table-column>
				<el-table-column prop="assembleLoc" label="计划库位" width="200">
				</el-table-column>
				<el-table-column prop="remark" label="备注" >
				</el-table-column>
				<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
				<!--</el-table-column>-->

				<el-table-column label="操作" fixed="right" min-width="150">
					<template scope="scope">
						<el-button size="small"  @click="handleFDetailEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" :disabled="btnFDetailGridDelStatus" size="small" @click="handleFDetailDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button type="primary" :disabled="btnFDetailGridAddStatus" @click="addFDetailHandler">新增</el-button>
				<!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
				<!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange" :page-size="detailGrid.size" :total="detailGrid.total" style="float:right;">-->
				<!--</el-pagination>-->
			</el-col>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span style="line-height: 15px;">子件明细</span>
			</div>
			<el-table :data="sDetailGrid.sDetail" border highlight-current-row v-loading="sDetailGrid.listLoading" stripe style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="fLineNo" label="父件行号" width="100" >
				</el-table-column>
				<el-table-column prop="lineNo" label="行号" width="100" >
				</el-table-column>
				<el-table-column prop="orderNo" label="组装单号" width="200" >
				</el-table-column>
				<el-table-column prop="fittingSkuCode" label="产品编码" width="200" >
				</el-table-column>
				<el-table-column prop="fittingSkuName" label="产品名称" width="200" >
				</el-table-column>
				<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
				</el-table-column>
				<el-table-column prop="num" label="数量" width="200">
				</el-table-column>
				<el-table-column prop="allocNum" label="分配数" width="200">
				</el-table-column>
				<el-table-column prop="pickNum" label="拣货数" width="200">
				</el-table-column>
				<el-table-column prop="assembleNum" label="组装数" width="200">
				</el-table-column>
				<el-table-column prop="assembleLoc" label="计划库位" width="200">
				</el-table-column>
				<el-table-column prop="remark" label="备注" >
				</el-table-column>
				<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
				<!--</el-table-column>-->

				<el-table-column label="操作" fixed="right" min-width="150">
					<template scope="scope">
						<el-button size="small"  @click="handleFDetailEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" :disabled="btnFDetailGridDelStatus" size="small" @click="handleFDetailDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button type="primary" :disabled="btnFDetailGridAddStatus" @click="addFDetailHandler">新增</el-button>
				<!--<el-button type="danger"  @click="batchRemove" :disabled="this.detailGrid.sels.length===0">批量删除</el-button>-->
				<!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentDetailChange" :page-size="detailGrid.size" :total="detailGrid.total" style="float:right;">-->
				<!--</el-pagination>-->
			</el-col>
		</el-card>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="pageControl.fDetailEditFormVisible" :close-on-click-modal="false">
			<el-form :model="fDetailGrid.editForm" label-width="80px" :rules="fDetailGrid.editFormRules" ref="fDetailEditForm">
				<el-row :gutter="0">
					<el-col :span="6">
						<el-form-item label="行号" prop="inboundPreNum">
							<el-input v-model="fDetailGrid.editForm.lineNo" :disabled="true" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12" :offset="6">
						<el-form-item label="产品" prop="skuCode">
							<popwin-button popKey="POP_SKU" :staticCondition="fSkuCondtion" :selectValue="fDetailGrid.editForm.fittingSkuCode" v-model="fDetailGrid.editForm.fittingSkuCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="fDetailGrid.editForm.status" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in assembleStatus"
										:key="item.code"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">

					<el-col :span="12">
						<el-form-item label="预组装数" prop="preNum">
							<el-input-number v-model="fDetailGrid.editForm.preNum"  auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="组装数" prop="num">
							<el-input-number v-model="fDetailGrid.editForm.num" :disabled="true" auto-complete="off"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="组装库位" prop="planLoc">
							<popwin-button popKey="POP_LOC" :selectValue="fDetailGrid.editForm.assembleLoc" v-model="fDetailGrid.editForm.assembleLoc"></popwin-button>
							<!--<el-input v-model="detailGrid.editForm.planLoc" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input v-model="fDetailGrid.editForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="pageControl.fDetailEditFormVisible = false">取消</el-button>
				<el-button type="primary" :disabled="btnFDetailEditSubmitStatus" @click.native="fDetailEditSubmit" :loading="pageControl.fDetailEditBtnLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
    import {saveAssembleOrder,saveAssembleFDetail,removeAssembleFDetail,audit,cancelAudit,getAssembleOrderHeader,getAssembleFDetailList} from '../../api/assembleApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
			    fSkuCondtion:{needToAssemble:'Y'},
				orderHeader:{
			        id:'',
					orderNo:'',
					assembleType:'',
					status:'',
					auditStatus:'',
					auditor:'',
					auditDate:'',
					orderTime:'',
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:'',
                    warehouseId:''
				},
                fDetailGrid:{
                    editForm:{
                        id:'',
						orderNo:'',
						lineNo:'',
						fittingSkuCode:'',
						status:'',
						preNum:0,
						num:0,
						assembleLoc:'',
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

					},
                    fDetail:[],
                    page:1,
                    size:10,
                    total:0,
                    listLoading:false,
                    sels:[]
				},
                sDetailGrid:{
                    editForm:{
                        id:'',
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

                    },
                    sDetail:[],
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
                    fDetailEditFormVisible:false,
                    fDetailEditBtnLoading:false,
                    recEditFormVisible:false,
                    recEditLoading:false,
                    cancelRecEditLoading:false
				},
				allocGrid:{
                    editForm:{
                        id:'',

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

					},
                    alloc:[],
                    page:1,
                    size:10,
                    total:0,
                    listLoading:false,
                    sels:[]
				},
                orderHeaderRules:{
					assembleType:[
                        { required: true, message: '请选择货主', trigger: 'blur' }
                    ],
                    orderTime: [
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ]
				},
                assembleStatus:codemaster.WM_ASSEMBLE_STATUS,
				assembleType:codemaster.WM_ASSEMBLE_TYPE,
				auditStatus:codemaster.SYS_AUDIT_STATUS
			}
		},
        computed: {
            btnSaveHeaderStatus:function () {
                if(this.orderHeader.auditStatus === '00'){
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
            btnCancelAuditStatus:function () {
                if(this.orderHeader.auditStatus === '00'){
                    return true;
                }else if(this.orderHeader.status === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            btnFDetailEditSubmitStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            btnFDetailGridAddStatus:function(){
                if(this.orderHeader.id ===''){
                    return true;
                }
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            btnFDetailGridDelStatus:function(){
                if(this.orderHeader.auditStatus === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            orderNo:function() {
                return this.$store.state.assembleDetail.orderNo
            },
			status:function(){
                return this.$store.state.assembleDetail.status
			}
        },
		methods: {
            formatTime: function(row, column){
                if(row[column.property]!==null) {
                    let unixTimestamp = new Date(row[column.property])
                    return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_ASSEMBLE_STATUS,row.status);
            },
            save(){
                this.$refs.orderHeader.validate((valid) => {
                    if (valid) {
                        this.pageControl.saveBtnLoading = true;
                        saveAssembleOrder({order: JSON.stringify(this.orderHeader)}).then((res) => {
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
                            this.$store.commit('changeInboundOrderNo',this.orderHeader.orderNo);
                            this.$store.commit('changeInboundStatus','EDIT');
                        });
                    }
                });
			},
            handleFDetailEdit(index, row){
                this.fDetailGrid.editForm = {};
                this.pageControl.fDetailEditFormVisible = true;
                this.fDetailGrid.editForm = Object.assign({}, row);
            },
            addFDetailHandler(){
                this.fDetailGrid.editForm = {
                    id:'',
                    orderNo:this.orderHeader.orderNo,
                    lineNo:'',
                    status:'00',
                    fittingSkuCode:'',
                    preNum:0,
                    num:0,
                    assembleLoc:'',
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:'',
                    warehouseId:''
                }
                this.pageControl.fDetailEditFormVisible = true;
            },
            fDetailEditSubmit(){
                this.$refs.fDetailEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.pageControl.fDetailEditBtnLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.fDetailGrid.editForm);
                            saveAssembleFDetail({fDetail:JSON.stringify(para)}).then((res) => {
                                this.pageControl.fDetailEditBtnLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                this.$refs['fDetailEditForm'].resetFields();
                                this.pageControl.fDetailEditFormVisible = false;
                                this.getAssembleFDetail();
                            }).catch((data) => {
                                this.pageControl.fDetailEditBtnLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        });
                    }
                });
			},
            handleFDetailDel(index, row){
                this.$confirm('确认删除记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {

                    //NProgress.start();
                    let para = { orderNo: row.orderNo ,lineNo:row.lineNo};
                    removeAssembleFDetail(para).then((res) => {

                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        this.getAssembleFDetail();
                    }).catch((data) => {
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
                getAssembleOrderHeader({orderNo:this.orderNo}).then((res) => {
                    NProgress.done();
                    this.orderHeader = Object.assign({}, res.data);
                    this.getAssembleFDetail();
//                    this.getDetailReceives();
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            getAssembleFDetail(){
                this.fDetailGrid.listLoading = true;
			    let para = {
                    conditions:JSON.stringify({orderNo:this.orderHeader.orderNo})
				}
                getAssembleFDetailList(para).then((res) => {
                    this.fDetailGrid.total = res.data.size;
                    this.fDetailGrid.fDetail = res.data.list;
                    this.fDetailGrid.listLoading = false;
                    //NProgress.done();
                }).catch((data) => {
                    this.fDetailGrid.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},

            back(){
                this.$router.push({ path: '/assembleOrder' });
			}
		},
		mounted() {
		    if(this.status === 'EDIT'){
                this.getOrder();
			}
			else if(this.status === 'ADD'){
                this.orderHeader={
                    id:'',
                    orderNo:'',
                    assembleType:'',
					status:'00',
                    auditStatus:'00',
                    auditor:'',
                    auditDate:null,
                    orderTime:'',
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