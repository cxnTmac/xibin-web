<template>
	<section>
		<el-tabs v-model="courseType" @tab-click="handleClick">
			<el-tab-pane label="资产" name="asset">
			</el-tab-pane>
			<el-tab-pane label="负债" name="liability">
			</el-tab-pane>
			<el-tab-pane label="共同" name="together">
			</el-tab-pane>
			<el-tab-pane label="权益" name="equity">
			</el-tab-pane>
			<el-tab-pane label="成本" name="cost">
			</el-tab-pane>
			<el-tab-pane label="损益" name="incomeAndLoss">
			</el-tab-pane>
		</el-tabs>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="科目名称" prop="areaName">
						<el-input v-model="filters.courseName" ></el-input>
					</el-form-item>
					<el-form-item label="科目编码" prop="areaName">
						<el-input v-model="filters.courseNo" ></el-input>
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
			<el-table-column prop="courseNo" label="科目编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="courseName" label="科目名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="type" label="类型" width="200"  :formatter="formatType">
			</el-table-column>
			<el-table-column prop="balance" label="期初余额" width="200"  >
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="400" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<!--<el-col :span="24" class="toolbar">-->
			<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
			<!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">-->
			<!--</el-pagination>-->
		<!--</el-col>-->

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="区域编码" prop="areaCode">
							<el-input v-model="addForm.areaCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="区域名称" prop="areaName">
							<el-input v-model="addForm.areaName" auto-complete="off"></el-input>
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
						<el-form-item label="区域编码" prop="areaCode">
							<el-input v-model="editForm.areaCode" auto-complete="off" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="区域名称" prop="areaName">
							<el-input v-model="editForm.areaName" auto-complete="off"></el-input>
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

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getCourseListPage, saveCourse, removeCourse} from '../../api/courseApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                courseType:'asset',
                showMoreQueryCondition:false,
				filters: {
					types: [7,8],
					courseName:'',
					courseNo:''
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
                    areaCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    areaName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    areaName: '',
                    areaCode: '',
                    remark:''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    areaCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    areaName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    areaName: '',
                    areaCode: '',
                    remark:''
                },
			}
		},
		methods: {
            handleClick(){
                if(this.courseType === 'asset') {
                    this.filters.types =[7,8];
                }else if(this.courseType === 'liability'){
                    this.filters.types =[9,10];
				}else if(this.courseType === 'together'){
                    this.filters.types =[11];
				}else if(this.courseType === 'equity'){
                    this.filters.types =[12];
				}else if(this.courseType === 'cost'){
                    this.filters.types =[13];
                }else if(this.courseType === 'incomeAndLoss'){
                    this.filters.types =[14,15,16,17,18,19,20];
                }
                this.getRecords();
            },
            formatType: function (row, column) {
                return util.getComboNameByValue(codemaster.FI_COURSE_TYPE,row.type);
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
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    NProgress.start();
                    let para = { id: row.id ,areaCode: row.areaCode};
                    removeCourse(para).then((res) => {
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
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            saveCourse({area:JSON.stringify(para)}).then((res) => {
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
                            saveCourse({area:JSON.stringify(para)}).then((res) => {
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
//					page: this.page,
//					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                getCourseListPage(para).then((res) => {
					//this.total = res.data.size;
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
			//批量删除
			batchRemove: function () {
//				var ids = this.sels.map(item => item.id).join(",");
//				var fittingTypeCodes = this.sels.map(item => item.fittingTypeCode).join(",");
//				this.$confirm('确认删除选中记录吗？', '提示', {
//					type: 'warning'
//				}).then(() => {
//					this.listLoading = true;
//					//NProgress.start();
//					let para = { ids: ids ,fittingTypeCodes:fittingTypeCodes};
//                    batchRemoveFittingType(para).then((res) => {
//						this.listLoading = false;
//                        if(res.data.code == 200){
//                            this.$message({
//                                message: res.data.msg,
//                                type: 'success'
//                            });
//                        }else{
//                            this.$message.error(res.data.msg);
//                        }
//
//						this.getFittingTypes();
//					});
//				}).catch(() => {
//
//				});
			}
		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>