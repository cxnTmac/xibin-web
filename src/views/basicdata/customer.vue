<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="客户编码" prop="customerCode">
						<el-input v-model="filters.customerCode" placeholder="客户编码"></el-input>
					</el-form-item>
					<el-form-item label="客户名称" prop="customerName">
						<el-input v-model="filters.customerName" placeholder="客户名称"></el-input>
					</el-form-item>
					<el-button type="primary" icon="caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>
				</el-row>
				<el-row :gutter="0" v-if="showMoreQueryCondition">
				</el-row>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="records" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="customerCode" label="客户编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="customerName" label="客户名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="200" sortable>
			</el-table-column>
			<el-table-column prop="province" label="省" width="200" sortable>
			</el-table-column>
			<el-table-column prop="city" label="市" width="200" sortable>
			</el-table-column>
			<el-table-column prop="county" label="区/县" width="200" sortable>
			</el-table-column>
			<el-table-column prop="customerType" label="客户类型" width="200" >
			</el-table-column>
			<el-table-column prop="customerAddress" label="详细地址" width="200" >
			</el-table-column>
			<el-table-column prop="customerEmail" label="邮箱" width="200" >
			</el-table-column>
			<el-table-column prop="contactName" label="联系人姓名" width="200" >
			</el-table-column>
			<el-table-column prop="contactTel" label="联系人电话" width="200" >
			</el-table-column>
			<el-table-column prop="contactEmail" label="联系人邮箱" width="200" >
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="400" >
			</el-table-column>

			<el-table-column label="操作" fixed="right" min-width="150">
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

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户编码" prop="customerCode">
							<el-input v-model="addForm.customerCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="addForm.customerName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="电话" prop="customerTel">
							<el-input v-model="addForm.customerTel" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="E-mail" prop="customerEmail">
							<el-input v-model="addForm.customerEmail" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="客户类别" prop="customerType">
							<el-checkbox-group v-model="addForm.customerType">
								<el-checkbox-button label="供应商" name="customerType"></el-checkbox-button>
								<el-checkbox-button label="销售客户" name="customerType"></el-checkbox-button>
								<el-checkbox-button label="经销商" name="customerType"></el-checkbox-button>
								<el-checkbox-button label="修理厂" name="customerType"></el-checkbox-button>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="10">
						<el-form-item label="省市区" prop="remark">
							<el-cascader
									:options="options"
									v-model="selectedAddFormLocationOptions"
									@change="handleAddFormLocationChange">
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item label="地址" prop="customerAddress">
							<el-input v-model="addForm.customerAddress" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="联系人名称" prop="contactName">
							<el-input v-model="addForm.contactName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="联系人电话" prop="contactTel">
							<el-input v-model="addForm.contactTel" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人E-mail" prop="contactEmail">
							<el-input v-model="addForm.contactEmail" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="addForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!--<el-input v-model="addForm.customerType" auto-complete="off"></el-input>-->
				<!--<el-input type="hidden" v-model="addForm.province" auto-complete="off"></el-input>-->
				<!--<el-input type="hidden" v-model="addForm.city" auto-complete="off"></el-input>-->
				<!--<el-input type="hidden" v-model="addForm.county" auto-complete="off"></el-input>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="客户编码" prop="customerCode">
							<el-input v-model="editForm.customerCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="editForm.customerName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="电话" prop="customerTel">
							<el-input v-model="editForm.customerTel" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="E-mail" prop="customerEmail">
							<el-input v-model="editForm.customerEmail" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="客户类别" prop="customerType">
							<el-checkbox-group v-model="editForm.customerType">
								<el-checkbox-button label="供应商" name="customerType"></el-checkbox-button>
								<el-checkbox-button label="销售客户" name="customerType"></el-checkbox-button>
								<el-checkbox-button label="经销商" name="customerType"></el-checkbox-button>
								<el-checkbox-button label="修理厂" name="customerType"></el-checkbox-button>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="10">
						<el-form-item label="省市区" prop="remark">
							<el-cascader
									:options="options"
									v-model="selectedEditFormLocationOptions"
									@change="handleAddFormLocationChange">
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item label="地址" prop="customerAddress">
							<el-input v-model="editForm.customerAddress" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="联系人名称" prop="contactName">
							<el-input v-model="editForm.contactName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="联系人电话" prop="contactAddress">
							<el-input v-model="editForm.contactTel" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人E-mail" prop="customerEmail">
							<el-input v-model="editForm.contactEmail" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="editForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<!--<el-input type="hidden" v-model="editForm.province" auto-complete="off"></el-input>-->
				<!--<el-input type="hidden" v-model="editForm.city" auto-complete="off"></el-input>-->
				<!--<el-input type="hidden" v-model="editForm.county" auto-complete="off"></el-input>-->
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
	import { getCustomerListPage, saveCustomer, removeCustomer} from '../../api/customerApi';
    import NProgress from 'nprogress'
    import { regionData ,CodeToText ,TextToCode} from 'element-china-area-data'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
                options: regionData,
                selectedAddFormLocationOptions: [],
                selectedEditFormLocationOptions: [],
				filters: {
                    customerCode: '',
                    customerName: '',
					customerType: '',
					status:'',
					province:'',
					city:'',
					county:''
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
                    customerCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' },
                        {
                            min: 2,
                            max: 18,
                            message: '长度在 2 到 10 个字符'
                        }
                    ],
                    customerName:[
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        {
                            min: 2,
                            max: 16,
                            message: '长度在 2 到 16 个字符'
                        }
                    ],
                    customerEmail:[
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
					],
                    contactEmail:[
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
                    ],
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    customerCode: '',
                    customerName: '',
                    customerType: [],
                    status:'',
                    province:'',
                    city:'',
                    county:'',
                    customerTel:'',
                    customerAddress:'',
                    customerEmail:'',
					contactName:'',
					contactEmail:'',
					contactTel:'',
					remark:''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    customerCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    customerName:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    customerCode: '',
                    customerName: '',
                    customerType: [],
                    status:'',
                    province:'',
                    city:'',
                    county:'',
                    customerTel:'',
                    customerAddress:'',
                    customerEmail:'',
                    contactName:'',
                    contactEmail:'',
                    contactTel:'',
                    remark:''
                },
			}
		},
        watch: {
            selectedAddFormLocationOptions: function (val) {
                if(val!== null&&val!==''&&val.length>=3){
                    this.addForm.province = CodeToText[val[0]];
                    this.addForm.city = CodeToText[val[1]];
                    this.addForm.county = CodeToText[val[2]];
                }else{
                    this.addForm.province = '';
                    this.addForm.city = '';
                    this.addForm.county = '';
				}
            },
            selectedEditFormLocationOptions: function (val) {
                if(val!== null&&val!==''&&val.length>=3){
                    this.editForm.province = CodeToText[val[0]];
                    this.editForm.city = CodeToText[val[1]];
                    this.editForm.county = CodeToText[val[2]];
                }else{
                    this.editForm.province = '';
                    this.editForm.city = '';
                    this.editForm.county = '';
                }
            }
        },
		methods: {
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
            handleAddFormLocationChange(val){
                console.log(val)
			},
            handleEditFormLocationChange(val){
                console.log(val)
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getRecords();
			},
            //显示编辑界面
            handleEdit: function (index, row) {
                
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.editForm.customerType = row.customerType.split(',')

                this.selectedEditFormLocationOptions = [TextToCode[this.editForm.province].code,TextToCode[this.editForm.province][this.editForm.city].code,TextToCode[this.editForm.province][this.editForm.city][this.editForm.county].code]
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.selectedAddFormLocationOptions = [],
                this.addForm = {
                    id: 0,
                    customerCode: '',
                    customerName: '',
                    customerType: [],
                    status:'',
                    province:'',
                    city:'',
                    county:'',
                    customerTel:'',
                    customerAddress:'',
                    customerEmail:'',
                    contactName:'',
                    contactEmail:'',
                    contactTel:'',
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
                    let para = { id: row.id ,customerCode: row.customerCode};
                    removeCustomer(para).then((res) => {
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
                            para.customerType = util.arrayToString(this.editForm.customerType);
                            saveCustomer({customer:JSON.stringify(para)}).then((res) => {
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
                            para.customerType = util.arrayToString(this.addForm.customerType);
                            saveCustomer({customer:JSON.stringify(para)}).then((res) => {
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
                getCustomerListPage(para).then((res) => {
                    
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