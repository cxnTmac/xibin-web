<template>
	<section>
		<el-col :span="4"  style="padding-bottom: 0px;">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="line-height: 15px;">菜单</span>
				</div>
				<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
			</el-card>
		</el-col>
		<!--工具条-->
		<el-col :span="20"  style="padding-bottom: 0px;">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="line-height: 15px;">页面信息</span>
				</div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span style="line-height: 15px;">按钮</span>
				</div>
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="getFunctions">查询</el-button>
				</el-form-item>
				<!--<el-form-item>-->
					<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
				<!--</el-form-item>-->
			</el-form>
			<!--列表-->
			<el-table :data="functions" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="functionCode" label="功能编码" width="120" sortable>
				</el-table-column>
				<el-table-column prop="functionName" label="功能名称" width="300"  >
				</el-table-column>
				<el-table-column prop="is_enable" label="状态" width="500" >
				</el-table-column>
				<el-table-column prop="component" label="组件名" width="500" >
				</el-table-column>
				<el-table-column prop="path" label="路径" width="500" >
				</el-table-column>
				<el-table-column prop="icon" label="图标" width="500" >
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
			</el-card>
		</el-col>






	</section>

</template>

<script>
	import util from '../../common/js/util'
    //import NProgress from 'nprogress'
	import { showAllFunctionListPage,showAllMenu} from '../../api/sysApi';
    var codemaster = require('../../../static/codemaster.json');
    //查询弹出框
    require('../../components/popWin.vue');

	export default {
		data() {
			return {
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
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
				this.getFunctions();
			},
            showMenu(){
                showAllMenu().then((res) => {
                    let data = [{label:'根目录',children:[]}];
                    let menuList  = res.data;

                    //NProgress.done();
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
			},

			getFunctions() {
				let para = {
					page: this.page,
					size: this.size,
					conditions:JSON.stringify(this.filters)
				};
				this.listLoading = true;
				//NProgress.start();
                showAllFunctionListPage(para).then((res) => {
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
			},
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            handleNodeClick(data) {
                console.log(data);
            }

		},
		mounted() {
		    this.showAllMenu();
			this.getFunctions();
		}
	}

</script>

<style scoped>

</style>