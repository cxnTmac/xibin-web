<template>
	<section>
		<div v-title data-title="车型"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="车型名称" prop="modelName">
					<el-input v-model="filters.modelName" placeholder="车型名称"></el-input>
				</el-form-item>

					<el-button type="primary"  style="float: right" v-on:click="getModels">查询</el-button>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users"  highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="modelCode" label="车型编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="modelName" label="车型名称" width="300" v-if="hasAuthority('1002003111')" >
			</el-table-column>
			<el-table-column prop="modelRemark" label="备注" min-width="400">
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="车型编码" prop="modelCode">
					<el-input v-model="editForm.modelCode" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="车型名称" prop="modelName">
					<el-input v-model="editForm.modelName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editForm.modelRemark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="车型编码" prop="modelCode">
					<el-input v-model="addForm.modelCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="车型名称" prop="modelName">
					<el-input v-model="addForm.modelName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="addForm.modelRemark" auto-complete="off"></el-input>
				</el-form-item>
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
	//import NProgress from 'nprogress'
	import { getModelListPage, removeModel, saveModel ,batchRemoveModel} from '../../api/modelApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
				authority:null,
				filters: {
					modelName: ''
				},
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    modelCode: [
						{ required: true, message: '请输入编码', trigger: 'blur' }
					],
                    modelName:[
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					modelName: '',
					modelCode: '',
					modelStatus: '',
					modelRemark:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    modelCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    modelName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    id: 0,
                    modelName: '',
                    modelCode: '',
                    modelStatus: '',
                    modelRemark:''
				},
				roles:[]
			}
		},
		methods: {
			getAuthority(){
				let currentRoute = this.$route
				let btnsAndColumns = this.$store.state.roleFunctions.btnsAndColumns
				for(let i = 0;i<btnsAndColumns.length;i++){
					if(btnsAndColumns[i].path === currentRoute.path){
						this.authority = btnsAndColumns[i]
						return; 
					}
				}
			},
			hasAuthority(authorityCode){
				var x = this.authority.btnsAndColumns
				for(var j = 0;j<x.length;j++){
					if(x[j].functionCode === authorityCode){
						return true
					}
				}
				return false
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getModels();
			},
			//获取用户列表
			getModels() {
                var codemaster = require('../../../static/codemaster.json');
				let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
				getModelListPage(para).then((res) => {
					this.total = res.data.size;
					this.users = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id ,modelCode:row.modelCode};
					removeModel(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getModels();
                        }else{
                            this.$message.error(res.data.msg);
                        }
					}).catch((data) => {
                        this.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });;
				})
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
                    modelName: '',
                    modelCode: '',
                    modelStatus: '',
                    modelRemark:''
				};
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
                            saveModel({model:JSON.stringify(para)}).then((res) => {
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
								this.getModels();
							}).catch((data) => {
                                this.editLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
                            });
						});
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
                            saveModel({model:JSON.stringify(para)}).then((res) => {
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
								this.getModels();
							}).catch((data) => {
                                this.addLoading = false;
                                util.errorCallBack(data,this.$router,this.$message);
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
                var modelCodes = this.sels.map(item => item.modelCode).join(",");
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids ,modelCodes:modelCodes};
                    batchRemoveModel(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
						this.getModels();
					}).catch((data) => {
                        this.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
				}).catch(() => {

				});
			}
		},
		created(){
			//获取该页面的权限
			this.getAuthority();
		},
		mounted() {
			
			this.getModels();
		}
	}

</script>

<style scoped>

</style>