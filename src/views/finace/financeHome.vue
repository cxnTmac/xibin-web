<template>
	<section>
		<div class="main">
		<el-row :gutter="20">
			<el-col :span="4" :offset="1">
				<el-button class="hugeBtn" type="primary" icon="el-icon-news" >期初余额录入</el-button>
			</el-col>
			<el-col :span="4">
				<el-button class="hugeBtn" type="success" icon="el-icon-edit-outline" @click="toAddVoucher">录入凭证</el-button>
			</el-col>
			<el-col :span="4">
				<el-button class="hugeBtn" type="info" icon="el-icon-search" @click="toQueryVoucher">凭证管理</el-button>
			</el-col>
			<el-col :span="4">
				<el-button class="hugeBtn" type="warning" icon="el-icon-d-arrow-right"  @click="toTransferProfitAndLoss">结转损益</el-button>
			</el-col>
			<el-col :span="3">
				<el-button class="hugeBtn" type="danger" icon="el-icon-date" @click="toEndTerm">期末结账</el-button>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="14" :offset="1">
				<h4>2017年度营业利润趋势表</h4>
			</el-col>
			<el-col :span="8" :offset="1">
				<h4>本期财务指标</h4>
			</el-col>
		</el-row>
		</div>
		<!--新增界面-->
		<el-dialog title="结转损益" :visible.sync="transferFormVisible" :close-on-click-modal="false">
			<el-alert
					title="提醒"
					type="warning"
					description="期末时，应将各损益科目的余额转入“本年利润”科目，以反映企业在一个会计期间内实现的利润或亏损总额。本指南将帮助你自动完成对损益类科目的结转，并自动生成一张转账凭证。"
					show-icon>
			</el-alert>
			<el-form :model="transferForm" label-width="80px" :rules="transferFormRules" ref="transferForm">
				<el-row :gutter="0">
					<el-col :span="12">
						<el-form-item label="凭证日期" prop="date">
							<el-date-picker
									v-model="transferForm.date"
									type="datetime"
									placeholder="选择日期时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="24">
						<el-form-item label="凭证摘要" prop="summary">
							<el-input v-model="transferForm.summary" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="0">
					<el-col :span="8">
						<el-form-item label="凭证字" prop="voucherWord">
							<el-select v-model="transferForm.voucherWord"  placeholder="请选择">
								<el-option
										v-for="item in voucherWord"
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
				<el-button @click.native="transferFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="createVoucher" :loading="createVoucehrLoading">生成凭证</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
    import NProgress from 'nprogress'
    var codemaster = require('../../../static/codemaster.json');
    import {lossAndGainBroughtForward,endTerm} from '../../api/termApi';
	export default {
		data() {
			return {
                transferFormVisible:false,
                createVoucehrLoading:false,
                transferForm:{
                    date:'',
                    summary:'',
                    voucherWord:''
				},
                voucherWord:[
                    {"code":"记","name":"记"},
                    {"code":"收","name":"收"},
                    {"code":"付","name":"付"},
                    {"code":"转","name":"转"}
                ],
                transferFormRules:{
//                    date:[
//                        { required: true, message: '请输入日期', trigger: 'blur' }
//                    ],
                    summary:[
                        { required: true, message: '请输入摘要', trigger: 'blur'  }
                    ],
                    voucherWord:[
                        { required: true, message: '请输入凭证字', trigger: 'blur'  }
                    ]
				}
			}
		},
		methods: {
            toAddVoucher:function () {
                this.$store.commit('changeVoucherStatus', 'ADD')
                this.$router.push({ path: '/voucherDetail' })
            },
			toQueryVoucher:function () {
                this.$router.push({ path: '/voucher' })
            },
			toTransferProfitAndLoss:function () {
				this.transferFormVisible = true;
            },
            createVoucher:function () {
                let para = this.transferForm;
                this.$refs.transferForm.validate((valid) => {
                    if (valid) {
                        lossAndGainBroughtForward(para).then((res) => {
                            //this.total = res.data.size;
                            this.transferFormVisible = false;
                            if(res.data.code == 200){
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.data.msgs);
                            }
                            //NProgress.done();
                        }).catch((data) => {
                            this.transferFormVisible = false;
                            util.errorCallBack(data,this.$router,this.$message);
                        });
                    }
                });
            },
            toEndTerm:function () {
                endTerm().then((res) => {
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        //更新session信息，主要是为了更新当前期间
                        sessionStorage.setItem('user', JSON.stringify(res.data.data));
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    //NProgress.done();
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
            }
		},
		mounted() {
		}
	}

</script>

<style scoped>
	.main {
		margin-top: 40px;
	}
	.el-row {
		margin-top: 20px;
	}
	.hugeBtn{
		font-size: larger;
		width: 200px; height: 170px;
	}
</style>