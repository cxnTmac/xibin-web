<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
				<el-form-item label="库位编码" prop="locCode">
					<el-input v-model="filters.locCode" placeholder="库位编码"></el-input>
				</el-form-item>
				<el-form-item label="所属库区" prop="zoneCode">
					<popwin-button popKey="POP_ZONE"  :selectValue="filters.zoneCode"  @changeValue="changeFilterForZoneCode"></popwin-button>
				</el-form-item>
				<el-form-item label="库位使用类型" prop="useType">
					<el-select v-model="filters.useType" clearable  placeholder="请选择">
						<el-option
								v-for="item in useType"
								:key="item.code"
								:label="item.name"
								:value="item.code">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
						</el-option>
					</el-select>
					<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
				</el-form-item>
				<el-button type="primary" icon="caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
				<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
				<el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>
				</el-row>
				<el-row :gutter="0" v-if="showMoreQueryCondition">
					<el-form-item label="库位类型" prop="locType">
						<el-select v-model="filters.locType" clearable  placeholder="请选择">
							<el-option
									v-for="item in locType"
									:key="item.code"
									:label="item.name"
									:value="item.code">
								<span style="float: left">{{ item.name }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
							</el-option>
						</el-select>
						<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
					</el-form-item>
				</el-row>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="records" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="zoneCode" label="所属库区编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="zoneName" label="所属库区名称" width="200" >
			</el-table-column>
			<el-table-column prop="locCode" label="库区编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="locType" label="库位类型" width="200" :formatter="formatLocType">
			</el-table-column>
			<el-table-column prop="useType" label="库位使用类型" width="200" :formatter="formatUseType">
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
						<el-form-item label="库位编码" prop="locCode">
							<el-input v-model="addForm.locCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="所属库区" prop="zoneCode">
							<popwin-button popKey="POP_ZONE" :selectValue="addForm.zoneCode" @changeValue="changeAddPopValueForZoneCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="库位类型" prop="locType">
							<el-select v-model="addForm.locType" placeholder="请选择">
								<el-option
										v-for="item in locType"
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
						<el-form-item label="库位使用类型" prop="locType">
							<el-select v-model="addForm.useType" placeholder="请选择">
								<el-option
										v-for="item in useType"
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
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
				</el-form-item>
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
						<el-form-item label="库位编码" prop="locCode">
							<el-input v-model="editForm.locCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="所属库区" prop="zoneCode">
							<popwin-button popKey="POP_ZONE" :selectValue="editForm.zoneCode" @changeValue="changeEditPopValueForZoneCode"></popwin-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="库位类型" prop="locType">
							<el-select v-model="editForm.locType" placeholder="请选择">
								<el-option
										v-for="item in locType"
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
						<el-form-item label="库位使用类型" prop="locType">
							<el-select v-model="editForm.useType" placeholder="请选择">
								<el-option
										v-for="item in useType"
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
						<el-form-item label="备注">
							<el-input v-model="editForm.remark" auto-complete="off"></el-input>
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
	import { getLocListPage, saveLoc, removeLoc} from '../../api/locApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
                locType:codemaster.WM_LOC_TYPE,
				useType:codemaster.WM_USE_TYPE,
				filters: {
                    locCode: '',
                    locType: '',
					useType: '',
					zondeCode:''
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
                    locCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    locType:[
                        { required: true, message: '请输入库位类型', trigger: 'blur' }
                    ],
                    useType:[
                        { required: true, message: '请输入库位使用类型', trigger: 'blur' }
                    ],
                    zoneCode:[
                        { required: true, message: '请选择所属库区', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    id: 0,
                    locCode: '',
                    zoneCode: '',
                    locType: '',
                    useType: '',
                    remark: ''
                },




                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    locCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    locType:[
                        { required: true, message: '请输入库位类型', trigger: 'blur' }
                    ],
                    useType:[
                        { required: true, message: '请输入库位使用类型', trigger: 'blur' }
                    ],
                    zoneCode:[
                        { required: true, message: '请选择所属库区', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    locCode: '',
                    zoneCode: '',
                    locType: '',
                    useType: '',
                    remark: ''
                },
			}
		},
		methods: {
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
            changeFilterForZoneCode:function(value){
                this.filters.zoneCode = value[0];
			},
            changeAddPopValueForZoneCode:function(value){
                this.addForm.zoneCode = value[0];
            },
            changeEditPopValueForZoneCode:function(value){
                this.editForm.zoneCode = value[0];
            },
            formatUseType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_USE_TYPE,row.useType);
            },
            formatLocType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_LOC_TYPE,row.locType);
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
                    locCode: '',
                    zoneCode: '',
                    locType: '',
                    useType: '',
                    remark: ''
                };
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    NProgress.start();
                    let para = { id: row.id ,locCode: row.locCode};
                    removeLoc(para).then((res) => {
                        this.listLoading = false;
                        NProgress.done();
                        this.getRecords();
                    }).catch((data) => {
                        this.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });;
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
                            saveLoc({loc:JSON.stringify(para)}).then((res) => {
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
                            saveLoc({loc:JSON.stringify(para)}).then((res) => {
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
                getLocListPage(para).then((res) => {
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