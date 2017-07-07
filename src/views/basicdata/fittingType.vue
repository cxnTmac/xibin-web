<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="配件类别名称" prop="fittingTypeName">
					<el-input v-model="filters.fittingTypeName" placeholder="配件类别名称"></el-input>
				</el-form-item>

					<el-button type="primary" style="float: right" v-on:click="getFittingTypes">查询</el-button>


			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="fittingTypes" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="fittingTypeCode" label="配件类型编码" width="200" sortable>
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="fittingTypeName" label="配件类型名称" width="300"  >
			</el-table-column>
			<el-table-column prop="fittingTypeRemark" label="备注" min-width="400">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
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
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="配件类型编码" prop="fittingTypeCode">
					<el-input v-model="editForm.fittingTypeCode" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="配件类型名称" prop="fittingTypeName">
					<el-input v-model="editForm.fittingTypeName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editForm.fittingTypeRemark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="配件类型编码" prop="fittingTypeCode">
					<el-input v-model="addForm.fittingTypeCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="配件类型名称" prop="fittingTypeName">
					<el-input v-model="addForm.fittingTypeName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="addForm.fittingTypeRemark" auto-complete="off"></el-input>
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
	import { getFittingTypeListPage, removeFittingType, saveFittingType ,batchRemoveFittingType} from '../../api/fittingTypeApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
				filters: {
                    fittingTypeCode: '',
                    fittingTypeName:''
				},
                fittingTypes: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    fittingTypeCode: [
						{ required: true, message: '请输入编码', trigger: 'blur' }
					],
                    fittingTypeName:[
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
                    fittingTypeCode: '',
                    fittingTypeName: '',
                    fittingTypeRemark:'',
					fittingTypeStatue: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    fittingTypeCode: [
						{ required: true, message: '请输入编码', trigger: 'blur' }
					],
                    fittingTypeName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    id: 0,
                    fittingTypeCode: '',
                    fittingTypeName: '',
                    fittingTypeRemark:'',
                    fittingTypeStatue: ''
				}
			}
		},
		methods: {
			//性别显示转换

			handleCurrentChange(val) {
				this.page = val;
				this.getFittingTypes();
			},
			//获取用户列表
            getFittingTypes() {

				let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
				getFittingTypeListPage(para).then((res) => {
					this.total = res.data.size;
					this.fittingTypes = res.data.list;
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
					//NProgress.start();
					let para = { id: row.id ,fittingTypeCode:row.fittingTypeCode};
                    removeFittingType(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getFittingTypes();
                        }else{
                            this.$message.error(res.data.msg);
                        }

					});
				}).catch(() => {

				});
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
                    fittingTypeCode: '',
                    fittingTypeName: '',
                    fittingTypeRemark:'',
                    fittingTypeStatue: '',
                    remark:''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
                            saveFittingType({fittingType:JSON.stringify(para)}).then((res) => {
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
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getFittingTypes();
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
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
                            saveFittingType({fittingType:JSON.stringify(para)}).then((res) => {
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
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getFittingTypes();
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
				var ids = this.sels.map(item => item.id).join(",");
				var fittingTypeCodes = this.sels.map(item => item.fittingTypeCode).join(",");
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids ,fittingTypeCodes:fittingTypeCodes};
                    batchRemoveFittingType(para).then((res) => {
						this.listLoading = false;
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }

						this.getFittingTypes();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getFittingTypes();
		}
	}

</script>

<style scoped>

</style>