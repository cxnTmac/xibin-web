<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="userName" label="用户名" width="120" sortable>
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="password" label="密码" width="100"  >
			</el-table-column>
			<el-table-column prop="isEnable" label="是否启用" width="120" :formatter="formatYorN">
			</el-table-column>
			<el-table-column prop="roleCode" label="角色编码" width="120" >
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名">
					<el-input v-model="editForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input type="password" v-model="editForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-select v-model="editForm.isEnable" placeholder="请选择">
						<el-option
								v-for="item in yes_no"
								:key="item.code"
								:label="item.name"
								:value="item.code">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色">
					<popwin-button popKey="POP_ROLE" :selectValue="editForm.roleCode" @changeValue="changeEditPopValue"></popwin-button>
				</el-form-item>
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
						<el-form-item label="姓名" prop="userName">
							<el-input v-model="addForm.userName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="密码" prop="password">
							<el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="是否启用">
					<el-select v-model="addForm.isEnable" placeholder="请选择">
						<el-option
								v-for="item in yes_no"
								:key="item.code"
								:label="item.name"
								:value="item.code">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="角色">
							<popwin-button popKey="POP_ROLE" :selectValue="addForm.roleCode" @changeValue="changeAddPopValue"></popwin-button>
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
    //import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    var codemaster = require('../../../static/codemaster.json');
    //查询弹出框
    require('../../components/popWin.vue');

	export default {
		data() {
			return {

				yes_no:codemaster.SYS_YES_NO,
				filters: {
					userName: ''
				},
				users: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
                    password:[
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					userName: '',
					password: '',
					isEnable: 'N',
					roleCode:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
				},
				//新增界面数据
				addForm: {
                    id: 0,
                    userName: '',
                    password: '',
                    isEnable: 'N',
                    roleCode:''
				},
				roles:[]
			}
		},
		methods: {
            changeAddPopValue:function(value){
				this.addForm.roleCode = value[0];

			},
            changeEditPopValue:function(value){
                this.editForm.roleCode = value[0];
            },
			//性别显示转换
            formatYorN: function (row, column) {
                return util.getComboNameByValue(codemaster.SYS_YES_NO,row.isEnable);
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
                var codemaster = require('../../../static/codemaster.json');
				let para = {
					page: this.page,
					size: this.size,
					conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.size;
					this.users = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
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
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {
                    util.errorCallBack(data,this.$router,this.$message);
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
					userName: '',
                    password: '',
                    isEnable: 'N',
                    roleCode:''
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser({user:JSON.stringify(para)}).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser({user:JSON.stringify(para)}).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
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
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {
                    util.errorCallBack(data,this.$router,this.$message);
				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>