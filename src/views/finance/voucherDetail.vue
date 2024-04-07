<template>
	<section>
		<div class="charge-container" id="chargeContainer">
			<div class="charge">
				<!--<h1 class="charge-title">记账凭证</h1>-->
				<div class="charge-header">
					<div>
						凭证字
						<!-- <el-select style="width: 80px;" v-model="voucher.word">
							<el-option v-for="item in wordList" :key="item.name" :label="item.name" :value="item.name">
							</el-option>
						</el-select> -->
						<el-select style="width: 80px;" v-model="voucher.groupID" placeholder="字">
							<el-option v-for="item in FI_VOUCHER_WORD" :key="item.code" :label="item.name"
								:value="item.code">
								<span style="float: left">{{ item.name }}</span>
								<span style="float: right; color: #8492a6; font-size: 13px">{{
									item.code
								}}</span>
							</el-option>
						</el-select>
					</div>

					<div>
						凭证号
						<el-input type="number" style="width: 80px;" min="1" :disabled="true"
							v-model="voucher.number"></el-input>
					</div>

					<div>
						日期
						<el-date-picker type="date" style="width: 145px;" v-model="voucher.fdate"></el-date-picker>
					</div>

					<div style="font-size: 24px;">记账凭证</div>

					<div style="float: right;position: relative;">
						附单据
						<el-input type="number" style="width: 80px;" min="0" v-model="voucher.bill"></el-input>
						张
						<i class="el-icon-info"></i>
						<div class="tip-box">
							<table class="tip-box-table" border="1">
								<tr style="background-color: #f5f4f4;">
									<td>操作</td>
									<td>快捷键</td>
								</tr>
								<tr>
									<td>选择列表</td>
									<td>F7</td>
								</tr>
								<tr>
									<td>自动平衡</td>
									<td>=</td>
								</tr>
								<tr>
									<td>新增</td>
									<td>F4</td>
								</tr>
								<tr>
									<td>保存</td>
									<td>Ctrl+S</td>
								</tr>
								<tr>
									<td>保存并审核</td>
									<td>F10</td>
								</tr>
								<tr>
									<td>保存并新增</td>
									<td>F11</td>
								</tr>
								<tr>
									<td>复制上一行</td>
									<td>//</td>
								</tr>
								<tr>
									<td>复制上一行摘要</td>
									<td>..</td>
								</tr>
								<tr>
									<td>金额自动切换借贷方</td>
									<td>空格键</td>
								</tr>
								<tr>
									<td>单据头与分录快速切换</td>
									<td>Tab</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<table class="charge-table" border="1">
					<tr>
						<td width="6%">操作</td>
						<td :width="isAuxiliary ? '14%' : '22%'">摘要</td>
						<td :width="isAuxiliary ? '15%' : '22%'">会计科目</td>
						<td width="14%">辅助核算</td>
						<td width="50%">
							<table style="height: 50px;">
								<tr style="border-bottom: 1px solid #bab9b9;">
									<td width="50%" style="border-right: 1px solid #bab9b9;">借方金额</td>
									<td width="50%">贷方金额</td>
								</tr>
								<tr>
									<td style="border-right: 1px solid #bab9b9;">
										<table class="debtor-lender-table" style="height: 100%;">
											<tr>
												<td>亿</td>
												<td>千</td>
												<td>百</td>
												<td>十</td>
												<td>万</td>
												<td>千</td>
												<td>百</td>
												<td>十</td>
												<td>元</td>
												<td>角</td>
												<td>分</td>
											</tr>
										</table>
									</td>
									<td>
										<table class="debtor-lender-table" style="height: 100%;">
											<tr>
												<td>亿</td>
												<td>千</td>
												<td>百</td>
												<td>十</td>
												<td>万</td>
												<td>千</td>
												<td>百</td>
												<td>十</td>
												<td>元</td>
												<td>角</td>
												<td>分</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr v-for="(item, index) in list">
						<td>
							<div @click="addList" class="charge-table-icon">
								<i class="el-icon-plus" style="color: orangered;"></i>
							</div>
							<div @click="removeList(index)" class="charge-table-icon">
								<i class="el-icon-close" style="color: #4a90e2;"></i>
							</div>
						</td>
						<td>
							<div @click="showInput(index, 'main')" v-if="!item.isShowMainInput" class="main-subject">
								<!--{{item.main}}-->
								<textarea v-model="item.explanation"></textarea>
							</div>
							<div class="main-subject" v-if="item.isShowMainInput">
								<textarea v-model="item.explanation" v-focus @blur="hideInput(index, 'main')"
									@keyup="keyupEvents(index, $event, 1)"></textarea>

								<div class="dropdown-menu suggest-list special-elements" style="top: 60px;">
									<ul class="item-list">
										<li v-for="main in mainList" v-if="main.name.indexOf(item.main.trim()) != -1"
											:class="main.name == item.explanation ? 'hover' : ''"
											@click="voluationInput(index, 'main', main.name)">{{ main.name }}
										</li>
									</ul>
								</div>
							</div>
							<i v-if="item.isShowMainInput" class="el-icon-more special-elements"></i>
						</td>
						<td>
							<div @click="showInput(index, 'subject')" v-if="!item.isShowSubjectInput"
								class="main-subject">
								<textarea v-model="item.accountName"></textarea>
							</div>
							<div class="main-subject" v-if="item.isShowSubjectInput">
								<!--<input type="text" v-model="item.subject" @blur="hideInput(index,'subject')" v-focus @keyup="keyupEvents(index,$event,2)">-->
								<textarea v-model="item.accountName" v-focus @blur="hideInput(index, 'subject')"
									@keyup="keyupEvents(index, $event, 2)"></textarea>

								<div class="dropdown-menu suggest-list special-elements" style="top: 60px;">
									<ul class="item-list">
										<li v-for="subject in subjectList"
											v-if="subject.name.indexOf(item.accountName.trim()) != -1"
											:class="subject.name == item.accountName ? 'hover' : ''"
											@click="voluationInput(index, 'subject', subject)">
											{{ subject.name }}
										</li>
									</ul>
								</div>
							</div>
							<i v-if="item.isShowSubjectInput" class="el-icon-more special-elements"></i>
						</td>
						<td>
							<div @click="showInput(index, 'auxiItem')" v-if="!item.isShowAuxiItemInput"
								class="main-subject">
								<textarea v-model="item.itemName"></textarea>
							</div>
							<div class="main-subject" v-if="item.isShowAuxiItemInput">
								<!--<input type="text" v-model="item.subject" @blur="hideInput(index,'subject')" v-focus @keyup="keyupEvents(index,$event,2)">-->
								<textarea v-model="item.itemName" v-focus @blur="hideInput(index, 'auxiItem')"
									@keyup="keyupEvents(index, $event, 3)"></textarea>

								<div class="dropdown-menu suggest-list special-elements" style="top: 60px;">
									<ul class="item-list">
										<li v-for="auxiItem in auxiItemList"
											v-if="auxiItem.name.indexOf(item.itemName.trim()) != -1"
											:class="auxiItem.name == item.itemName ? 'hover' : ''"
											@click="voluationInput(index, 'auxiItem', auxiItem)">
											{{ auxiItem.name }}
										</li>
									</ul>
								</div>
							</div>
							<i v-if="item.isShowAuxiItemInput" class="el-icon-more special-elements"></i>
						</td>
						<td>
							<table>
								<tr>
									<td width="50%" style="border-right: 1px solid #bab9b9;">
										<table class="debtor-tbale debtor-lender-table">
											<tr @click="showInput(index, 'debtor')" v-if="!item.isShowDebtorInput"
												:class="item.jAmount * 1 < 0 ? 'tr-negative' : ''">
												<td v-for="debit in item.debitList">{{ debit }}</td>
											</tr>

											<tr v-if="item.isShowDebtorInput">
												<input @blur="hideInput(index, 'debtor')"
													@keyup="debtorInputKeyUp(index, $event, 4)" v-model="item.jAmount"
													maxlength="12" v-focus
													onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d$/.test(value))event.returnValue=false">
											</tr>
										</table>
									</td>
									<td width="50%">
										<table class="lender-tbale debtor-lender-table">
											<tr v-if="!item.isShowLenderInput" @click="showInput(index, 'lender')"
												:class="item.dAmount * 1 < 0 ? 'tr-negative' : ''">
												<td v-for="credit in item.creditList">{{ credit }}</td>
											</tr>
											<tr v-if="item.isShowLenderInput">
												<input @blur="hideInput(index, 'lender')"
													@keyup="lenderInputKeyUp(index, $event, 5)" v-model="item.dAmount"
													maxlength="11" v-focus
													onkeypress="if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;">
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td :colspan="isAuxiliary ? 4 : 3" style="text-align: left;padding-left: 10px;">合计：</td>
						<td>
							<table>
								<tr>
									<td width="50%" style="border-right: 1px solid #bab9b9;">
										<table class="debtor-tbale debtor-lender-table">
											<tr>
												<td v-for="debit in voucher.debitTotalList">{{ debit }}</td>
											</tr>
										</table>
									</td>
									<td width="50%">
										<table class="lender-tbale debtor-lender-table">
											<tr>
												<td v-for="credit in voucher.creditTotalList">{{ credit }}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<div style="height: 50px;line-height: 50px;">制单人：</div>
				<div style="text-align: right;" v-show="saveVisible">
					<el-button @click="back">返回</el-button>
					<el-button type="primary" @click="preservation(2)">保存</el-button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>

import Vue from 'vue';
import util from '../../common/js/util';
import NP from "number-precision";
import { showAllAuxiItem, showAllAccount, saveFVoucher, findFVoucherentryList1, getById, updateFVoucher, saveFIncome } from '../../api/financeApi';
// import mainSelector  from '../../components/mainSelector.vue';
// import auxiliarySelector  from '../../components/auxiliarySelector.vue';
// import subjectSelector  from '../../components/subjectSelector.vue';
Vue.directive('focus', {
	// 当绑定元素插入到 DOM 中。
	inserted: function (el) {
		// 聚焦元素
		el.focus();
	}
});
// Vue.use(mainSelector);
// Vue.use(auxiliarySelector);
// Vue.use(subjectSelector);
var codemaster = require('../../../static/codemaster.json');
export default {
	data() {
		return {
			FI_VOUCHER_WORD: codemaster.FI_VOUCHER_WORD,
			voucher: {
				type: '',
				voucherID: '',
				fVoucherType: '',
				sDay: '',
				eDay: '',
				fdate: new Date(),
				fyear: '',
				fperiod: '',
				groupID: 3,
				number: null,
				serialNum: '',
				entryCount: 0,
				debitTotal: "",
				creditTotal: "",
				transDate: new Date(),
				isProfitLoss: 0,
				explanation: '',
				bill: 0,
				debitTotalList: ['', '', '', '', '', '', '', '', 0, 0, 0],
				creditTotalList: ['', '', '', '', '', '', '', '', 0, 0, 0]
			},
			removeListData: [],
			list: [],
			ids: [],
			wordList: [],// 凭证字
			mainList: [],// 摘要
			subjectList: [],// 科目
			auxiItemList: [],// 核算
			isAuxiliary: true,
			saveVisible: true
		}
	},
	computed: {
		voucherID: function () {
			return this.$store.state.voucherDetail.voucherID;
		},
		status: function () {
			return this.$store.state.voucherDetail.status;
		},
	},
	methods: {
		getAuxiItems() {
			showAllAuxiItem({ isDelete: 0 })
				.then((res) => {
					this.auxiItemList = res.data;
				})
				.catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
		},
		getAccounts() {
			showAllAccount({ isDelete: 0 })
				.then((res) => {
					this.subjectList = res.data;
				})
				.catch((data) => {
					util.errorCallBack(data, this.$router, this.$message);
				});
		},
		judgeIsAuxiliary() {
			// var flag = false;
			// for (var i in this.list) {
			// 	var detailJson = this.list[i].subject.detailJson;
			// 	if (detailJson !== '' && detailJson !== undefined) {
			// 		flag = true;
			// 		this.list[i].isAuxiliary = true;
			// 	} else {
			// 		this.list[i].isAuxiliary = false;
			// 		this.list[i].auxiliary = '';
			// 	}
			// }
			// this.isAuxiliary = flag;
			this.isAuxiliary = true;
		},
		handleEvent(event) {
			//console.log(event);
			if (window.location.hash == '#/voucherDetail') {
				if (event.keyCode === 83 && event.ctrlKey) {
					//console.log('拦截到83+ctrl');
					this.preservation(2);
					event.preventDefault();
					event.returnValue = false;
					return false;
				} else if (event.keyCode === 115) {
					//console.log('拦截到115');//F4
					this.addList();
					event.preventDefault();
					event.returnValue = false;
					return false;
				} else if (event.keyCode === 121) {
					//console.log('拦截到121');//F10
					event.preventDefault();
					event.returnValue = false;
					return false;
				} else if (event.keyCode === 122) {
					//console.log('拦截到122');//F11
					event.preventDefault();
					event.returnValue = false;
					return false;
				}
			} else {
				//需要销毁事件 防止全局生效
				//document.removeEventListener('keydown', this.handleEvent);
			}

		},
		changeEntryEditState(index) {
			// 如果凭证处于新增状态，则明细编辑状态只会是'add',并不需要进行修改，删除的话直接数组中移除即可
			if (this.status !== 'ADD' && this.status !== 'ADD_INCOME' && this.list[index].editState !== 'add') {
				this.list[index].editState = 'update';
			}
		},
		showInput(index, type) {
			for (var i in this.list) {
				this.list[i].isShowDebtorInput = false;
				this.list[i].isShowLenderInput = false;
				this.list[i].isShowMainInput = false;
				this.list[i].isShowSubjectInput = false;
				this.list[i].isShowAuxiItemInput = false;
				if (i == index && type == 'debtor') {
					this.list[index].isShowDebtorInput = true;
				} else if (i == index && type == 'lender') {
					this.list[index].isShowLenderInput = true;
				} else if (i == index && type == 'main') {
					this.list[index].isShowMainInput = true;
				} else if (i == index && type == 'subject') {
					this.list[index].isShowSubjectInput = true;
				} else if (i == index && type == 'auxiItem') {
					this.list[index].isShowAuxiItemInput = true;
				}
				this.changeEntryEditState(index, 'update');
			}
		},
		hideInput(index, type) {
			if (type == 'debtor') {
				//判断是否有小数点
				var inx = this.list[index].jAmount.indexOf('.');
				if (inx != -1 && this.list[index].jAmount.length - 1 != inx) {
					this.list[index].jAmount = (this.list[index].jAmount * 1).toFixed(4);
				}
				this.list[index].isShowDebtorInput = false;
			} else if (type == 'lender') {
				//判断是否有小数点
				var inx = this.list[index].dAmount.indexOf('.');
				if (inx != -1 && this.list[index].dAmount.length - 1 != inx) {
					this.list[index].dAmount = (this.list[index].dAmount * 1).toFixed(4);
				}
				this.list[index].isShowLenderInput = false;
			}
			else if (type == 'main') {
				this.list[index].isShowMainInput = false;
			} else if (type == 'subject') {
				this.list[index].isShowSubjectInput = false;
			} else if (type == 'auxiItem') {
				this.list[index].isShowAuxiItemInput = false;
			}
		},
		voluationInput(index, type, val) {
			if (type == 'main') {
				this.list[index].explanation = val;
				this.list[index].isShowMainInput = false;
			} else if (type == 'subject') {
				this.list[index].accountName = val.name;
				this.list[index].accountID = val.accountID;
				this.list[index].isShowSubjectInput = false;
			} else if (type == 'auxiItem') {
				this.list[index].itemName = val.name;
				this.list[index].itemID = val.itemID;
				this.list[index].isShowAuxiItemInput = false;
			}
			// this.judgeIsAuxiliary();
		},
		keyupEvents(index, e, remaind) {
			if (e.keyCode == 37) {
				//console.log('拦截到37');//左
				this.keyboardEvents('left', index * 5 + remaind);
				return;
			} else if (e.keyCode == 38) {
				//console.log('拦截到38');//上
				this.keyboardEvents('up', index * 5 + remaind);
				return;
			} else if (e.keyCode == 39) {
				//console.log('拦截到39');//右
				this.keyboardEvents('right', index * 5 + remaind);
				return;
			} else if (e.keyCode == 40) {
				//console.log('拦截到40');//下
				this.keyboardEvents('down', index * 5 + remaind);
				return;
			} else if (e.keyCode == 13) {
				//console.log('拦截到13');//enter键
				this.keyboardEvents('enter', index * 5 + remaind);
				return;
			}
			var explanation = this.list[index].explanation;
			var accountName = this.list[index].accountName;
			if (index - 1 >= 0) {
				if (explanation.indexOf('//') != -1 || accountName.indexOf('//') != -1) {
					this.list[index].explanation = this.list[index - 1].explanation;
					this.list[index].accountName = this.list[index - 1].accountName;
					this.list[index].accountID = this.list[index - 1].accountID;
					this.list[index].itemName = this.list[index - 1].itemName;
					this.list[index].itemID = this.list[index - 1].itemID;
					this.list[index].jAmount = this.list[index - 1].jAmount;
					this.list[index].debitList = this.list[index - 1].debitList;
					this.list[index].dAmount = this.list[index - 1].dAmount;
					this.list[index].creditList = this.list[index - 1].creditList;
					this.list[index].auxiliary = this.list[index - 1].auxiliary;
					this.calcDebtorTotal();
					this.calcLenderTotal();
				}
				if (explanation.indexOf('..') != -1) {
					this.list[index].explanation = this.list[index - 1].explanation;
				}
			}
			//判断是否显示辅助核算
			// this.judgeIsAuxiliary();
		},
		keyboardEvents(type, number) {
			var total = this.list.length * 5;
			if (type == 'enter') {
				number++;
			} else if (type == 'left' && number - 1 > 0) {
				number--;
			} else if (type == 'right' && number + 1 <= total) {
				number++;
			} else if (type == 'up' && number - 5 > 0) {
				number = number - 5;
			} else if (type == 'down' && number + 5 <= total) {
				number = number + 5;
			}
			if (type == 'enter' && number > total) {
				this.addList();
			}
			var index = parseInt(number / 5);
			var remaind = number % 5;
			if (remaind == 1) {
				this.showInput(index, 'main');
			} else if (remaind == 2) {
				this.showInput(index, 'subject');
			} else if (remaind == 3) {
				this.showInput(index, 'auxiItem');
			} else if (remaind == 4) {
				this.showInput(index, 'debtor');
			} else if (remaind == 5) {
				this.showInput(index, 'lender');
			} else if (remaind == 0) {
				this.showInput(index - 1, 'lender');
			}
		},
		debtorInputKeyUp(index, e, remaind) {
			if (e.keyCode === 187) {
				// 等于号自动配平
				this.calcDebtorTotal(index);
				this.calcLenderTotal(index);
				var cha = this.voucher.creditTotal - this.voucher.debitTotal;
				if (cha == 0) {
					cha = '';
				}
				this.list[index].jAmount = cha + '';
			} else if (e.keyCode === 32) {
				// 空格借贷交换
				this.list[index].isShowLenderInput = true;
				this.list[index].isShowDebtorInput = false;
				this.list[index].dAmount = this.list[index].jAmount.trim();
				this.list[index].jAmount = '';
				this.list[index].debitList = this.getEmptyAmountList();
				this.list[index].creditList = this.collatingData(this.list[index].dAmount, this.getEmptyAmountList());
				this.calcDebtorTotal();
				this.calcLenderTotal();
				return;
			} else if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 13) {
				this.keyupEvents(index, e, remaind);
				return;
			}
			this.list[index].dAmount = '';
			this.list[index].creditList = this.getEmptyAmountList();
			var debit = this.list[index].jAmount;
			this.list[index].debitList = this.collatingData(debit, this.getEmptyAmountList());
			this.calcDebtorTotal();
			this.calcLenderTotal();
		},
		calcDebtorTotal(index) {
			var debitTotal = 0;
			for (var i in this.list) {
				if (this.list[i].jAmount != null && this.list[i].jAmount != '') {
					if (!(index && index == i)) {
						debitTotal += (this.list[i].jAmount) * 1;
					}
				}
			}
			this.voucher.debitTotal = debitTotal;
			debitTotal = debitTotal + '';
			this.voucher.debitTotalList = this.collatingData(debitTotal, this.getEmptyAmountList());
		},
		lenderInputKeyUp(index, e, remaind) {
			//this.list[index].lender=this.list[index].lender.replace(/\D/g,'');
			if (e.keyCode === 187) {
				this.calcDebtorTotal(index);
				this.calcLenderTotal(index);
				var cha = this.voucher.debitTotal - this.voucher.creditTotal;
				if (cha == 0) {
					cha = '';
				}
				this.list[index].dAmount = cha + '';
			} else if (e.keyCode === 32) {
				this.list[index].isShowDebtorInput = true;
				this.list[index].isShowLenderInput = false;
				this.list[index].jAmount = this.list[index].dAmount.trim();
				this.list[index].dAmount = '';
				this.list[index].creditList = this.getEmptyAmountList();
				this.list[index].debitList = this.collatingData(this.list[index].jAmount, this.getEmptyAmountList());
				this.calcLenderTotal();
				this.calcDebtorTotal();
				return;
			} else if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 13) {
				// 上下左右等移动
				this.keyupEvents(index, e, remaind);
				return;
			}
			this.list[index].jAmount = '';
			this.list[index].debitList = this.getEmptyAmountList();
			var credit = this.list[index].dAmount;
			this.list[index].creditList = this.collatingData(credit, this.getEmptyAmountList());
			this.calcLenderTotal();
			this.calcDebtorTotal();
		},
		calcLenderTotal(index) {
			var creditTotal = 0;
			for (var i in this.list) {
				if (this.list[i].dAmount != null && this.list[i].dAmount != '') {
					if (!(index && index == i)) {
						creditTotal += (this.list[i].dAmount) * 1;
					}
				}
			}
			this.voucher.creditTotal = creditTotal;
			creditTotal = creditTotal + '';
			this.voucher.creditTotalList = this.collatingData(creditTotal, this.getEmptyAmountList());
		},
		addList() {
			this.list.push(this.getEmptyEntry());
		},
		removeList(index) {
			if (this.list[index].editState !== "add") {
				let removeData = Object.assign({}, this.list[index]);
				removeData.editState = 'delete';
				this.removeListData.push(removeData);
			}
			this.list.splice(index, 1);
			this.calcDebtorTotal();
			this.calcLenderTotal();
		},
		collatingData(debtor, debtorList) {
			debtor = debtor.replace(/-/g, '');
			//判断是否有小数点
			if (debtor.indexOf('.') != -1) {
				debtor = (debtor * 1).toFixed(2);
				debtor = (debtor + '').replace(/\./g, '');
			} else {
				debtor = debtor + '00';
			}
			if (debtor.length <= 11) {
				var cha = debtorList.length - debtor.length;
				for (var i = 0; i < debtor.length; i++) {
					debtorList[i + cha] = debtor.charAt(i);
				}
			} else {
				for (var i = 0; i < debtor.length; i++) {
					debtorList[i] = debtor.charAt(i);
				}
			}
			return debtorList;
		},
		checkListData() {
			if ((this.voucher.debitTotal != 0 || this.voucher.creditTotal != 0) && this.voucher.creditTotal * 1 != this.voucher.debitTotal * 1) {
				this.$message.error('凭证借贷不平衡，请检查');
				return false;
			}
			var mainFlag = true;
			var accountFlag = true;
			var amountFlag = true;
			for (var i in this.list) {
				if (i == 'remove') {
					continue;
				}
				if (this.list[i].explanation != null && this.list[i].explanation != '') {
					mainFlag = false;
				}
				if (this.list[i].accountID == null || this.list[i].accountID == '') {
					this.$message.error('第' + (i * 1 + 1) + '行中的会计科目为必填项，请填写了再提交');
					accountFlag = false;
					break;
				}
				if ((this.list[i].jAmount == null || this.list[i].jAmount == '') && (this.list[i].dAmount == null || this.list[i].dAmount == '')) {
					this.$message.error('第' + (i * 1 + 1) + '行中借方金额、贷方金额必须填一个，请填写了再提交');
					amountFlag = false;
					break;
				}
			}
			if (mainFlag) {
				this.$message.error('必须填写一个摘要，请填写了再提交');
				return false;
			}
			return accountFlag && amountFlag;
		},
		back() {
			console.log(this.$store.state.voucherDetail.fromPath);
			this.$router.push({ path: this.$store.state.voucherDetail.fromPath });
		},
		preservation() {
			this.voucher.entryCount = this.list.length;
			let voucherObj = Object.assign({}, this.voucher);
			voucherObj.debitTotalList = null;
			voucherObj.creditTotalList = null;
			let para = {
				fVoucher: JSON.stringify(voucherObj),
				cardData: JSON.stringify(this.list)
			};
			if (this.checkListData()) {
				if (this.status === "ADD_INCOME") {
					para = {
						fVoucher:JSON.stringify(voucherObj),
						cardData:JSON.stringify(this.list),
						fVoucherType:voucherObj.fVoucherType+"",
						ids:this.ids.join(',')
					}
					saveFIncome(para)
						.then((res) => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: "success",
								});
								this.back();
							} else {
								this.$message.error(res.data.msg);
							}
						})
						.catch((data) => {
							util.errorCallBack(data, this.$router, this.$message);
						});
				}
				if (this.status === "ADD") {
					saveFVoucher(para)
						.then((res) => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: "success",
								});
								this.back();
							} else {
								this.$message.error(res.data.msg);
							}
						})
						.catch((data) => {
							util.errorCallBack(data, this.$router, this.$message);
						});
				}
				if (this.status === "EDIT") {
					para.cardData = JSON.stringify(this.list.concat(this.removeListData));
					updateFVoucher(para)
						.then((res) => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: "success",
								});
								this.back();
							} else {
								this.$message.error(res.data.msg);
							}
						})
						.catch((data) => {
							util.errorCallBack(data, this.$router, this.$message);
						});
				}

			}
		},

		getEmptyEntry() {
			var emptyEntry = {
				editState: 'add',
				explanation: '',
				isShowMainInput: false,
				accountID: '',
				accountName: '',
				isShowSubjectInput: false,
				itemID: '',
				itemName: '',
				isShowAuxiItemInput: false,
				jAmount: '',
				debitList: this.getEmptyAmountList(),
				isShowDebtorInput: false,
				dAmount: '',
				creditList: this.getEmptyAmountList(),
				isShowLenderInput: false,
				isAuxiliary: true
			};
			return emptyEntry;
		},
		getEmptyAmountList() {
			return ['', '', '', '', '', '', '', '', 0, 0, 0];
		},
		convertReturnEntry(returnEntry) {
			let entryObj = {};
			entryObj.voucherID = returnEntry.voucherID;
			entryObj.explanation = returnEntry.explanation;
			entryObj.accountID = returnEntry.accountID;
			entryObj.accountName = returnEntry.accountName;
			entryObj.itemID = returnEntry.itemID;
			entryObj.itemName = returnEntry.itemIDTxt;
			entryObj.unitPrice = returnEntry.unitPrice;
			entryObj.entryID = returnEntry.entryID;
			if (returnEntry.dc === 1) {
				entryObj.jAmount = returnEntry.amount + "";
				entryObj.dAmount = '';
				entryObj.debitList = this.collatingData(entryObj.jAmount, this.getEmptyAmountList());
				entryObj.creditList = this.collatingData("0", this.getEmptyAmountList());
			} else if (returnEntry.dc === 0) {
				entryObj.dAmount = returnEntry.amount + "";
				entryObj.jAmount = '';
				entryObj.creditList = this.collatingData(entryObj.dAmount, this.getEmptyAmountList());
				entryObj.debitList = this.collatingData("0", this.getEmptyAmountList());
			}
			// 输入框均为关闭
			entryObj.isShowMainInput = false;
			entryObj.isShowSubjectInput = false;
			entryObj.isShowDebtorInput = false;
			entryObj.isShowLenderInput = false;
			entryObj.isShowAuxiItemInput = false;
			entryObj.isAuxiliary = true;
			return entryObj;
		},
		convertFromCarryForward(returnEntry) {
			let entryObj = {};
			entryObj.explanation = returnEntry.explanation;
			entryObj.accountID = returnEntry.accountID;
			entryObj.accountName = returnEntry.accountIDText;
			entryObj.editState = returnEntry.editState;
			entryObj.itemID = returnEntry.itemID;
			entryObj.itemName = returnEntry.itemIDTxt;
			if (returnEntry.jAmount) {
				entryObj.jAmount = returnEntry.jAmount + "";
				entryObj.dAmount = '';
				entryObj.debitList = this.collatingData(entryObj.jAmount, this.getEmptyAmountList());
				entryObj.creditList = this.collatingData("0", this.getEmptyAmountList());
			} else if (returnEntry.dAmount) {
				entryObj.dAmount = returnEntry.dAmount + "";
				entryObj.jAmount = '';
				entryObj.creditList = this.collatingData(entryObj.dAmount, this.getEmptyAmountList());
				entryObj.debitList = this.collatingData("0", this.getEmptyAmountList());
			}
			// 输入框均为关闭
			entryObj.isShowMainInput = false;
			entryObj.isShowSubjectInput = false;
			entryObj.isShowDebtorInput = false;
			entryObj.isShowLenderInput = false;
			entryObj.isShowAuxiItemInput = false;
			entryObj.isAuxiliary = true;
			return entryObj;
		},
		init() {
			if (this.status === "EDIT") {
				if (this.voucherID === undefined || this.voucherID === null || this.voucherID === "") {
					this.$message.error("数据有误，传入ID为空，请连续管理员！");
					return;
				}
				getById({ voucherID: this.voucherID })
					.then((res) => {
						this.voucher = res.data;
						this.voucher.creditTotalList = this.collatingData(this.voucher.creditTotal + "", this.getEmptyAmountList());
						this.voucher.debitTotalList = this.collatingData(this.voucher.debitTotal + "", this.getEmptyAmountList());
					})
					.catch((data) => {
						util.errorCallBack(data, this.$router, this.$message);
					});
				findFVoucherentryList1({ voucherID: this.voucherID })
					.then((res) => {
						this.list = [];
						for (let i = 0; i < res.data.length; i++) {
							this.list.push(this.convertReturnEntry(res.data[i]));
						}
					})
					.catch((data) => {
						util.errorCallBack(data, this.$router, this.$message);
					});
			} else if (this.status === "ADD_INCOME") {
				// 从收入结转跳转过来，带有完整凭证数据以及需要更新的明细账ID数组IDS
				let voucherEntity = this.$store.state.voucherDetail.voucherEntity;
				this.voucher = voucherEntity.voucher;
				let voucherDebitTotal = 0;
				let voucherCreditTotal = 0;
				for (let i = 0; i < voucherEntity.list.length; i++) {
					this.list.push(this.convertFromCarryForward(voucherEntity.list[i]));
					if (voucherEntity.list[i].jAmount) {
						voucherDebitTotal = NP.plus(voucherDebitTotal, voucherEntity.list[i].jAmount);
					} else if (voucherEntity.list[i].dAmount) {
						voucherCreditTotal = NP.plus(voucherCreditTotal, voucherEntity.list[i].dAmount);
					}
				}
				this.voucher.creditTotal = voucherCreditTotal;
				this.voucher.debitTotal = voucherDebitTotal;
				this.voucher.entryCount = voucherEntity.list.length;
				this.voucher.creditTotalList = this.collatingData(this.voucher.creditTotal + "", this.getEmptyAmountList());
				this.voucher.debitTotalList = this.collatingData(this.voucher.debitTotal + "", this.getEmptyAmountList());
				this.ids = voucherEntity.ids;
			} else {
				this.voucher.fyear = new Date().getFullYear();
				this.voucher.fperiod = new Date().getMonth() + 1;
				this.list = [this.getEmptyEntry(), this.getEmptyEntry(), this.getEmptyEntry(), this.getEmptyEntry()];
			}
			this.isAuxiliary = true;
		},
	},
	updated() {
		//给特定区域添加ID   绑定onmousedown 事件
		var chargeContainer = document.getElementById('chargeContainer');
		var outDiv = chargeContainer.getElementsByClassName('special-elements');
		for (var i = 0; i < outDiv.length; i++) {
			outDiv[i].onmousedown = function (e) {
				//现代浏览器阻止默认事件
				if (e && e.preventDefault)
					e.preventDefault();
				//IE阻止默认事件
				else
					window.event.returnValue = false;
				return false;
			}
		}
	},
	mounted() {
		document.addEventListener('keydown', this.handleEvent);
		// this.mainList = [{ name: '收到现金' }, { name: '收到货款' }, { name: '银行转账' }, { name: '差价' }, { name: '下浮' }];
		this.getAuxiItems();
		this.getAccounts();
		this.init();
	}
}
</script>

<style scoped>
table {
	width: 100%;
	border-spacing: 0;
	border-collapse: collapse;
	padding: 0;
	margin: 0;
}

table td {
	text-align: center;
	table-layout: fixed;
	padding: 0px;
	position: relative;
}

.main-subject {
	position: relative;
	height: 60px;
	line-height: 30px;
	text-align: left;
}

.charge-container {
	padding: 10px;
	font-size: 14px;
	color: #444;
	font-weight: 400;
	background-color: white;
}

.charge {
	width: 1124px;
	margin: auto;
}

.charge-header {
	margin-bottom: 10px;
}

.charge-header>div {
	display: inline-block;
	margin-right: 15px;
}

.tip-box {
	width: 330px;
	padding: 10px;
	position: absolute;
	top: 27px;
	right: -15px;
	z-index: 1005;
	background-color: #fff;
	box-shadow: 0 0 6px rgba(170, 170, 170, .73);
	display: none;
}

.tip-box-table tr {
	height: 25px;
}

.el-icon-info {
	font-size: 18px;
	margin-left: 30px;
	cursor: pointer;
}

.el-icon-info:hover+.tip-box {
	display: inline-block;
}

.el-icon-more {
	position: absolute;
	top: 22px;
	right: 10px;
	z-index: 2;
	color: #666;
	cursor: pointer;
	font-size: 16px;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0px;
	float: left;
	padding: 5px 0;
	margin: 2px 0 0;
	text-align: left;
	list-style: none;
	background-color: #fff;
	background-clip: padding-box;
}

.suggest-list {
	width: 100%;
	height: auto;
	z-index: 1015;
	min-width: inherit;
	display: block;
	overflow: hidden;
	border: none;
	box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
}

.suggest-list .item-list {
	max-height: 375px;
	overflow: auto;
	list-style: none;
	margin: 0px;
	padding: 0px;
}

.item-list li {
	display: flex;
	padding: 0 10px;
	height: 28px;
	line-height: 28px;
	cursor: pointer;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.item-list li:hover {
	background: #ecebeb;
}

.item-list li.hover {
	background: #ecebeb;
}

.charge-table,
.tip-box-table {
	border: 1px solid #bab9b9;
}

.charge-table,
.debtor-tbale,
.lender-tbale>tr {
	height: 60px;
}

.charge-table>tr:first-child {
	height: 50px;
}

.td-auxiliary-dis {
	background-color: #f7f7f7;
}

.auxiliary-accounting {
	height: 60px;
	overflow: auto;
	padding: 15px 0 0 30px;
}

.auxiliary-accounting:before {
	content: "+";
	font-size: 30px;
	color: #4a90e2;
	cursor: pointer;
	padding: 0 11px;
	position: absolute;
	top: 0;
	left: 0;
	line-height: 60px;
}

.auxiliary-single {
	display: flex;
	float: left;
	height: 28px;
	line-height: 28px;
	margin-right: 5px;
	cursor: pointer;
	background: #eee;
	padding: 0 8px;
	border-radius: 2px;
}

.auxiliary-single span {
	max-width: 90px;
	overflow: hidden;
	height: 28px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.auxiliary-single i {
	color: red;
	margin: 8px 0 8px 7px;
	font-size: 10px;
	visibility: hidden;
}

.auxiliary-single:hover i {
	visibility: inherit;
}

.charge-table-icon {
	cursor: pointer;
	display: inline-block;
}

.debtor-lender-table tr td {
	width: 9%;
	border-right: 1px solid #bab9b9;
}

.debtor-lender-table tr td:nth-child(3) {
	border-right-color: rgba(74, 144, 226, .5);
}

.debtor-lender-table tr td:nth-child(6) {
	border-right-color: rgba(74, 144, 226, .5);
}

.debtor-lender-table tr td:nth-child(9) {
	border-right-color: rgba(226, 106, 74, .5);
}

.debtor-lender-table tr td:last-child {
	border-right: none;
}

.tr-negative {
	color: red;
}

.charge-table input,
select {
	width: 100%;
	height: 60px;
}

.charge-table textarea {
	width: 100%;
	height: 60px;
	padding: 9px 14px 9px 10px;
	overflow: auto;
	resize: none;
	border: none;
	border-radius: 0px;
	margin: 0;
	color: #444;
	box-sizing: border-box;
}
</style>
