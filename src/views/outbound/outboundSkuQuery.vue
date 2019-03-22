<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
				<el-form-item label="客户" prop="areaName">
					<popwin-button popKey="POP_CUSTOMER" :showName="true"   v-model="filters.buyerCode"></popwin-button>
				</el-form-item>
				<el-form-item label="产品" prop="areaCode">
					<popwin-button popKey="POP_SKU"  v-model="filters.fittingSkuCode"></popwin-button>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="filters.headerStatus" clearable  placeholder="请选择 ">
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
				<el-form-item label="产品名称" prop="areaCode">
					<el-input v-model="filters.fittingSkuName" placeholder="区域编码"></el-input>
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
			<el-table-column prop="orderNo" label="出库单号" width="200" sortable>
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="handleEdit(scope.$index, scope.row)" style="margin-left: 10px">{{ scope.row.orderNo }}</a>
				</template>
			</el-table-column>
			<el-table-column prop="headerStatus" label="状态" width="80"  :formatter="formatHeaderStatus">
			</el-table-column>
			<el-table-column prop="outboundType" label="出库单类别" width="80"  :formatter="formatOutboundType" >
			</el-table-column>
			<el-table-column prop="buyerName" label="客户" width="150" >
			</el-table-column>
			<el-table-column prop="lineNo" label="No" width="40" >
			</el-table-column>
			<el-table-column prop="fittingSkuName" label="产品" width="200" >
			</el-table-column>
			<el-table-column prop="modelCode" label="车型" width="150" >
			</el-table-column>	
			<el-table-column prop="outboundNum" label="订货数" width="80" >
			</el-table-column>
			<el-table-column prop="outboundAllocNum" label="分配数" width="80" >
			</el-table-column>
			<el-table-column prop="outboundPickNum" label="拣货数" width="80" >
			</el-table-column>
			<el-table-column prop="outboundShipNum" label="发货数" width="80" >
			</el-table-column>
			<el-table-column prop="outboundPrice" label="价格" width="80" >
			</el-table-column>
			<el-table-column prop="cost" label="成本" width="80" >
			</el-table-column>
			<el-table-column prop="fittingSkuCode" label="产品编码" width="80" >
			</el-table-column>
			<el-table-column prop="quickCode" label="快捷编码" width="80" >
			</el-table-column>
			<el-table-column prop="remark" label="备注" >
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<!--<el-table-column label="操作" fixed="right" min-width="80">-->
				<!--<template slot-scope="scope">-->
					<!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>-->
				<!--</template>-->
			<!--</el-table-column>-->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>




	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { queryWmOutboundDetailByPage} from '../../api/outboundApi';
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
                showMoreQueryCondition:false,
                status:codemaster.WM_OUTBOUND_STATUS,
				filters: {
                    buyerCode: '',
                    fittingSkuCode: '',
                    fittingSkuName:'',
					headerStatus:''
				},
                records: [],
				total: 0,
				page: 1,
				size:100,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列
                orderGroup:[]
			}
		},
		methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0||columnIndex === 1||columnIndex === 2||columnIndex === 3||columnIndex === 4) {
                    let i = this.arrayContains(this.orderGroup,rowIndex);
                    if(i>=0&&i<this.orderGroup.length-1){
                        return {
                            rowspan: this.orderGroup[i+1]-this.orderGroup[i],
                            colspan: 1
                        };
                    }else if(i === this.orderGroup.length-1){
                        return {
                            rowspan: this.records.length-this.orderGroup[i],
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
            formatHeaderStatus: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_OUTBOUND_STATUS,row.headerStatus);
            },
            formatOutboundType: function (row, column) {
                return util.getComboNameByValue(codemaster.WM_OUTBOUND_TYPE,row.outboundType);
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getRecords();
			},
            updateOrderGroup:function () {
                let array = [];
                array.push(0);
                for(let i = 0;i<this.records.length-1;i++){
                    if(this.records[i].orderNo !== this.records[i+1].orderNo){
                        array.push(i+1);
                    }
                }
                this.orderGroup = array;
            },
            arrayContains:function (array,num) {
                for (let i = 0;i<array.length;i++) {
                    if (array[i] === num)
                        return i;
                }
                return -1;
            },
			//获取数据
            getRecords() {
				let para = {
					page: this.page,
					size: this.size,
                    conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                queryWmOutboundDetailByPage(para).then((res) => {
					this.total = res.data.size;
					this.records = res.data.list;
					this.listLoading = false;
                    this.updateOrderGroup();
					//NProgress.done();
				}).catch((data) => {
                    this.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
            handleEdit:function(index,row){
                this.$store.commit('changeOutboundOrderNo', row.orderNo)
                this.$store.commit('changeOutboundStatus', 'EDIT')
                this.$store.commit('changeOutboundDetailFromPath', '/outboundSkuQuery')
                this.$router.push({ path: '/outboundDetail' })
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