<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
				<el-form-item label="通用组名称" prop="groupName">
					<el-input v-model="filters.groupName" placeholder="通用组名称"></el-input>
				</el-form-item>
				<el-form-item label="通用组编码" prop="groupCode">
					<el-input v-model="filters.groupCode" placeholder="通用组编码"></el-input>
				</el-form-item>
				<el-form-item label="通用产品" prop="fittingSkuCode">
					<popwin-button popKey="POP_SKU" :selectValue="filters.fittingSkuCode" v-model="addForm.fittingSkuCode" ></popwin-button>
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
		<el-table :data="records" border :span-method="objectSpanMethod" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="groupCode" label="通用组编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="groupName" label="通用组名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="description" label="描述" width="400" >
			</el-table-column>
			<el-table-column prop="fittingSkuCode" label="通用产品编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="fittingSkuName" label="通用产品名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="modelCode" label="车型" width="200" sortable>
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
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="通用组编码" prop="groupCode">
							<el-input v-model="addForm.groupCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="通用组名称" prop="groupName">
							<el-input v-model="addForm.groupName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="描述"  prop="description">
							<el-input v-model="addForm.description" auto-complete="off"></el-input>
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
						<el-form-item label="通用组编码" prop="groupCode">
							<el-input v-model="editForm.groupCode" auto-complete="off" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="通用组名称" prop="groupName">
							<el-input v-model="editForm.groupName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="备注" prop="description">
					<el-input v-model="editForm.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getSkuGroupListPage, saveSkuGroup, removeSkuGroup} from '../../api/skuGroupApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
				filters: {
                    groupCode: '',
					groupName: '',
					fittingSkuCode:''
				},
                records: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列
                recordGroup:[],
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    groupCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    groupName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    groupCode: '',
                    groupName: '',
                    description:''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    groupCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    groupName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    groupCode: '',
                    groupName: '',
                    description:''
                },
			}
		},
		methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0||columnIndex === 1||columnIndex === 2||columnIndex === 3||columnIndex === 4||columnIndex === 8) {
                    let i = this.arrayContains(this.recordGroup,rowIndex);
                    if(i>=0&&i<this.recordGroup.length-1){
                        return {
                            rowspan: this.recordGroup[i+1]-this.recordGroup[i],
                            colspan: 1
                        };
                    }else if(i === this.recordGroup.length-1){
                        return {
                            rowspan: this.records.length-this.recordGroup[i],
                            colspan: 1
                        };
                    }else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
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
            updateRecordGroup:function () {
                let array = [];
                array.push(0);
                for(let i = 0;i<this.records.length-1;i++){
                    if(this.records[i].groupCode !== this.records[i+1].groupCode){
                        array.push(i+1);
                    }
                }
                this.recordGroup = array;
            },
            arrayContains:function (array,num) {
                for (let i = 0;i<array.length;i++) {
                    if (array[i] === num)
                        return i;
                }
                return -1;
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
                    groupName: '',
                    groupCode: '',
                    desc:''
                };
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let para = { id: row.id ,groupCode: row.groupCode};
                    removeSkuGroup(para).then((res) => {
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        this.getRecords();
                    }).catch((data) => {
                        util.errorCallBack(data,this.$router,this.$message);
                    });
                })
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            saveSkuGroup({skuGroup:JSON.stringify(para)}).then((res) => {
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
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            saveSkuGroup({skuGroup:JSON.stringify(para)}).then((res) => {
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
                getSkuGroupListPage(para).then((res) => {
					this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
					this.updateRecordGroup();
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>