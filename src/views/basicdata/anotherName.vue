<template>
	<section>
		<div v-title data-title="产品别名"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
				<el-form-item label="产品编码" prop="fittingSkuCode">
					<popwin-button popKey="POP_SKU" :showName="true" :displayName="filters.fittingSkuName" v-model="filters.fittingSkuCode"></popwin-button>
				</el-form-item>
				<el-form-item label="别名" prop="areaCode">
					<el-input v-model="filters.fittingSkuAnotherName" placeholder="别名"></el-input>
				</el-form-item>
				<el-form-item label="客户" prop="areaCode">
					<popwin-button popKey="POP_CUSTOMER" :showName="true" :displayName="filters.customerName" v-model="filters.customerCode"></popwin-button>
				</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
				<el-row :gutter="0"  v-if="showMoreQueryCondition">
				</el-row>
				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="records" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="fittingSkuCode" label="产品编码" width="80" >
			</el-table-column>
			<el-table-column prop="quickCode" label="快速编码" width="80" >
			</el-table-column>
			<el-table-column prop="fittingSkuName" label="产品名称" width="160" >
			</el-table-column>
			<el-table-column prop="modelCode" label="车型" width="120" >
			</el-table-column>
			<el-table-column prop="fittingSkuAnotherName" label="别名" width="200" >
			</el-table-column>
			<el-table-column prop="customerCode" label="客户编码" width="80" >
			</el-table-column>
			<el-table-column prop="customerName" label="客户名称" width="240" >
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="400" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" min-width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="primary" @click="openExcelImportPopWin">EXCEL导入客户数据查询产品编码</el-button>
			<el-button type="primary" @click="openExcelImportForSavePopWin">EXCEL导入产品别名</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="产品编码" prop="fittingSkuCode">
							<popwin-button popKey="POP_SKU" :showName="true" :displayName="addForm.fittingSkuName"  v-model="addForm.fittingSkuCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="别名" prop="fittingSkuAnotherName">
							<el-input v-model="addForm.fittingSkuAnotherName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户编码" prop="customerCode">
							<popwin-button popKey="POP_CUSTOMER" :showName="true" :displayName="addForm.customerName"  v-model="addForm.customerCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="备注"  prop="remark">
							<el-input v-model="addForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="产品编码" prop="fittingSkuCode">
							<popwin-button popKey="POP_SKU" :displayName="editForm.fittingSkuName"  v-model="editForm.fittingSkuCode"></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="别名" prop="fittingSkuAnotherName">
							<el-input v-model="editForm.fittingSkuAnotherName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="客户编码" prop="customerCode">
							<popwin-button popKey="POP_CUSTOMER" :showName="true"  :displayName="editForm.customerName" v-model="editForm.customerCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="EXCEL导入客户数据查询产品编码" :visible.sync="excelImportPopWinVisible" :close-on-click-modal="false">
			<el-form :model="excelImportPopWinForm" label-width="80px" ref="excelImportPopWinForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户" prop="customerCode">
							<popwin-button popKey="POP_CUSTOMER" :selectValue="excelImportPopWinForm.customerCode" v-model="excelImportPopWinForm.customerCode" ></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="客户产品编码/别名列名" prop="skuCodeColumnName">
							<el-input   v-model="excelImportPopWinForm.skuCodeColumnName" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="结果" prop="result">
							<el-input  type="textarea"   v-model="excelImportPopWinForm.result" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-upload ref="upload"
							   class="upload-demo"
							   drag
							   :data= "excelImportPopWinForm"
							   :on-success="uploadConnectSuccess"
							   :on-error="uploadConnectFail"
							   :before-upload="beforeExcelUplaod"
							   action="/xibin/anotherName/importSkuCodesByExcel "
							   :file-list="excelFileList"
							   multiple
							   list-type="text"
							   :auto-upload="true">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
					</el-upload>
				</el-row>
			</el-form>


		</el-dialog>


		<el-dialog title="excel导入产品别名" :visible.sync="excelImportForSavePopWinVisible" :close-on-click-modal="false">
			<el-form :model="excelImportForSavePopWinForm" label-width="80px" ref="excelImportForSavePopWinForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户" prop="customerCode">
							<popwin-button popKey="POP_CUSTOMER" :selectValue="excelImportForSavePopWinForm.customerCode" v-model="excelImportForSavePopWinForm.customerCode" ></popwin-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品别名列名" prop="skuCodeColumnName">
							<el-input   v-model="excelImportForSavePopWinForm.customerSkuCodeColumnName" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="产品编码列名" prop="customerCode">
							<el-input   v-model="excelImportForSavePopWinForm.skuCodeColumnName" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注" prop="remark">
							<el-input   v-model="excelImportForSavePopWinForm.remark" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="结果" prop="result">
							<el-input  type="textarea"   v-model="excelImportForSavePopWinForm.result" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-upload ref="upload"
							   class="upload-demo"
							   drag
							   :data= "excelImportForSavePopWinForm"
							   :on-success="uploadSaveExcelConnectSuccess"
							   :on-error="uploadSaveExcelConnectFail"
							   :before-upload="beforeSaveExcelUplaod"
							   action="/xibin/anotherName/importSkuCodesByExcelForSave "
							   :file-list="excelFileForSaveList"
							   multiple
							   list-type="text"
							   :auto-upload="true">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
					</el-upload>
				</el-row>
			</el-form>


		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getAnotherNameListPage, saveAnotherName, removeAnotherName} from '../../api/anotherNameApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
				filters: {
					fittingSkuCode: '',
					fittingSkuName:'',
                    fittingSkuAnotherName: '',
					customerCode:'',
					customerName:''
				},
                records: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    fittingSkuCode: [
                        { required: true, message: '请输入产品编码', trigger: 'blur' }
                    ],
                    fittingSkuAnotherName:[
                        { required: true, message: '请输入别名', trigger: 'blur' }
                    ],
                    customerCode:[
                        { required: true, message: '请输入客户', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    fittingSkuCode: '',
                    fittingSkuAnotherName: '',
                    customerCode:'',
                    remark:''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    fittingSkuCode: [
                        { required: true, message: '请输入产品编码', trigger: 'blur' }
                    ],
                    fittingSkuAnotherName:[
                        { required: true, message: '请输入别名', trigger: 'blur' }
                    ],
                    customerCode:[
                        { required: true, message: '请输入客户', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    fittingSkuCode: '',
                    fittingSkuAnotherName: '',
                    customerCode:'',
                    remark:''
                },
                excelImportPopWinVisible:false,
                excelImportPopWinForm:{
                    skuCodeColumnName:'',
                    customerCode:'',
                    result:''
				},
				excelFileList:[],
				excelImportForSavePopWinVisible:false,
                excelImportForSavePopWinForm:{
					skuCodeColumnName:'',
					customerSkuCodeColumnName:'',
                    customerCode:'',
					result:'',
					remark:''
				},
                excelFileForSaveList:[]
			}
		},
		methods: {
			// excel导入客户产品别名获取对应产品编码窗口
            openExcelImportPopWin(){
                this.excelImportPopWinVisible = true;
                this.excelImportPopWinForm = {
                    skuCodeColumnName:'',
                    customerCode:'',
                    result:''
				}
            },
            beforeExcelUplaod:function (file) {
                if(this.excelImportPopWinForm.cutomerCode === ''||this.excelImportPopWinForm.skuCodeColumnName === ''){
                    this.$message.error("请填写完整数据！");
                    return false;
                }
                return true;
            },
            uploadConnectSuccess : function(res, file, fileList){
                if(res.code == 0){
                    this.$message.error(res.msg);
                }else if(res.code == 200){
                    let result = '';
                    for(let i =0;i<res.data.length;i++){
                        result = result+res.data[i]+'\n';
					}
					this.excelImportPopWinForm.result = result;
                    this.$message({
                        message: "操作成功",
                        type: 'success'
                    });
                }
            },
            uploadConnectFail : function(err, file, fileList){
                this.$message.error("网络连接错误，上传失败！");
			},
			// excel导入新的产品别名窗口
			openExcelImportForSavePopWin(){
                this.excelImportForSavePopWinVisible = true;
                this.excelImportForSavePopWinForm = {
					skuCodeColumnName:'',
					customerSkuCodeColumnName:'',
                    customerCode:'',
					result:'',
					remark:''
				}
            },
            beforeSaveExcelUplaod:function (file) {
                if(this.excelImportForSavePopWinForm.cutomerCode === ''||this.excelImportForSavePopWinForm.skuCodeColumnName === ''||this.excelImportForSavePopWinForm.customerSkuCodeColumnName === ''){
                    this.$message.error("请填写完整数据！");
                    return false;
                }
                return true;
            },
            uploadSaveExcelConnectSuccess : function(res, file, fileList){
                if(res.code == 0){
                    this.$message.error(res.msg);
                }else if(res.code == 200){
					this.excelImportForSavePopWinForm.result = res.msg;
                    this.$message({
                        message: "操作成功",
                        type: 'success'
					});
					this.getRecords();
                }
            },
            uploadSaveExcelConnectFail : function(err, file, fileList){
                this.$message.error("网络连接错误，上传失败！");
			},
			

            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
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
                this.addFormVisible = true;
                this.addForm = {
                    id: 0,
                    areaName: '',
                    areaCode: '',
                    remark:''
                };
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    NProgress.start();
                    let para = { id: row.id ,fittingSkuCode: row.fittingSkuCode,customerCode:row.customerCode};
                    removeAnotherName(para).then((res) => {
                        this.listLoading = false;
                        NProgress.done();
                        this.getRecords();
                    }).catch((data) => {
                        this.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
                })
            },
            //编辑
            editSubmit: function () {
				let _this = this;
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            saveAnotherName({anotherName:JSON.stringify(para)}).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                _this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getRecords();
                            }).catch((data) => {
                                this.editLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        })
                    }
                });
            },
            //新增
            addSubmit: function () {
				let _this = this;
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            saveAnotherName({anotherName:JSON.stringify(para)}).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                                _this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getRecords();
                            }).catch((data) => {
                                this.addLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
                        })
                    }
                });
            },
			//获取用户列表
            getRecords() {
				let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                getAnotherNameListPage(para).then((res) => {
					this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			},

		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>