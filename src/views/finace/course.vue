<template>
	<section>
		<el-tabs v-model="currentCourseType"  @tab-click="handleClick">
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
					<el-form-item label="科目名称" prop="courseName">
						<el-input v-model="filters.courseName" ></el-input>
					</el-form-item>
					<el-form-item label="科目编码" prop="courseNo">
						<el-input v-model="filters.courseNo" ></el-input>
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>
					<el-button type="primary" style="float: right" v-on:click="saveBalance">保存余额</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
				<el-row :gutter="0"  v-if="showMoreQueryCondition">
				</el-row>
				</transition>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="records" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="40">
			</el-table-column>
			<el-table-column prop="id" label="id" width="50" >
			</el-table-column>
			<el-table-column prop="courseNo" label="科目编码" width="100" sortable>
			</el-table-column>
			<el-table-column prop="courseName" label="科目名称" width="200">
			</el-table-column>
			<el-table-column prop="toGo" label="方向" width="50">
			</el-table-column>
			<el-table-column prop="type" label="类型" width="100"  :formatter="formatType">
			</el-table-column>
			<el-table-column prop="balance" label="期初余额"  width="150">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="400" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" min-width="250">
				<template slot-scope="scope">
					<el-button size="small" @click="handleAddChild(scope.$index, scope.row)">新增</el-button>
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
						<el-form-item label="父科目编码" prop="courseNo">
							<el-input v-model="addForm.parentCourseNo" :disabled="true" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="科目编码" prop="courseNo">
							<el-input v-model="addForm.courseNo" :disabled="true" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="科目名称" prop="courseName">
							<el-input v-model="addForm.courseName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="方向" prop="toGo">
							<el-select v-model="addForm.toGo" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in toGo"
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
						<el-form-item label="类型" prop="type">
							<el-select v-model="addForm.type" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in courseType"
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
						<el-form-item label="科目编码" prop="courseNo">
							<el-input v-model="editForm.courseNo" auto-complete="off" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="科目名称" prop="courseName">
							<el-input v-model="editForm.courseName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="方向" prop="toGo">
							<el-select v-model="editForm.toGo" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in toGo"
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
						<el-form-item label="类型" prop="type">
							<el-select v-model="editForm.type" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in courseType"
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
						<el-form-item label="年初余额" prop="balance">
							<el-input-number v-model="editForm.balance" :disabled="rowEditStatus" auto-complete="off"></el-input-number>
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
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getCourseListPage, saveCourse, removeCourse,saveCourseBalance,addChildCourse} from '../../api/courseApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                currentCourseType:'asset',
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
                toGo:codemaster.FI_TO_GO,
				courseType:codemaster.FI_COURSE_TYPE,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    courseName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    parentCourseNo:'',
					courseNo:'',
					courseName:'',
					toGo:'',
					type:'',
                    parentCourseNo:''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    courseName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    courseNo:'',
                    courseName:'',
					balance:'',
                    toGo:'',
                    type:''
                }
			}
		},
		computed:{
            rowEditStatus(){
                let user = JSON.parse(localStorage.getItem('user'));
                //如果当前期间当前账簿的初始区间
                if(user.currentPeriod === user.beginYear+user.period){
					return false;
				}else{
                    return true;
				}
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
            //显示编辑界面
            handleAddChild: function (index, row) {
                this.addFormVisible = true;
                this.addForm = {
                    id: 0,
                    courseNo: '',
                    courseName: '',
					parentCourseNo:row.courseNo,
					type:row.type,
					toGo:row.toGo,
                    remark:''
                };
    		},
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row.id ,areaCode: row.areaCode};
                    removeCourse(para).then((res) => {
                        this.listLoading = false;
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
                            let para = Object.assign({}, this.editForm);
                            saveCourse({course:JSON.stringify(para)}).then((res) => {
                                this.editLoading = false;
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
                            let para = Object.assign({}, this.addForm);
                            addChildCourse({fiCourse:JSON.stringify(para),courseNo:this.addForm.parentCourseNo}).then((res) => {
                                this.addLoading = false;
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
            getRecords() {
				let para = {
//					page: this.page,
//					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
                getCourseListPage(para).then((res) => {
					this.records = res.data.list;
					console.log(this.records)
					this.listLoading = false;
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
            saveBalance:function () {
                this.listLoading = true;
                let para = { courses:JSON.stringify(this.records),}
                saveCourseBalance(para).then((res) => {
                    //this.total = res.data.size;
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        getRecords();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.listLoading = false;
                }).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            }
		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>