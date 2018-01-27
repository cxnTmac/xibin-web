<template>
	<section>

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="未生成凭证" name="first"><!--工具条-->
			</el-tab-pane>
			<el-tab-pane label="已生成凭证" name="second">
			</el-tab-pane>
		</el-tabs>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="客户" prop="supplierCode">
						<popwin-button popKey="POP_CUSTOMER" :showName="true"  :selectValue="filters.supplierCode"  @changeValue="changeFilterForSupplierCode"></popwin-button>
					</el-form-item>
					<el-form-item label="订单类别" prop="inboundType">
						<el-select v-model="filters.inboundType" clearable  placeholder="请选择">
							<el-option
									v-for="item in inboundType"
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
					<el-button type="primary" style="float: right" v-on:click="getOrders">查询</el-button>
				</el-row>

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
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="lineNo" label="行号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="orderNo" label="入库单号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="supplierCode" label="客户编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="supplierName" label="客户名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="skuCode" label="产品编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="200" :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="inboundPreNum" label="预收数" width="200">
			</el-table-column>
			<el-table-column prop="inboundNum" label="实收数" width="200">
			</el-table-column>
			<el-table-column prop="inboundPrice" label="收货价格" width="200">
			</el-table-column>
			<el-table-column prop="planLoc" label="计划库位" width="200">
			</el-table-column>
			<el-table-column prop="isCreatedVoucher" label="是否已生成凭证" width="200">
			</el-table-column>
			<el-table-column prop="voucherNo" label="凭证号" width="200">
			</el-table-column>
			<el-table-column prop="remark" label="备注" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary"  @click="createVoucherHandler" :disabled="this.sels.length===0||this.activeName === 'second'">生成凭证</el-button>
		</el-col>


		<!--编辑界面-->
		<el-dialog title="生成凭证" size="tiny" v-model="pageControl.createVoucherVisible" :close-on-click-modal="false">
			<el-form :model="createCondition" label-width="80px" :rules="createFormRules" ref="createForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="选择期间" prop="period">
							<el-select v-model="createCondition.period" clearable  placeholder="请选择 ">
								<el-option
										v-for="item in periods"
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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary"  @click.native="createVoucher" :loading="pageControl.createVoucherLoading">生成</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { showAllClosedOrderInboundDetail,createVoucher} from '../../api/inboundApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                periods:[],
                pageControl:{
                    createVoucherVisible:false,
                    createVoucherLoading:false
				},
                createCondition:{
					period:''
				},
                createFormRules:[],
                activeName:'first',
                showMoreQueryCondition:false,
			    status:codemaster.WM_INBOUND_STATUS,
                inboundType:codemaster.WM_INBOUND_TYPE,
				yesorno:codemaster.SYS_YES_NO,
				filters: {
                    supplierCode:'',
					orderTimeFm:'',
					orderTimeTo:'',
					inboundType:'',
					isCreatedVoucher:''
				},
                orders: [],
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		methods: {
            handleClick(){
				this.getOrders();
			},
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
            changeFilterForSupplierCode:function(value){
              this.filters.supplierCode = value[0];
			},
            formatOrderTime: function(row, column){
                if(row.orderTime!==null) {
                    let unixTimestamp = new Date(row.orderTime)
                    return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatAuditTime: function(row, column){
                if(row.auditTime!==null){
                    let unixTimestamp = new Date(row.auditTime)
                    return util.formatDate.format(unixTimestamp,'yyyy-MM-dd hh:mm:ss');
				}
            },
            formatInboundType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_INBOUND_TYPE,row.inboundType);
            },
            formatStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_INBOUND_STATUS,row.status);
            },
            formatAuditStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.SYS_AUDIT_STATUS,row.auditStatus);
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},

            getOrders() {
                if(this.activeName === 'first'){
                    this.filters.isCreatedVoucher = 'N';
				}else if(this.activeName === 'second'){
                    this.filters.isCreatedVoucher = 'Y';
				}
				let para = {
                    conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
                showAllClosedOrderInboundDetail(para).then((res) => {

					this.orders = res.data;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            createVoucherHandler:function(){
                this.pageControl.createVoucherVisible = true;
			},
            createVoucher:function(){
                let ids = [];
                for(let i =0;i<this.sels.length;i++){
                    ids.push(this.sels[i].id);
				}
				let para={ids:ids.join(','),period:this.createCondition.period};
                this.listLoading = true;
                createVoucher(para).then((res) => {
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.listLoading = false;
                    this.getOrders();
                    //NProgress.done();
                }).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			},

		},
		computed:{
		},
		mounted() {
            let date=new Date;
            let year=date.getFullYear();
            let mounth = date.getMonth();
            let results = [];
            results[0] = {code:year - 1+'12',name:year - 1+'年第12期'};
            results[1] = {code:year +'01',name:year+'年第01期'};
            results[2] = {code:year +'02',name:year+'年第02期'};
            results[3] = {code:year +'03',name:year+'年第03期'};
            results[4] = {code:year +'04',name:year+'年第04期'};
            results[5]= {code:year +'05',name:year+'年第05期'};
            results[6]= {code:year +'06',name:year+'年第06期'};
            results[7]= {code:year +'07',name:year+'年第07期'};
            results[8]= {code:year +'08',name:year+'年第08期'};
            results[9]= {code:year +'09',name:year+'年第09期'};
            results[10]= {code:year +'10',name:year+'年第10期'};
            results[11]= {code:year +'11',name:year+'年第11期'};
            results[12]= {code:year +'12',name:year+'年第12期'};
            this.periods = results;
            this.createCondition.period = this.periods[mounth].code;
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>