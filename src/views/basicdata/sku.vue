<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.skuName" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getSkus"><i class="el-icon-search el-icon--left"></i>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="skus" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="fittingSkuCode" label="产品编码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="fittingSkuName" label="产品名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="modelCode" label="车型" width="120" >
			</el-table-column>
			<el-table-column prop="fittingTypeCode" label="配件类别编码" width="120" >
			</el-table-column>
			<el-table-column prop="fittingTypeName" label="配件类别名称" width="120" >
			</el-table-column>
			<el-table-column prop="fittingSkuRemark" label="产品备注" width="120" >
			</el-table-column>
			<el-table-column prop="manufacturer" label="生产厂家" width="120" >
			</el-table-column>
			<el-table-column prop="materialquality" label="材质" width="120" >
			</el-table-column>
			<!--<el-table-column prop="packageCode" label="包装编码" width="120" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="uomDesc" label="单位" width="120" >
			</el-table-column>
			<el-table-column prop="price" label="参考价格" width="120" sortable>
			</el-table-column>

			<el-table-column prop="type" label="包装类别" width="120"  :formatter="formatISPACKED">
			</el-table-column>
			<el-table-column prop="def1" label="详细尺寸" width="120" >
			</el-table-column>
			<el-table-column prop="def2" label="自定义2" width="120" >
			</el-table-column>
			<el-table-column prop="def3" label="自定义3" width="120" >
			</el-table-column>
			<el-table-column prop="def4" label="自定义4" width="120" >
			</el-table-column>
			<el-table-column prop="def5" label="自定义5" width="120" >
			</el-table-column>

			<el-table-column label="操作" fixed="right" min-width="270">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"><i class="el-icon-delete2 el-icon--left"></i>删除</el-button>
					<el-button type="primary" size="small" @click="handlePicManager(scope.$index, scope.row)"><i class="el-icon-picture el-icon--left"></i>图片管理</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0"><i class="el-icon-delete2 el-icon--left"></i>批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--图片管理界面-->
		<el-dialog title="图片管理" :visible.sync="dialogPicManagerVisible">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="图片上传" name="picUpload">
					<el-upload ref="upload"
						class="upload-demo"
						drag
							   :data= "currentRow"
							   :on-success="uploadConnectSuccess"
							   :on-error="uploadConnectFail"
						action="/xibin/file/uploadFittingSkuPic.shtml"
							   :file-list="fileList"
						multiple
							   list-type="picture"
						:auto-upload="true">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
					</el-upload>
					<!--<el-button type="primary" size="large" @click="startUpload">开始上传</el-button>-->
				</el-tab-pane>
				<el-tab-pane label="图片查看" name="picManage">
					<el-row>
						<el-col :span="6"  v-for="(img,index) in imgs" :key="img" :offset="index > 0 ? 2 : 0">
							<el-card :body-style="{ padding: '0px' }">
								<el-tooltip :content="img.normal.fittingSkuPicName" placement="left" effect="dark">
								<img :src=img.zip.fittingSkuPicUrl v-preview="img.normal.fittingSkuPicUrl" class="image" >
								</el-tooltip>
								<div style="padding: 14px;">
									<span>{{img.normal.fittingSkuPicName}}</span>
									<div class="bottom clearfix">
										<time class="time">{{img.normal.createTime}}</time>
										<!--<el-button type="danger" icon="delete"></el-button>-->
										<el-button type="text" class="button" @click="handleDelPic(img.normal.id,img.zip.id,img.normal.fittingSkuCode)">删除</el-button>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>

				</el-tab-pane>
			</el-tabs>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="产品编码" prop="fittingSkuCode">
							<el-input v-model="editForm.fittingSkuCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品名称" prop="fittingSkuName">
							<el-input v-model="editForm.fittingSkuName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="20">
						<el-form-item label="产品备注" prop="fittingSkuRemark">
							<el-input v-model="editForm.fittingSkuRemark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="6">
						<el-form-item label="生产厂家" prop="manufacturer">
							<el-input v-model="editForm.manufacturer" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="材质" prop="materialquality">
							<el-input v-model="editForm.materialquality" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="单位" prop="uomDesc">
							<el-input v-model="editForm.uomDesc" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="参考价格" prop="price">
							<el-input v-model="editForm.price" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="车型" prop="modelCode">
							<el-input v-model="editForm.modelCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="配件类别" prop="fittingTypeCode">
							<popwin-button popKey="POP_FITTINGTYPE" :selectValue="editForm.fittingTypeCode" @changeValue="changeEditPopValueForFittingType"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="包装类别" prop="type">
							<el-select v-model="editForm.type" placeholder="请选择">
								<el-option
										v-for="item in is_packed"
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
						<el-form-item label="详细尺寸" prop="def1">
							<el-input v-model="editForm.def1" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="产品编码" prop="fittingSkuCode">
							<el-input v-model="addForm.fittingSkuCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="产品名称" prop="fittingSkuName">
							<el-input v-model="addForm.fittingSkuName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="20">
						<el-form-item label="产品备注" prop="fittingSkuRemark">
							<el-input v-model="addForm.fittingSkuRemark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="6">
						<el-form-item label="生产厂家" prop="manufacturer">
							<el-input v-model="addForm.manufacturer" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="材质" prop="materialquality">
							<el-input v-model="addForm.materialquality" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="单位" prop="uomDesc">
							<el-input v-model="addForm.uomDesc" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="参考价格" prop="price">
							<el-input v-model="addForm.price" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="车型" prop="modelCode">
							<el-input v-model="addForm.modelCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="配件类别" prop="fittingTypeCode">
							<popwin-button popKey="POP_FITTINGTYPE" :selectValue="addForm.fittingTypeCode" @changeValue="changeAddPopValueForFittingType"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="包装类别" prop="type">
							<el-select v-model="addForm.type" placeholder="请选择">
								<el-option
										v-for="item in is_packed"
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
						<el-form-item label="详细尺寸" prop="def1">
							<el-input v-model="addForm.def1" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
	import { getFittingSkuListPage, removeFittingSku, batchRemoveFittingSku, saveFittingSku,getFittingSkuPic,removeFittingSkuPic} from '../../api/fittingSkuApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                imgs: [],
				is_packed:codemaster.WM_IS_PACKED,
				filters: {
				    fittingSkuCode:'',
					fittingSkuName: ''
				},
				skus: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列
				currentRow:{},//当前点击按钮对应的列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    fittingSkuCode: [
						{ required: true, message: '请输入产品编码', trigger: 'blur' }
					],
                    fittingSkuName:[
						{ required: true, message: '请输入产品名称', trigger: 'blur' }
					],
                    modelCode:[
						{ required: true, message: '请输入车型', trigger: 'blur' }
					],
                    fittingTypeCode:[
                        { required: true, message: '请输入配件类别', trigger: 'blur' }
                    ]
				},
				//编辑界面数据
				editForm: {
                    id: 0,
                    fittingSkuCode: '',
                    fittingSkuName: '',
                    fittingSkuStatus: '',
                    fittingSkuRemark:'',
                    manufacturer:'',
                    materialquality:'',
                    packageCode:'',
                    uomDesc:'',
                    price:'',
                    modelCode:'',
                    fittingTypeCode:'',
                    type:'',
                    def1:'',
                    def2:'',
                    def3:'',
                    def4:'',
                    def5:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules:{
                    fittingSkuCode: [
                        { required: true, message: '请输入产品编码', trigger: 'blur' }
                    ],
                    fittingSkuName:[
                        { required: true, message: '请输入产品名称', trigger: 'blur' }
                    ],
                    modelCode:[
                        { required: true, message: '请输入车型', trigger: 'blur' }
                    ],
                    fittingTypeCode:[
                        { required: true, message: '请输入配件类别', trigger: 'blur' }
                    ]
                },
				//新增界面数据
				addForm: {
                    id: 0,
                    fittingSkuCode: '',
                    fittingSkuName: '',
                    fittingSkuStatus: '',
                    fittingSkuRemark:'',
                    manufacturer:'',
                    materialquality:'',
                    packageCode:'',
                    uomDesc:'',
                    price:'',
                    modelCode:'',
                    fittingTypeCode:'',
                    type:'',
                    def1:'',
                    def2:'',
                    def3:'',
                    def4:'',
                    def5:''
				},
				//UI控制数据
                dialogPicManagerVisible : false,
                activeName:'picUpload',
                fileList:[]
			}
		},
		methods: {
            changeAddPopValueForFittingType:function(value){
                this.addForm.fittingTypeCode = value[0];

            },
            changeEditPopValueForFittingType:function(value){
                this.editForm.fittingTypeCode = value[0];
            },
            formatISPACKED: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_IS_PACKED,row.type);
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getSkus();
			},
			//获取用户列表
			getSkus() {
				let para = {
					page: this.page,
					size: this.size,
					conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
                getFittingSkuListPage(para).then((res) => {
					this.total = res.data.size;
					this.skus = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();
					let para = { id: row.id };
                    removeFittingSku(para).then((res) => {
						this.listLoading = false;
						NProgress.done();

						this.getSkus();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
                this.currentRow = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    id: 0,
                    fittingSkuCode: '',
                    fittingSkuName: '',
                    fittingSkuStatus: '',
                    fittingSkuRemark:'',
                    manufacturer:'',
                    materialquality:'',
                    packageCode:'',
                    uomDesc:'',
                    price:'',
                    modelCode:'',
                    fittingTypeCode:'',
                    type:'',
                    def1:'',
                    def2:'',
                    def3:'',
                    def4:'',
                    def5:''
				};
                this.currentRow = this.addForm;
			},
            handleDelPic : function(idNormal,idZip,fittingSkuCode){
                    let para ={idNormal:idNormal,idZip:idZip,fittingSkuCode:fittingSkuCode}
                    removeFittingSkuPic(para).then((res) => {
                        this.listLoading = false;
                        NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.imgs = [];
                            this.convertPicData(res.data);
                        }else{
                            this.$message.error("删除失败");
                        }
                    });
			},
            refreshPics : function(fittingSkuCode){
                let para = { fittingSkuCode: fittingSkuCode };
                getFittingSkuPic(para).then((res) => {
                    this.listLoading = false;
                    NProgress.done();
                    this.imgs = [];
                    this.convertPicData(res);
                });
            },
			convertPicData : function(res){
                let normalPics = [];
                let zipPics = [];
                for(let i = 0;i<res.data.length;i++){
                    if(res.data[i].type ==='NORMAL'){
                        normalPics.push(res.data[i]);
                    }else if(res.data[i].type ==='ZIP'){
                        zipPics.push(res.data[i]);
                    }
                }
                console.log(normalPics);
                console.log(zipPics);
                for(let z = 0;z<normalPics.length;z++){
                    for(let j = 0;j<zipPics.length;j++){
                        if(normalPics[z].fittingSkuPicName === zipPics[j].fittingSkuPicName){
                            this.imgs.push({'normal':normalPics[z],'zip':zipPics[j]});
                        }
                    }
                }
                console.log(this.imgs);
			},
			//点击图片管理
            handlePicManager:function(index, row){
                this.fileList = [];
                this.currentRow = Object.assign({}, row);
                this.dialogPicManagerVisible  = true;
                this.refreshPics(this.currentRow.fittingSkuCode);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            saveFittingSku({fittingSku:JSON.stringify(para)}).then((res) => {
								this.editLoading = false;
								NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getSkus();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.addForm);

                            saveFittingSku({fittingSku:JSON.stringify(para)}).then((res) => {
								this.addLoading = false;
								NProgress.done();
                                if(res.data.code == 200){
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getSkus();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();
					let para = { ids: ids };
                    batchRemoveFittingSku(para).then((res) => {
						this.listLoading = false;
						NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getSkus();
					});
				}).catch(() => {

				});
			},
            handleClick : function(tab, event) {
                console.log(tab, event);
            },
//			startUpload : function() {
//				this.$refs.upload.submit();
//			},
            uploadConnectSuccess : function(response, file, fileList){
                debugger;
                if(response.code == 0){
                    this.$message.error(response.msg);

				}else if(response.code == 200){
                    this.refreshPics(this.currentRow.fittingSkuCode);
				}
			},

            uploadConnectFail : function(err, file, fileList){
                this.$message.error("网络连接错误，上传失败！");
			}

		},
		mounted() {
			this.getSkus();
		}
	}

</script>

<style scoped>
	.time {
		font-size: 13px;
		color: #999;
	}

	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}
	.button {
		padding: 0;
		float: right;
	}
	.image {
		width: 100%;
		display: block;
	}
	.clearfix:after {
		display: table;
		content: "";
	}
	.clearfix:after {
		clear: both
	}
</style>