<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="getRoles">查询</el-button>
				</el-form-item>
				<!--<el-form-item>-->
					<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
				<!--</el-form-item>-->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roles" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="roleCode" label="角色编码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="roleName" label="角色名称" width="300"  >
			</el-table-column>
			<el-table-column prop="status" label="状态" width="500" >
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template slot-scope="scope">
					<!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
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
	import { showAllRoleListPage} from '../../api/sysApi';
    var codemaster = require('../../../static/codemaster.json');
    //查询弹出框
    require('../../components/popWin.vue');

	export default {
		data() {
			return {
				filters: {
				},
				roles: [],
				total: 0,
				page: 1,
				size:10,
				listLoading: false,
                loading:true,
				sels: [],//列表选中列,
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getRoles();
			},
			//获取用户列表
			getRoles() {
				let para = {
					page: this.page,
					size: this.size,
					conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                showAllRoleListPage(para).then((res) => {
					this.total = res.data.size;
					this.roles = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				}).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getRoles();
		}
	}

</script>

<style scoped>

</style>