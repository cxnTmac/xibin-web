<template>
	<section>
		<div v-title data-title="组装单"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
				<el-form-item label="订单号" prop="orderNo">
					<el-input v-model="filters.orderNo" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="filters.status" clearable  placeholder="请选择 ">
						<el-option
								v-for="item in status"
								:key="item.code"
								:label="item.name"
								:value="item.code">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
						</el-option>
					</el-select>
					<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
				</el-form-item>
					<el-form-item label="加工类别" prop="assembleType">
						<el-select v-model="filters.assembleType" clearable  placeholder="请选择">
							<el-option
									v-for="item in assembleType"
									:key="item.code"
									:label="item.name"
									:value="item.code">
								<span style="float: left">{{ item.name }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
							</el-option>
						</el-select>
						<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getOrders">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
				<el-row :gutter="0" v-if="showMoreQueryCondition">

					<el-form-item label="订单时间从" prop="orderTimeFm">
						<el-date-picker
								v-model="filters.orderTimeFm"
								type="datetime"
								 
								placeholder="选择日期时间">
						</el-date-picker>
						<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
					</el-form-item>
					<el-form-item label="订单时间到" prop="orderTimeTo">
						<el-date-picker
								v-model="filters.orderTimeTo"
								type="datetime"
								 
								placeholder="选择日期时间">
						</el-date-picker>
						<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
					</el-form-item>
				</el-row>
				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="orderNo" label="加工单号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="200" sortable :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="auditStatus" label="审核状态" width="200" sortable :formatter="formatAuditStatus">
			</el-table-column>
			<el-table-column prop="assembleType" label="加工类型" width="200" sortable :formatter="formatAssembleType">
			</el-table-column>
			<el-table-column prop="auditDate" label="审核时间" width="200" sortable :formatter="formatAuditTime">
			</el-table-column>
			<el-table-column prop="orderTime" label="订单时间" width="200" sortable :formatter="formatOrderTime">
			</el-table-column>
			<el-table-column prop="remark" label="备注" >
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


	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
    import { getAssembleOrderListPage, remove} from '../../api/assembleApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
			    status:codemaster.WM_ASSEMBLE_STATUS,
                assembleType:codemaster.WM_ASSEMBLE_TYPE,
				filters: {
                    orderNo: '',
                    status:'',
					orderTimeFm:'',
					orderTimeTo:'',
					assembleType:''
				},
                orders: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列
			}
		},
		methods: {
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },

            formatOrderTime: function(row, column){
                if(row.orderTime!==null) {
                    let unixTimestamp = new Date(row.orderTime)
                    return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatAuditTime: function(row, column){
                if(row.auditDate!==null){
                    let unixTimestamp = new Date(row.auditDate)
                    return util.formatDate.format(unixTimestamp,'yyyy-MM-dd hh:mm:ss');
				}
            },
            formatAssembleType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_ASSEMBLE_TYPE,row.assembleType);
            },
            formatStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_ASSEMBLE_STATUS,row.status);
            },
            formatAuditStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.SYS_AUDIT_STATUS,row.auditStatus);
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
            //显示新增界面
            handleAdd: function () {
                this.$store.commit('changeAssembleOrderNo', '')
                this.$store.commit('changeAssembleStatus', 'ADD')
                this.$router.push({ path: '/assembleDetail' })
            },
            handleEdit:function(index,row){
                this.$store.commit('changeAssembleOrderNo', row.orderNo)
                this.$store.commit('changeAssembleStatus', 'EDIT')
                this.$router.push({ path: '/assembleDetail' })
			},
			//获取用户列表
            getOrders() {

				let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
                getAssembleOrderListPage(para).then((res) => {
					this.total = res.data.size;
					this.orders = res.data.list;
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
					let para = {orderNos:[row.orderNo].join(',')};
                    remove(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.getOrders();
                        }else{
                            this.$message.error(res.data.msg);
                        }

					}).catch((data) => {
                        this.listLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
				})
			},
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>