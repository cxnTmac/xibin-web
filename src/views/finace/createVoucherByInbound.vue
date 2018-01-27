<template>
	<section>

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="未生成购货凭证" name="first"><!--工具条-->
			</el-tab-pane>
			<el-tab-pane label="已生成购货凭证" name="second">
			</el-tab-pane>
			<el-tab-pane label="未生成退货凭证" name="third"><!--工具条-->
			</el-tab-pane>
			<el-tab-pane label="已生成退货凭证" name="fouth">
			</el-tab-pane>
			<el-tab-pane label="未生成盘盈凭证" name="fifth"><!--工具条-->
			</el-tab-pane>
			<el-tab-pane label="已生成盘盈凭证" name="sixth">
			</el-tab-pane>
		</el-tabs>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="客户" prop="supplierCode">
						<popwin-button popKey="POP_CUSTOMER" :showName="true" :selectValue="filters.supplierCode"  @changeValue="changeFilterForSupplierCode"></popwin-button>
					</el-form-item>
					<el-form-item label="订单类别" prop="inboundType">
						<el-select v-model="filters.inboundType" :disabled="true" clearable  placeholder="请选择">
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
					<el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
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
		<el-table :data="orders" border  :span-method="objectSpanMethod" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="orderNo" label="入库单号" width="200" >
			</el-table-column>
			<el-table-column prop="headerStatus" label="单头状态" width="200" :formatter="formatHeaderStatus">
			</el-table-column>
			<el-table-column prop="supplierCode" label="客户编码" width="200" >
			</el-table-column>
			<el-table-column prop="supplierName" label="客户名称" width="200" >
			</el-table-column>
			<el-table-column prop="lineNo" label="行号" width="100" >
			</el-table-column>
			<el-table-column prop="skuCode" label="产品编码" width="200" >
			</el-table-column>
			<el-table-column prop="status" label="明细状态" width="200" :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="inboundPreNum" label="预收数" width="200">
			</el-table-column>
			<el-table-column prop="inboundNum" label="实收数" width="200">
			</el-table-column>
			<el-table-column prop="inboundPrice" label="收货价格" width="200">
			</el-table-column>
			<el-table-column prop="planLoc" label="计划库位" width="200">
			</el-table-column>
			<!--<el-table-column prop="isCreatedVoucher" label="是否已生成凭证" width="200">-->
			<!--</el-table-column>-->
			<!--<el-table-column prop="voucherNo" label="凭证号" width="200">-->
			<!--</el-table-column>-->
			<el-table-column prop="remark" label="备注" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary"  @click="account" :loading="pageControl.btnAccountLoading" :disabled="this.sels.length===0||this.activeName === 'second'">生成凭证</el-button>
		</el-col>



	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { showAllClosedOrderInboundDetail,createVoucher,accountByOrderNos} from '../../api/inboundApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                pageControl:{
                    btnAccountLoading:false
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
                    headerStatus:'',
					inboundType:''
				},
                orders: [],
                orderGroup:[],
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 1||columnIndex === 0||columnIndex === 2||columnIndex === 3||columnIndex === 4) {
                    let i = this.arrayContains(this.orderGroup,rowIndex);
                    if(i>=0&&i<this.orderGroup.length-1){
                        return {
                            rowspan: this.orderGroup[i+1]-this.orderGroup[i],
                            colspan: 1
                        };
                    }else if(i === this.orderGroup.length-1){
                        return {
                            rowspan: this.orders.length-this.orderGroup[i],
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
            arrayContains:function (array,num) {
                for (let i = 0;i<array.length;i++) {
                    if (array[i] === num)
                        return i;
                }
                return -1;
            },
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
            formatHeaderStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_INBOUND_STATUS,row.headerStatus);
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
            updateInboundGroup:function () {
                let array = [];
                array.push(0);
                for(let i = 0;i<this.orders.length-1;i++){
                    if(this.orders[i].orderNo !== this.orders[i+1].orderNo){
                        array.push(i+1);
                    }
                }
                this.orderGroup = array;
            },
            getOrders() {
                if(this.activeName === 'first'){
                    this.filters.inboundType = 'CI';
                    this.filters.headerStatus = '99';
				}else if(this.activeName === 'second'){
                    this.filters.inboundType = 'CI';
                    this.filters.headerStatus = '30';
				}else if(this.activeName === 'third'){
                    this.filters.inboundType = 'RI';
                    this.filters.headerStatus = '99';
                }else if(this.activeName === 'fouth'){
                    this.filters.inboundType = 'RI';
                    this.filters.headerStatus = '30';
                }else if(this.activeName === 'fifth'){
                    this.filters.inboundType = 'PI';
                    this.filters.headerStatus = '99';
                }else if(this.activeName === 'sixth'){
                    this.filters.inboundType = 'PI';
                    this.filters.headerStatus = '30';
                }
				let para = {
                    conditions:JSON.stringify(this.filters)
				};


				this.listLoading = true;
				//NProgress.start();
                showAllClosedOrderInboundDetail(para).then((res) => {

					this.orders = res.data;
					this.listLoading = false;
                    this.updateInboundGroup();
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
            account:function () {
                this.pageControl.btnAccountLoading = true;
                let orderNos = [];
                for(let i = 0;i<this.sels.length;i++){
                    var flag = true;
                    for(let j = 0;j<orderNos.length;j++){
                        if(orderNos[j] === this.sels[i].orderNo){
                            flag = false;
						}
					}
                    if(flag){
                        orderNos.push(this.sels[i].orderNo);
					}
				}
                let para = { orderNos:orderNos.join(',')};
                accountByOrderNos(para).then((res) => {
                    this.pageControl.btnAccountLoading = false;
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.data.msgs);
                    }
                }).catch((data) => {
                    this.pageControl.btnAccountLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            }
		},
		computed:{
		},
		mounted() {
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>