<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
				<el-button type="primary" :disabled="btnSaveAndAddStatus" @click="saveAndAdd" :loading="pageControl.saveAndAddBtnLoading">保存并新增</el-button>
				<el-button type="primary" :disabled="btnSaveStatus" @click="save" :loading="pageControl.saveBtnLoading">保存</el-button>
				<el-button type="primary" :disabled="btnCheckStatus" @click="check" :loading="pageControl.checkBtnLoading">审核</el-button>
				<el-button type="danger" :disabled="btnCancelCheckStatus" @click="cancelCheck" :loading="pageControl.cancelCheckBtnLoading">取消审核</el-button>
				<el-button  @click="back" style="float: right">返回</el-button>
		</el-col>
		<el-form :model="voucher" label-width="80px" :rules="voucherRules" ref="voucher">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<el-row :gutter="0">
						<h2 style="text-align: center">记账凭证</h2>
						<el-col :span="4">
							<el-form-item label="会计期间" prop="voucherWord">
								<el-input v-model="voucher.period"  disabled auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="凭证字" prop="voucherWord">
								<el-select v-model="voucher.voucherWord"  placeholder="请选择">
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
						<el-col :span="2">
							<el-form-item label="号" prop="voucherNum">
								<el-input v-model="voucher.voucherNum" disabled  auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6" style="float: right">
							<el-form-item label="日期" prop="billDate">
								<el-date-picker
										v-model="voucher.billDate"
										type="datetime"
										placeholder="选择日期时间">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6" style="float: right">
							<el-form-item label="状态" prop="status">
								<el-select v-model="voucher.status" disabled placeholder="请选择">
									<el-option
											v-for="item in voucherStatus"
											:key="item.code"
											:label="item.name"
											:value="item.code">
										<span style="float: left">{{ item.name }}</span>
										<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
									</el-option>
								</el-select>
								<!--<el-input v-model="orderHeader.status" auto-complete="off"></el-input>-->
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<el-table :data="detailGrid.voucherDetail" :row-click="rowClick" border show-summary  :summary-method="getSummaries" highlight-current-row v-loading="detailGrid.listLoading" @current-change="handleCurrentChange"  stripe style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="lineNo" label="行号" width="100" >
					</el-table-column>
					<el-table-column prop="courseNo" label="科目编码" width="250" >
						<template scope="scope">
							<div slot="reference" class="name-wrapper">
								<popwin-button popKey="POP_COURSE" :selectValue="scope.row.courseNo" v-model="scope.row.courseNo" @changeValue="changePopValueForCourseNo"></popwin-button>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="auxiliary" label="辅助核算" width="250" >
						<template scope="scope">
							<div slot="reference" class="name-wrapper">
								<popwin-button popKey="POP_AUXILIARY" @changeValue="changePopValueForAuxiliary" :disabled="auxiliaryDisabled" :selectValue="scope.row.auxiId" v-model="scope.row.auxiId" :staticCondition="auxiliaryQueryCondition"></popwin-button>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="fullCourseName" label="科目名称" width="200"  :formatter="formatFullCourseName">
					</el-table-column>
					<el-table-column prop="debit" label="借" width="200">
						<template scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-input-number    v-model="scope.row.debit"   auto-complete="off"></el-input-number>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="credit" label="贷" width="200">
						<template scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-input-number    v-model="scope.row.credit"   auto-complete="off"></el-input-number>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="summary" label="摘要" width="400" >
						<template scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-input v-model="scope.row.summary"  auto-complete="off"></el-input>
							</div>
						</template>
					</el-table-column>


					<el-table-column label="操作" fixed="right" min-width="150">
						<template scope="scope">
							<!--<el-button size="small"  @click="handleDetailEdit(scope.$index, scope.row)">编辑</el-button>-->
							<el-button type="danger"  size="small" @click="handleDetailDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button type="primary" :disabled="btnDetailGridAddStatus" @click="addDetailHandler">新增</el-button>
				</el-col>
			</el-card>
		</el-form>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
	import { getVoucherById,getVoucherDetailsByVoucherId,saveVoucherAndDetail,checkVoucher,cancelCheckVoucher} from '../../api/voucherApi';
    var codemaster = require('../../../static/codemaster.json');
	export default {
		data() {
			return {
				voucher:{
			        id:'',
					voucherNum:'',
					voucherWord:'',
					period:'',
					billDate:'',
					status:'',
					bill:'',
                    checker:'',
                    completeDate:'',
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:''
				},
                detailGrid:{
				    currentRow:{},
                    editForm:{
                        id:'',
                        voucherId:'',
                        courseNo:'',
                        lineNo:'',
                        toGo:'',
                        debit:0,
                        credit:0,
                        summary:'',
                        auxiId:'',
                        amount:0,
						price:0,
                        remark:'',
                        creator:'',
                        createTime:'',
                        modifier:'',
                        modifyTime:'',
                        rec_ver:'',
                        companyId:'',
                    },
                    voucherDetail:[],
					removeDetail:[],
                    listLoading:false,
                    sels:[],
					sumForDebit:0,
					sumForCredit:0
				},
				pageControl:{
				    saveBtnLoading:false,
                    saveAndAddBtnLoading:false,
                    checkBtnLoading:false,
                    cancelCheckBtnLoading:false
				},
                voucherRules:{
				},
                voucherStatus:codemaster.FI_VOUCHER_STATUS,
                voucherWord:[
                    {"code":"记","name":"记"},
                    {"code":"收","name":"收"},
                    {"code":"付","name":"付"},
                    {"code":"转","name":"转"}
				],
				currentPeriod:'',
                auxiliaryQueryCondition:'',
                auxiliaryDisabled:true
			}
		},
        computed: {
            btnSaveStatus:function () {
                if(this.voucher.status === '00'){
                    return false;
				}else{
                    return true;
				}
            },
            btnSaveAndAddStatus:function () {
                if(this.voucher.status === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            btnCheckStatus:function () {
                if(this.voucher.status === '00'){
                    return false;
                }else{
                    return true;
                }
            },
            btnCancelCheckStatus:function () {
                if(this.voucher.status === '10'){
                    return false;
                }else{
                    return true;
                }
            },
            btnDetailGridAddStatus:function () {
				return false
            },
            voucherId:function() {
                return this.$store.state.voucherDetail.voucherId
            },
            status:function(){
                return this.$store.state.voucherDetail.status
            }
        },
		methods: {
            formatFullCourseName:function (row, column) {
                if(!util.isNullOrUndefined(row.auxiliaryName)){
                    return row.courseName+'-'+row.auxiliaryName;
				}
				return row.courseName
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if(index !== 5 && index!==6){
                        sums[index] = '';
                        return
					}
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = 'N/A';
                    }
                });
				this.detailGrid.sumForDebit = sums[5];
				this.detailGrid.sumForCredit = sums[6];
                return sums;
            },
            handleCurrentChange:function (currentRow,oldCurrentRow) {
				if(oldCurrentRow !==null){
                    //必填校验
                    if(this.auxiliaryDisabled == false && (util.isNullOrUndefined(oldCurrentRow.auxiId)||oldCurrentRow.auxiId === '')){
                        this.$message.error('必须填写辅助核算项目');
                    }
				}
                this.detailGrid.currentRow = currentRow;
                if(!util.isNullOrUndefined(currentRow.auxirequired)&&currentRow.auxirequired === true){
                    this.auxiliaryDisabled = false;
				}
				if(util.isNullOrUndefined(currentRow.auxirequired)){
                    this.auxiliaryDisabled = true;
				}
            },
			beforeSave:function () {
				if(this.detailGrid.sumForDebit!== this.detailGrid.sumForCredit){
                    this.$message.error('录入借贷不平！');
                    return false;
				}
				for(var i = 0;i<this.detailGrid.voucherDetail.length;i++){
				    if(this.detailGrid.voucherDetail[i].courseNo === ''||this.detailGrid.voucherDetail[i].courseNo === null){
                        this.$message.error('行号'+this.detailGrid.voucherDetail[i].lineNo+'没有选择科目！');
                        return false;
					}else if((this.detailGrid.voucherDetail[i].credit === null||this.detailGrid.voucherDetail[i].credit===0)&&
						(this.detailGrid.voucherDetail[i].debit === null||this.detailGrid.voucherDetail[i].debit===0) ){
                        this.$message.error('行号'+this.detailGrid.voucherDetail[i].lineNo+'借贷金额均为空');
                        return false;
					}
					//如果该行的辅助核算项目是必填的
					if(this.detailGrid.voucherDetail[i]['auxirequired'] == true
							&&(this.detailGrid.voucherDetail[i].auxiId === null||this.detailGrid.voucherDetail[i].auxiId === '')){
                        this.$message.error('行号'+this.detailGrid.voucherDetail[i].lineNo+'辅助项目不能为空');
                        return false;
					}
				}

				for(var j = 0;j<this.detailGrid.voucherDetail.length;j++){
					if(this.status === 'EDIT') {
					    //编辑状态需设置分录的凭证ID
						this.detailGrid.voucherDetail[j].voucherId = this.voucher.id;
					}
					if(this.detailGrid.voucherDetail[j].debit!== null&&this.detailGrid.voucherDetail[j].debit>0){
						this.detailGrid.voucherDetail[j].toGo = 1;
					}
					if(this.detailGrid.voucherDetail[j].credit!== null&&this.detailGrid.voucherDetail[j].credit>0){
                        this.detailGrid.voucherDetail[j].toGo = 0;
					}
				}
				return true;
            },
			save:function(){
			    if(this.beforeSave()){
			        this.pageControl.saveBtnLoading = true;
                    let para = {
                        voucher:JSON.stringify(this.voucher),
                        details:JSON.stringify(this.detailGrid.voucherDetail),
						removeDetails:JSON.stringify(this.detailGrid.removeDetail)
                    }
                    saveVoucherAndDetail(para).then((res) => {
                        this.pageControl.saveBtnLoading = false;
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.voucher = Object.assign({}, res.data.data);
                            this.getVoucherDetails();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        //NProgress.done();
                    }).catch((data) => {
                        this.pageControl.saveBtnLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
				}
			},
			saveAndAdd:function () {
                if(this.beforeSave()){
                    this.pageControl.saveAndAddBtnLoading = true;
                    let para = {
                        voucher:JSON.stringify(this.voucher),
                    	details:JSON.stringify(this.detailGrid.voucherDetail)
                	}
                    saveVoucherAndDetail(para).then((res) => {
                        this.pageControl.saveAndAddBtnLoading = false;
                        if(res.data.code == 200){
                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.setToAddStatus();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        //NProgress.done();
                    }).catch((data) => {
                        this.pageControl.saveAndAddBtnLoading = false;
                        util.errorCallBack(data,this.$router,this.$message);
                    });
                }
            },
			check:function () {
                this.pageControl.checkBtnLoading = true;
                let para = {
                    voucher:JSON.stringify(this.voucher)
                }
                checkVoucher(para).then((res) => {
                    this.pageControl.checkBtnLoading = false;
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.voucher = Object.assign({}, res.data.data);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    //NProgress.done();
                }).catch((data) => {
                    this.pageControl.checkBtnLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
			cancelCheck:function () {
                this.pageControl.cancelCheckBtnLoading = true;
                let para = {
                    voucher:JSON.stringify(this.voucher)
                }
                cancelCheckVoucher(para).then((res) => {
                    this.pageControl.cancelCheckBtnLoading = false;
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.voucher = Object.assign({}, res.data.data);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    //NProgress.done();
                }).catch((data) => {
                    this.pageControl.cancelCheckBtnLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            back:function () {
                this.$router.push({ path: '/voucher' });
            },
            addDetailHandler:function () {
			    var lastLineNo = 1;
			    if(this.detailGrid.voucherDetail.length>0){
			        lastLineNo = this.detailGrid.voucherDetail[this.detailGrid.voucherDetail.length-1].lineNo+1;
				}
                this.detailGrid.voucherDetail.push({
                    id:'',
                    voucherId:'',
                    courseNo:'',
                    lineNo:lastLineNo,
                    toGo:'',
                    debit:0,
                    credit:0,
                    summary:'',
                    auxiId:'',
                    amount:0,
                    price:0,
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:'',
                    companyId:'',
                });
                this.auxiliaryDisabled = true
            },
            handleDetailDel:function (index,row) {
			    if(row.id!==null){
                    this.detailGrid.removeDetail.push(row);
				}
				this.detailGrid.voucherDetail.splice(index,1)
            },
            getVoucher:function () {
                getVoucherById({id:this.voucherId}).then((res) => {
                    this.voucher = Object.assign({}, res.data);
                    this.getVoucherDetails();
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
			getVoucherDetails:function () {
                this.detailGrid.listLoading = true;
                let para = {
                    voucherId:this.voucher.id
                }
                getVoucherDetailsByVoucherId(para).then((res) => {
                    this.detailGrid.voucherDetail = res.data.list;
                    this.detailGrid.listLoading = false;
                    //NProgress.done();
                }).catch((data) => {
                    this.detailGrid.listLoading = false;
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            changePopValueForCourseNo:function (row) {
                this.detailGrid.currentRow.courseName = row.courseName;
                this.detailGrid.currentRow.auxiId = null;
                //如果 辅助核算ID不为空
			    if(!util.isNullOrUndefined(row.auxiliary)){
                    this.auxiliaryQueryCondition = {fid:row.auxiliary}
                    this.auxiliaryDisabled = false
                    this.detailGrid.currentRow['auxirequired'] = true
				}else{
                    this.auxiliaryDisabled = true
                    this.detailGrid.currentRow['auxirequired'] = false
				}
            },
            changePopValueForAuxiliary:function (row) {
			    if(row.name === undefined){
					return
				}
                this.detailGrid.currentRow.auxiliaryName = row.name;
            },
            rowClick:function (row, event, column) {

            },
			setToAddStatus:function () {
                this.voucher={
                    id:'',
                    voucherNum:'',
                    voucherWord:'记',
                    period:this.currentPeriod,
                    billDate:new Date(),
                    status:'00',
                    bill:'',
                    checker:'',
                    completeDate:'',
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:0,
                    companyId:''
                }
                this.detailGrid.voucherDetail.push({
                    id:'',
                    voucherId:'',
                    courseNo:'',
                    lineNo:1,
                    toGo:'',
                    debit:0,
                    credit:0,
                    summary:'',
                    auxiId:'',
                    amount:0,
                    price:0,
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:0,
                    companyId:''
                });
                this.detailGrid.voucherDetail.push({
                    id:'',
                    voucherId:'',
                    courseNo:'',
                    lineNo:2,
                    toGo:'',
                    debit:0,
                    credit:0,
                    summary:'',
                    auxiId:'',
                    amount:0,
                    price:0,
                    remark:'',
                    creator:'',
                    createTime:'',
                    modifier:'',
                    modifyTime:'',
                    rec_ver:0,
                    companyId:'',
                });
            }
		},
		mounted() {
            var user = sessionStorage.getItem('user');
            user = JSON.parse(user);
            this.currentPeriod = user.currentPeriod;
		    if(this.status === 'EDIT'){
                this.getVoucher();
			}
			else if(this.status === 'ADD'){
                this.setToAddStatus();
			}
		}
	}

</script>

<style scoped>

</style>