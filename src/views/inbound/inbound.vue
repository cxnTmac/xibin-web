<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!--<el-form-item>-->
					<!--<el-input v-model="filters.fittingTypeName" placeholder="配件类别名称"></el-input>-->
				<!--</el-form-item>-->
				<el-form-item>
					<el-button type="primary" v-on:click="getOrders">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column>
			<el-table-column prop="orderNo" label="入库单号" width="200" sortable>
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
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getInboundOrderListPage} from '../../api/inboundApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
				filters: {
                    orderNo: '',
                    supplierCode:'',
					orderTimeFrom:'',
					orderTimeTo:'',
					inboundType:''
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
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
            //显示新增界面
            handleAdd: function () {

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
                getInboundOrderListPage(para).then((res) => {
					this.total = res.data.size;
					this.orders = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
//				this.$confirm('确认删除该记录吗?', '提示', {
//					type: 'warning'
//				}).then(() => {
//					this.listLoading = true;
//					//NProgress.start();
//					let para = { id: row.id ,fittingTypeCode:row.fittingTypeCode};
//                    removeFittingType(para).then((res) => {
//						this.listLoading = false;
//						//NProgress.done();
//                        if(res.data.code == 200){
//                            this.$message({
//                                message: res.data.msg,
//                                type: 'success'
//                            });
//                            this.getFittingTypes();
//                        }else{
//                            this.$message.error(res.data.msg);
//                        }
//
//					});
//				}).catch(() => {
//
//				});
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
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>