<template>
	<section>
		<div v-title data-title="库存记录查询"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
                <el-row :gutter="0">
				<el-form-item label="订单号" prop="orderNo">
					<el-input v-model="filters.orderNo" placeholder="订单号"></el-input>
				</el-form-item>
                <el-form-item label="记录类型" prop="tranType">
                    <el-select v-model="filters.tranType"  placeholder="请选择">
                        <el-option
                                v-for="item in tranType"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
                </el-form-item>
                <el-form-item label="单据类型" prop="orderType">
                    <el-select v-model="filters.orderType"  placeholder="请选择">
                        <el-option
                                v-for="item in orderType"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
                </el-form-item>

                        <el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandeler"></el-button>
                        <el-button type="danger" style="float: right"  @click="reset">重置</el-button>
                        <el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>


                </el-row>
				<transition name="el-zoom-in-top">
                <el-row :gutter="0" v-if="showMoreQueryCondition">
                <el-form-item label="记录时间从" prop="tranTimeFm">
                    <el-date-picker
                            v-model="filters.tranTimeFm"
                            type="datetime"
							 
                            placeholder="选择日期时间">
                    </el-date-picker>
                    <!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
                </el-form-item>
                <el-form-item label="记录时间到" prop="tranTimeTo">
                    <el-date-picker
                            v-model="filters.tranTimeTo"
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
		<el-table :data="records" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!--<el-table-column prop="id" label="id" width="80" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="tranId" label="记录ID" width="200" sortable>
			</el-table-column>
			<el-table-column prop="tranType" label="记录类型" width="200" :formatter="formatTranType" sortable>
			</el-table-column>
			<el-table-column prop="orderType" label="订单类型" width="200" :formatter="formatOrderType"  sortable>
			</el-table-column>
			<el-table-column prop="orderNo" label="订单号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="lineNo" label="行号" width="200" >
			</el-table-column>
			<el-table-column prop="taskId" label="任务ID" width="200"  >
			</el-table-column>
			<el-table-column prop="taskLineNo" label="任务行号" width="200" >
			</el-table-column>
			<el-table-column prop="tranOp" label="操作人" width="200" >
			</el-table-column>
			<el-table-column prop="tranTime" label="操作时间" width="200" :formatter="formatTranTime" sortable>
			</el-table-column>
			<el-table-column prop="fmSku" label="源产品" width="200" >
			</el-table-column>
			<el-table-column prop="fmLoc" label="源库位" width="200" >
			</el-table-column>
			<el-table-column prop="fmQtyOp" label="源操作数" width="200" >
			</el-table-column>
			<el-table-column prop="fmQtyBefore" label="操作前库存" width="250" >
			</el-table-column>
			<el-table-column prop="fmQtyAfter" label="操作后库存" width="250" >
			</el-table-column>
			<el-table-column prop="cost" label="成本" width="250" >
			</el-table-column>
			<el-table-column prop="price" label="价值" width="250" >
			</el-table-column>
			<el-table-column prop="toSku" label="目标产品" width="200" >
			</el-table-column>
			<el-table-column prop="toLoc" label="目标库位" width="200" >
			</el-table-column>
			<el-table-column prop="toQtyOp" label="目标操作数" width="200" >
			</el-table-column>
			<el-table-column prop="toQtyBefore" label="目标作前库存" width="250" >
			</el-table-column>
			<el-table-column prop="toQtyAfter" label="目标作后库存" width="250" >
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getActTranListPage} from '../../api/actTranApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
                tranType:codemaster.WM_ACT_TRAN_TYPE,
                orderType:codemaster.WM_ORDER_TYPE,
				filters: {
				    orderType:'',
                    orderNo:'',
                    tranType:'',
                    tranTimeFm:null,
                    tranTimeTo:null
				},
                records: [],
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
            showMoreConditionHandeler:function(){
              this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
            formatTranTime: function(row, column){
                if(row.tranTime!==null) {
                    let unixTimestamp = new Date(row.tranTime)
                    return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
                }
            },
            formatTranType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_ACT_TRAN_TYPE,row.tranType);
            },
            formatOrderType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_ORDER_TYPE,row.orderType);
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getRecords();
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
                getActTranListPage(para).then((res) => {
					this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
					//NProgress.done();
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