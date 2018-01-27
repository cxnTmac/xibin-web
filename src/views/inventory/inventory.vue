<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="产品">
					<popwin-button popKey="POP_SKU"  :selectValue="filters.skuCode" v-model="filters.skuCode"></popwin-button>
				</el-form-item>
				<el-form-item label="库位">
					<popwin-button popKey="POP_LOC"  :selectValue="filters.locCode" v-model="filters.locCode" ></popwin-button>
				</el-form-item>

					<el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="records" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!--<el-table-column prop="id" label="id" width="80" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="skuCode" label="产品编码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="skuName" label="产品名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="modelCode" label="车型" width="200" sortable>
			</el-table-column>
			<!--<el-table-column prop="lot" label="批次号" width="200" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="locCode" label="库位编码" width="200" sortable >
			</el-table-column>
			<el-table-column prop="allocNum" label="待分配数" width="200" >
			</el-table-column>
			<el-table-column prop="invNum" label="库存数" width="200">
			</el-table-column>
			<el-table-column prop="invAvailableNum" label="库存可用数" width="250">
			</el-table-column>
			<el-table-column prop="totalPrice" label="总价值" width="250">
			</el-table-column>
			<el-table-column label="操作" fixed="right" min-width="150">
				<template scope="scope">
				</template>
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
	import { getInventoryListPage} from '../../api/inventoryApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
				filters: {
                    skuCode:'',
					locCod:''
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

                getInventoryListPage(para).then((res) => {
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