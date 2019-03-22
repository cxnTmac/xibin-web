<template>
	<section>

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="利润表" name="first"><!--工具条-->
			</el-tab-pane>
			<el-tab-pane label="资产负债表" name="second">
			</el-tab-pane>
		</el-tabs>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="queryForm">
				<el-row :gutter="0">
					<el-form-item label="期间" prop="period">
						<popwin-button popKey="POP_PERIOD" :selectValue="filters.period" v-model="filters.period" ></popwin-button>
					</el-form-item>
					<el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
					<el-button type="danger" style="float: right"  @click="reset">重置</el-button>
					<el-button type="primary" style="float: right" v-on:click="getOrders">查询</el-button>
				</el-row>

				<el-row :gutter="0" v-if="showMoreQueryCondition">

				</el-row>
			</el-form>
		</el-col>
		<div>
			<iframe height="700px" width="100%" scrolling="auto" :src="targetReportUrl">

			</iframe>
		</div>




	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { showAllClosedOrderInboundDetail,createVoucher,accountByOrderNos} from '../../api/inboundApi';
    var codemaster = require('../../../static/codemaster.json');
    var config = require('../../../static/config.json');
	export default {
		data() {
			return {
                targetReportUrl:'',
                pageControl:{

				},
                createFormRules:[],
                activeName:'first',
                showMoreQueryCondition:false,
				filters: {
					period:''
				}
			}
		},
		methods: {
            handleClick(){
                let user = JSON.parse(localStorage.getItem('user'));
                if(this.activeName === 'first'){
                    this.targetReportUrl = config.reportUrl+"?url=IncomeStatement&period="+this.filters.period+"&companyId="+user.companyId+"&bookId="+user.bookId;
    			}else if(this.activeName === 'second'){
                    this.targetReportUrl = config.reportUrl+"?url=balanceSheet&period="+this.filters.period+"&companyId="+user.companyId+"&bookId="+user.bookId;
    			}
				this.getOrders()
			},
            reset(){
                this.$refs['queryForm'].resetFields();
            },
            showMoreConditionHandler:function(){
                this.showMoreQueryCondition = !this.showMoreQueryCondition;
            },
            getOrders() {
                let user = JSON.parse(localStorage.getItem('user'));
                if(this.activeName === 'first'){
                    this.targetReportUrl = config.reportUrl+"?url=IncomeStatement&period="+this.filters.period+"&companyId="+user.companyId+"&bookId="+user.bookId;
                }else if(this.activeName === 'second'){
                    this.targetReportUrl = config.reportUrl+"?url=BalanceSheet&period="+this.filters.period+"&companyId="+user.companyId+"&bookId="+user.bookId;
                }
			}
		},
		computed:{
		},
		mounted() {
            let user = JSON.parse(localStorage.getItem('user'));
		    this.filters.period = user.currentPeriod;
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>