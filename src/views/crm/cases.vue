<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
				<el-form-item label="学生编码" prop="stuNum">
					<el-input v-model="filters.stuNum" placeholder="学生编码"></el-input>
				</el-form-item>
				<el-form-item label="中文名" prop="areaCode">
					<el-input v-model="filters.nameCn" placeholder="中文名"></el-input>
				</el-form-item>
				<el-form-item label="英文名" prop="areaCode">
					<el-input v-model="filters.nameEn" placeholder="英文名"></el-input>
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
		<el-table :data="records" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" >
			</el-table-column>
			<el-table-column prop="nameCn" label="中文名" width="200" >
			</el-table-column>
			<el-table-column prop="nameEn" label="英文名" width="200" >
			</el-table-column>
			<el-table-column prop="stuNum" label="学生编码" width="200" >
			</el-table-column>
			<el-table-column prop="oldStuNum" label="旧学生编码" width="200" >
			</el-table-column>
			<el-table-column prop="caseTime" label="个案时间" width="200" :formatter="formatCaseTime">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="200" >
			</el-table-column>
			<el-table-column prop="visa" label="签证" width="200" >
			</el-table-column>
			<el-table-column prop="country" label="国家" width="200" >
			</el-table-column>
			<el-table-column prop="inChargeOfCase" label="个案负责人" width="200" >
			</el-table-column>
			<el-table-column prop="inChargeOfVisa" label="签证负责人" width="200" >
			</el-table-column>
			<el-table-column prop="enrolmentTime" label="入学时间" width="200" :formatter="formatEnrolmentTime">
			</el-table-column>
			<el-table-column prop="tutition" label="学费" width="200" >
			</el-table-column>
			<el-table-column prop="commissionRate" label="佣金比例" width="200" >
			</el-table-column>
			<el-table-column prop="commissionType" label="佣金支付方式" width="200" >
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="中文名" prop="nameCn">
							<el-input v-model="addForm.nameCn" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="英文名" prop="nameEn">
							<el-input v-model="addForm.nameEn" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="学生编码" prop="stuNum">
							<el-input v-model="addForm.stuNum" auto-complete="off" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="旧学生编码" prop="oldStuNum">
							<el-input v-model="addForm.oldStuNum" auto-complete="off" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="时间" prop="caseTime">
							<el-date-picker
									v-model="addForm.caseTime"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="addForm.status" :disabled="true" placeholder="请选择">
								<el-option
										v-for="item in caseStatus"
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
						<el-form-item label="签证" prop="visa">
							<el-select v-model="addForm.visa" :disabled="false" placeholder="请选择">
								<el-option
										v-for="item in visaStatus"
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
						<el-form-item label="国家" prop="country">
							<el-select v-model="addForm.country" filterable :disabled="false" placeholder="请选择">
								<el-option
										v-for="item in countries"
										:key="item.name"
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
						<el-form-item label="个案负责人" prop="inChargeOfCase">
							<el-input v-model="addForm.inChargeOfCase" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="签证负责人" prop="inChargeOfVisa">
							<el-input v-model="addForm.inChargeOfVisa" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="学费" prop="tutition">
							<el-input placeholder="请输入学费" v-model="addForm.tutition">
								<template slot="prepend">$</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="入学时间" prop="enrolmentTime">
							<el-date-picker
									v-model="addForm.enrolmentTime"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="佣金比例" prop="commissionRate">
							<el-input placeholder="请输入比例" v-model="addForm.commissionRate">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="佣金支付方式" prop="commissionType">
							<el-select v-model="addForm.commissionType" filterable :disabled="false" placeholder="请选择">
								<el-option
										v-for="item in commissionType"
										:key="item.name"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
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
						<el-form-item label="中文名" prop="nameCn">
							<el-input v-model="editForm.nameCn" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="英文名" prop="nameEn">
							<el-input v-model="editForm.nameEn" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="学生编码" prop="stuNum">
							<el-input v-model="editForm.stuNum" :disabled="true" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="旧学生编码" prop="oldStuNum">
							<el-input v-model="editForm.oldStuNum" :disabled="true" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="时间" prop="caseTime">
							<el-date-picker
									v-model="editForm.caseTime"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="editForm.status"  placeholder="请选择">
								<el-option
										v-for="item in caseStatus"
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
						<el-form-item label="签证" prop="visa">
							<el-select v-model="editForm.visa" :disabled="false" placeholder="请选择">
								<el-option
										v-for="item in visaStatus"
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
						<el-form-item label="国家" prop="country">
							<el-select v-model="editForm.country" filterable :disabled="false" placeholder="请选择">
								<el-option
										v-for="item in countries"
										:key="item.name"
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
						<el-form-item label="个案负责人" prop="inChargeOfCase">
							<el-input v-model="editForm.inChargeOfCase" auto-complete="off"></el-input>

						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="签证负责人" prop="inChargeOfVisa">
							<el-input v-model="editForm.inChargeOfVisa" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="学费" prop="tutition">
							<el-input placeholder="请输入学费" v-model="editForm.tutition">
								<template slot="prepend">$</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="入学时间" prop="enrolmentTime">
							<el-date-picker
									v-model="editForm.enrolmentTime"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="佣金比例" prop="commissionRate">
							<el-input placeholder="请输入比例" v-model="editForm.commissionRate">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="佣金支付方式" prop="commissionType">
							<el-select v-model="editForm.commissionType" filterable :disabled="false" placeholder="请选择">
								<el-option
										v-for="item in commissionType"
										:key="item.name"
										:label="item.name"
										:value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
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
	//import NProgress from 'nprogress'
	import { getCaseListPage, saveCase, removeCase} from '../../api/caseApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
    var countries = require('../../../static/country.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
				filters: {
                    nameCn: '',
					nameEn: '',
                    stuNum: ''
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
                    nameCn: [
                        { required: true, message: '中文名', trigger: 'blur' }
                    ],
                    nameEn:[
                        { required: true, message: '英文名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    nameCn: '',
                    nameEn: '',
                    stuNum: '',
                    oldStuNum:'',
                    caseTime:'',
                    status:'GONE',
                    visa:'',
                    country:'',
                    inChargeOfCase:'',
                    inChargeOfVisa:'',
                    tutition:'',
                    enrolmentTime:'',
                    commissionRate:'',
                    commissionType:''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    nameCn: [
                        { required: true, message: '中文名', trigger: 'blur' }
                    ],
                    nameEn:[
                        { required: true, message: '英文名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    nameCn: '',
                    nameEn: '',
                    stuNum: '',
                    oldStuNum:'',
                    caseTime:'',
                    status:'',
                    visa:'',
                    country:'',
                    inChargeOfCase:'',
                    inChargeOfVisa:'',
                    tutition:'',
                    enrolmentTime:'',
                    commissionRate:'',
                    commissionType:''
                },
                caseStatus:codemaster.CRM_CASE_STATUS,
                visaStatus:codemaster.CRM_VISA_STATUS,
                countries:countries,
				commissionType:codemaster.CRM_COMMISSION_RATE_TYPE
			}
		},
		methods: {
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            formatCaseTime: function(row, column){
                if(row.auditTime!==null){
                    let unixTimestamp = new Date(row.caseTime)
                    return util.formatDate.format(unixTimestamp,'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatEnrolmentTime: function(row, column){
                if(row.auditTime!==null){
                    let unixTimestamp = new Date(row.enrolmentTime)
                    return util.formatDate.format(unixTimestamp,'yyyy-MM-dd hh:mm:ss');
                }
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
                    nameCn: '',
                    nameEn: '',
                    stuNum: '',
                    oldStuNum:'',
                    caseTime:'',
                    status:'GONE',
                    visa:'',
                    country:'',
                    inChargeOfCase:'',
                    inChargeOfVisa:'',
                    tutition:'',
                    enrolmentTime:'',
                    commissionRate:'',
                    commissionType:''
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
                    let para = { id: row.id ,areaCode: row.areaCode};
                    removeCase(para).then((res) => {
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
                            saveCase({case:JSON.stringify(para)}).then((res) => {
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
                            saveCase({case:JSON.stringify(para)}).then((res) => {
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
                getCaseListPage(para).then((res) => {
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
			}
		},
		mounted() {
			this.getRecords();
		}
	}

</script>

<style scoped>

</style>