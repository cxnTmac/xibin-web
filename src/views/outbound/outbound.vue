<template>
	<section>
		<div v-title data-title="出库单"></div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="订单号" prop="orderNo">
						<el-input v-model="filters.orderNo" placeholder="订单号"></el-input>
					</el-form-item>
					<el-form-item label="客户" prop="buyerCode">
						<popwin-button popKey="POP_CUSTOMER" :showName="true" :selectValue="filters.buyerCode"
							v-model="filters.buyerCode"></popwin-button>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="filters.status" clearable placeholder="请选择">
							<el-option v-for="item in status" :key="item.code" :label="item.name" :value="item.code">
								<span style="float: left">{{ item.name }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
							</el-option>
						</el-select>
						<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom"
						v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right" @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getOrders">查询</el-button>
				</el-row>
				<transition name="el-zoom-in-top">
					<el-row :gutter="0" v-if="showMoreQueryCondition">
						<el-form-item label="订单类别" prop="outboundType">
							<el-select v-model="filters.outboundType" clearable placeholder="请选择">
								<el-option v-for="item in type" :key="item.code" :label="item.name" :value="item.code">
									<span style="float: left">{{ item.name }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
								</el-option>
							</el-select>
							<!--<el-input v-model="orderHeader.auditStatus" auto-complete="off"></el-input>-->
						</el-form-item>
						<el-form-item label="订单时间从" prop="orderTimeFm">
							<el-date-picker v-model="filters.orderTimeFm" type="datetime" placeholder="选择日期时间">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
						<el-form-item label="订单时间到" prop="orderTimeTo">
							<el-date-picker v-model="filters.orderTimeTo" type="datetime" placeholder="选择日期时间">
							</el-date-picker>
							<!--<el-input v-model="orderHeader.orderTime" auto-complete="off"></el-input>-->
						</el-form-item>
					</el-row>
				</transition>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" border highlight-current-row v-loading="listLoading" @selection-change="selsChange"
			stripe style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!-- <el-table-column prop="id" label="id" width="80" sortable>
			</el-table-column> -->
			<el-table-column prop="orderNo" label="出库单号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="buyerCode" label="客户编码" width="80">
			</el-table-column>
			<el-table-column prop="buyerName" label="客户名称" width="150">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
			</el-table-column>
			<el-table-column prop="auditStatus" label="审核状态" width="80" :formatter="formatAuditStatus">
			</el-table-column>
			<el-table-column prop="outboundType" label="出库单类型" width="80" :formatter="formatOutboundType">
			</el-table-column>
			<el-table-column prop="paymentCategory" label="打款类别" width="80">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag :type="getPaymentCategoryType(scope.row)">{{ formatPaymentCategory(scope.row)
							}}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="isRecievedCash" label="打款情况" width="80" >
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag :type="getIsRecievedCashType(scope.row)">{{ formatisRecievedCash(scope.row)
							}}</el-tag>
					</div>
				</template></el-table-column>
			<el-table-column prop="orderTime" label="订单时间" width="155" sortable :formatter="formatOrderTime">
			</el-table-column>
			<el-table-column prop="voucherId" label="凭证ID" width="80">
			</el-table-column>
			<el-table-column prop="costVoucherId" label="成本凭证ID" width="80">
			</el-table-column>
			<el-table-column prop="isCalculated" label="是否核算" width="80">
			</el-table-column>
			<el-table-column prop="calculate_time" label="核算时间" width="155">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<!--<el-table-column prop="password" label="密码" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" fixed="right" min-width="180">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length === 0">批量删除</el-button>
			<el-button type="primary" @click="aiForOrders" :disabled="true">AI文字识别</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page"
				:page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<el-dialog title="AI文字订单识别" :visible.sync="dialogAIVisible">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="图片上传" name="picUpload">
					<el-upload ref="upload" class="upload-demo" drag :data="currentRow"
						:on-success="uploadConnectSuccess" :on-error="uploadConnectFail"
						action="/xibin/outbound/uploadOrderPic " :file-list="fileList" multiple list-type="picture"
						:auto-upload="true">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
					</el-upload>
					<!--<el-button type="primary" size="large" @click="startUpload">开始上传</el-button>-->
				</el-tab-pane>
				<el-tab-pane label="识别结果" name="picManage">
					<el-row>

					</el-row>

				</el-tab-pane>
			</el-tabs>
		</el-dialog>

	</section>
</template>

<script>
import Vue from 'vue'
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getOutboundOrderListPage, remove, aiForOrders } from '../../api/outboundApi';
import axios from 'axios';
var codemaster = require('../../../static/codemaster.json');
export default {
	data() {
		return {
			showMoreQueryCondition: false,
			status: codemaster.WM_OUTBOUND_STATUS,
			type: codemaster.WM_OUTBOUND_TYPE,
			filters: {
				orderNo: '',
				buyerCode: '',
				orderTimeFm: '',
				orderTimeTo: '',
				outboundType: '',
				status: ''
			},
			orders: [],
			total: 0,
			page: 1,
			size: 10,
			listLoading: false,
			loading: true,
			sels: [],//列表选中列
			//AI图片识别
			dialogAIVisible: false,
			activeName: 'picUpload',
			currentRow: {},
			fileList: []

		}
	},
	methods: {
		reset() {
			this.$refs['queryForm'].resetFields();
		},
		showMoreConditionHandler: function () {
			this.showMoreQueryCondition = !this.showMoreQueryCondition;
		},
		formatOrderTime: function (row, column) {
			if (row.orderTime !== null) {
				let unixTimestamp = new Date(row.orderTime)
				return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
			}
		},
		formatAuditTime: function (row, column) {
			if (row.auditTime !== null) {
				let unixTimestamp = new Date(row.auditTime)
				return util.formatDate.format(unixTimestamp, 'yyyy-MM-dd hh:mm:ss');
			}
		},
		formatOutboundType: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_OUTBOUND_TYPE, row.outboundType);
		},
		formatStatus: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_OUTBOUND_STATUS, row.status);
		},
		formatAuditStatus: function (row, column) {
			return util.getComboNameByValue(codemaster.SYS_AUDIT_STATUS, row.auditStatus);
		},
		formatPaymentCategory: function (row, column) {
			return util.getComboNameByValue(codemaster.BD_CUSTOMER_PAYMENT_CATEGORY, row.paymentCategory);
		},
		formatisRecievedCash: function (row, column) {
			return util.getComboNameByValue(codemaster.WM_IS_RECIEVED_CASH, row.isRecievedCash);
		},
		getPaymentCategoryType: function (row) {
			if (row.paymentCategory === 'CASH') {
				return 'danger'
			}
			if (row.paymentCategory === 'PERIOD') {
				return 'success'
			}
			if (row.paymentCategory === 'CASH') {
				return 'warning'
			}
		},
		getIsRecievedCashType: function (row) {
			if (row.isRecievedCash === 'N') {
				return 'danger'
			}
			if (row.isRecievedCash === 'Y') {
				return 'success'
			}
			if (row.isRecievedCash === 'NO_CASH') {
				return 'warning'
			}
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getOrders();
		},
		//显示新增界面
		handleAdd: function () {
			this.$store.commit('changeOutboundOrderNo', '');
			this.$store.commit('changeOutboundStatus', 'ADD');
			this.$store.commit('changeOutboundFilters', this.filters);
			this.$store.commit('changeOutboundDetailFromPath', '/outbound');
			this.$store.commit('changePage', this.page);
			this.$router.push({ path: '/outboundDetail' });
		},
		handleEdit: function (index, row) {
			this.$store.commit('changeOutboundOrderNo', row.orderNo);
			this.$store.commit('changeOutboundStatus', 'EDIT');
			this.$store.commit('changeOutboundFilters', this.filters);
			this.$store.commit('changeOutboundDetailFromPath', '/outbound');
			this.$store.commit('changePage', this.page);
			this.$router.push({ path: '/outboundDetail' });
		},
		//获取用户列表
		getOrders() {
			debugger;
			let para = {
				page: this.page,
				size: this.size,
				conditions: JSON.stringify(this.filters)
			};
			this.listLoading = true;
			//NProgress.start();
			getOutboundOrderListPage(para).then((res) => {
				this.total = res.data.size;
				this.orders = res.data.list;
				this.listLoading = false;
				//NProgress.done();
			}).catch((data) => {
				this.listLoading = false;
				util.errorCallBack(data, this.$router, this.$message);
			});;
		},
		//删除
		handleDel: function (index, row) {
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { orderNos: [row.orderNo].join(',') };
				remove(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
						this.getOrders();
					} else {
						this.$message.error(res.data.msg);
					}

				}).catch((data) => {
					this.listLoading = false;
					util.errorCallBack(data, this.$router, this.$message);
				});
			})
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		handleClick: function (tab, event) {
			console.log(tab, event);
		},
		uploadConnectSuccess: function (response, file, fileList) {
			if (response.code == 0) {
				this.$message.error(response.msg);

			} else if (response.code == 200) {
				let data = {
					appid: "1253892890",
					bucket: "",
					url: 'http://www.xbjg.org/xibin-web/pic/fittingSku/A004-1/1551083711895.jpg'
				}
				axios.post('https://recognition.image.myqcloud.com/ocr/handwriting',
					data,
					{
						headers: {
							'Host': 'recognition.image.myqcloud.com',
							'Content-Type': 'application/json',
							'Authorization': 'YU4aoXybsh6jIbnMAv1rA1UUY0FhPTEyNTM4OTI4OTAmYj0maz1BS0lETTBnN1JjN0pLNzJ6SFNjeHZqSmk1QzVvbTZuSkVMSDMmdD0xNTUxMDc4NTQ2JmU9MTU1MTE2NDk0NiZyPTE3NTQxMjYxMjImZj1pbWc='
						}
					}
				).then(res => {
					let result = res.data.data.items;
					let recodes = [];
					for (let i = 0; i < result.length; i++) {
						if (i % 3 == 0) {
							recodes.push({ skuCode: '', num: '', price: '' })
							recodes[i / 3].skuCode = result[i].itemstring;
						}
						if (i % 3 == 1) {
							recodes[i / 3].num = result[i].itemstring;
						}
						if (i % 3 == 2) {
							recodes[i / 3].price = result[i].itemstring;
						}
					}
					console.log('res=>', res);
				})
			}
		},

		uploadConnectFail: function (err, file, fileList) {
			this.$message.error("网络连接错误，上传失败！");
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
		},
		aiForOrders: function () {
			//                aiForOrders({}).then((res) => {
			//                    //NProgress.done();
			//                    if(res.data.code == 200){
			//                        this.$message({
			//                            message: res.data.msg,
			//                            type: 'success'
			//                        });
			//                    }else{
			//                        this.$message.error(res.data.msg);
			//                    }
			//                }).catch((data) => {
			//                    this.listLoading = false;
			//                    util.errorCallBack(data,this.$router,this.$message);
			//                });
			this.dialogAIVisible = true;
			//				let data = {
			//				    appid:"1253892890",
			//                    bucket:"",
			//					url:'http://www.xbjg.org/xibin-web/pic/fittingSku/A004-1/1551083711895.jpg'
			//                }
			//                axios.post('https://recognition.image.myqcloud.com/ocr/handwriting',
			//                    data,
			//                    {
			//                        headers: {
			//                            'Host': 'recognition.image.myqcloud.com',
			//							'Content-Type':'application/json',
			//                            'Authorization': 'YU4aoXybsh6jIbnMAv1rA1UUY0FhPTEyNTM4OTI4OTAmYj0maz1BS0lETTBnN1JjN0pLNzJ6SFNjeHZqSmk1QzVvbTZuSkVMSDMmdD0xNTUxMDc4NTQ2JmU9MTU1MTE2NDk0NiZyPTE3NTQxMjYxMjImZj1pbWc='
			//                        }
			//                    }
			//                ).then(res=>{
			//                    let result = res.data.data.items;
			//                    let recodes = [];
			//                    for(let i = 0;i<result.length;i++){
			//                        if(i%3 == 0){
			//                            recodes.push({skuCode:'',num:'',price:''})
			//                            recodes[i/3].skuCode = result[i].itemstring;
			//						}
			//                        if(i%3 == 1){
			//                            recodes[i/3].num = result[i].itemstring;
			//                        }
			//                        if(i%3 == 2){
			//                            recodes[i/3].price = result[i].itemstring;
			//                        }
			//					}
			//                    console.log('res=>',res);
			//                })
		}
	},
	mounted() {
		this.filters = this.$store.state.outbound.filters;
		this.page = this.$store.state.outbound.page;
		this.getOrders();
	}
}

</script>

<style scoped></style>