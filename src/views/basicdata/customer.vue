<template>
  <section>
    <div v-title data-title="客户/供应商"></div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters" ref="queryForm">
        <el-row :gutter="0">
          <el-form-item label="客户编码" prop="customerCode">
            <el-input v-model="filters.customerCode" placeholder="客户编码"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="filters.customerName" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-button type="primary" class="el-icon-caret-bottom" v-on:click="showMoreConditionHandler"></el-button>
          <el-button type="danger" style="float: right" @click="reset">重置</el-button>
          <el-button type="primary" style="float: right" v-on:click="getRecords">查询</el-button>
        </el-row>
        <transition name="el-zoom-in-top">
          <el-row :gutter="0" v-if="showMoreQueryCondition"> </el-row>
        </transition>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="records" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" stripe
      style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="id" width="80"> </el-table-column>
      <el-table-column prop="customerCode" label="客户编码" width="200">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="200">
      </el-table-column>
      <el-table-column prop="province" label="省" width="200">
      </el-table-column>
      <el-table-column prop="city" label="市" width="200"> </el-table-column>
      <el-table-column prop="county" label="区/县" width="200">
      </el-table-column>
      <el-table-column prop="customerType" label="客户类型" width="200">
      </el-table-column>
      <el-table-column prop="customerAddress" label="详细地址" width="200">
      </el-table-column>
      <el-table-column prop="customerEmail" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="contactName" label="联系人姓名" width="200">
      </el-table-column>
      <el-table-column prop="contactTel" label="联系人电话" width="200">
      </el-table-column>
      <el-table-column prop="contactEmail" label="联系人邮箱" width="200">
      </el-table-column>
      <el-table-column prop="lng" label="经度" width="200"> </el-table-column>
      <el-table-column prop="lat" label="纬度" width="200"> </el-table-column>
      <el-table-column prop="remark" label="备注" width="400">
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="350">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handlePrintLabel(scope.$index, scope.row)">标签打印</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button
            size="small"
            @click="handleAddBalance(scope.$index, scope.row)"
            >设置关联科目年初余额</el-button
          > -->
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length === 0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total"
        style="float: right">
      </el-pagination>
    </el-col>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="客户编码" prop="customerCode">
              <el-input v-model="addForm.customerCode" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="addForm.customerName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="电话" prop="customerTel">
              <el-input v-model="addForm.customerTel" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="E-mail" prop="customerEmail">
              <el-input v-model="addForm.customerEmail" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="客户类别" prop="customerType">
              <el-checkbox-group v-model="addForm.customerType">
                <el-checkbox-button label="供应商" name="customerType"></el-checkbox-button>
                <el-checkbox-button label="销售客户" name="customerType"></el-checkbox-button>
                <el-checkbox-button label="经销商" name="customerType"></el-checkbox-button>
                <el-checkbox-button label="修理厂" name="customerType"></el-checkbox-button>
                <el-checkbox-button label="物流公司" name="customerType"></el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="付款类别" prop="paymentCategory">
              <el-select v-model="addForm.paymentCategory" placeholder="请选择">
                <el-option v-for="item in BD_CUSTOMER_PAYMENT_CATEGORY" :key="item.code" :label="item.name"
                  :value="item.code">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code
                    }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col></el-row>
        <el-row :gutter="0">
          <el-col :span="10">
            <el-form-item label="省市区" prop="remark">
              <el-cascader :options="options" v-model="selectedAddFormLocationOptions"
                @change="handleAddFormLocationChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="地址" prop="customerAddress">
              <el-input v-model="addForm.customerAddress" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="联系人名称" prop="contactName">
              <el-input v-model="addForm.contactName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="contactTel">
              <el-input v-model="addForm.contactTel" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人E-mail" prop="contactEmail">
              <el-input v-model="addForm.contactEmail" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-input v-model="addForm.customerType" auto-complete="off"></el-input>-->
        <!--<el-input type="hidden" v-model="addForm.province" auto-complete="off"></el-input>-->
        <!--<el-input type="hidden" v-model="addForm.city" auto-complete="off"></el-input>-->
        <!--<el-input type="hidden" v-model="addForm.county" auto-complete="off"></el-input>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-tabs v-model="editFormActiveName" @tab-click="tabClick">
        <el-tab-pane label="客户信息" name="first">
          <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="客户编码" prop="customerCode">
                  <el-input v-model="editForm.customerCode" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户名称" prop="customerName">
                  <el-input v-model="editForm.customerName" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="电话" prop="customerTel">
                  <el-input v-model="editForm.customerTel" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="E-mail" prop="customerEmail">
                  <el-input v-model="editForm.customerEmail" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="24">
                <el-form-item label="客户类别" prop="customerType">
                  <el-checkbox-group v-model="editForm.customerType">
                    <el-checkbox-button label="供应商" name="customerType"></el-checkbox-button>
                    <el-checkbox-button label="销售客户" name="customerType"></el-checkbox-button>
                    <el-checkbox-button label="经销商" name="customerType"></el-checkbox-button>
                    <el-checkbox-button label="修理厂" name="customerType"></el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="付款类别" prop="paymentCategory">
                  <el-select v-model="editForm.paymentCategory" placeholder="请选择">
                    <el-option v-for="item in BD_CUSTOMER_PAYMENT_CATEGORY" :key="item.code" :label="item.name"
                      :value="item.code">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code
                        }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col></el-row>
            <el-row :gutter="0">
              <el-col :span="10">
                <el-form-item label="省市区" prop="remark">
                  <el-cascader :options="options" v-model="selectedEditFormLocationOptions"
                    @change="handleEditFormLocationChange">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="地址" prop="customerAddress">
                  <el-input v-model="editForm.customerAddress" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="联系人名称" prop="contactName">
                  <el-input v-model="editForm.contactName" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="联系人电话" prop="contactAddress">
                  <el-input v-model="editForm.contactTel" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人E-mail" prop="customerEmail">
                  <el-input v-model="editForm.contactEmail" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="收货人" prop="consigneeName">
                  <el-input v-model="editForm.consigneeName" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收货电话" prop="consigneePhone">
                  <el-input v-model="editForm.consigneePhone" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="12">
                <el-form-item label="收货地址" prop="consigneeAddress">
                  <el-input v-model="editForm.consigneeAddress" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收货单位" prop="consigneeCompany">
                  <el-input v-model="editForm.consigneeCompany" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!--<el-input type="hidden" v-model="editForm.province" auto-complete="off"></el-input>-->
            <!--<el-input type="hidden" v-model="editForm.city" auto-complete="off"></el-input>-->
            <!--<el-input type="hidden" v-model="editForm.county" auto-complete="off"></el-input>-->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="位置信息" name="second">
          <!-- <baidu-map :scroll-wheel-zoom="true"  :center="{lng:0,lat:0}" :zoom="3" @ready="handler" class="map"> </baidu-map> -->
          <el-input v-model="addressKeyword" placeholder="请输入地址来直接查找相关位置"></el-input>
          <baidu-map :scroll-wheel-zoom="true" :center="location" :zoom="zoom" @click="getLocationPoint"
            @ready="mapHandler" ak="B8rPYxxiwZXHqylhc7XK1u0phwQAo7gI">
            <bm-view style="width: 100%; height: 500px; flex: 1"></bm-view>
            <bm-local-search :keyword="addressKeyword" :auto-viewport="true" style="display: none"></bm-local-search>
            <bm-marker :position="markerPo" :dragging="true" :title="storeName" :zIndex="999999999"
              @click="infoWindowOpen" @dragend="dragend">
              <bm-info-window :show="isShowInfo" @close="infoWindowClose" @open="infoWindowOpen">{{ address
                }}</bm-info-window>
            </bm-marker>
          </baidu-map>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置关联科目期初余额" :visible.sync="courseAuxilaryBalanceFormVisible" :close-on-click-modal="false">
      <el-form :model="courseAuxilaryBalanceForm" label-width="80px" :rules="courseAuxilaryBalanceFormRules"
        ref="courseAuxilaryBalanceForm">
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="关联科目" prop="courseNo">
              <el-select v-model="courseAuxilaryBalanceForm.courseNo" placeholder="请选择">
                <el-option v-for="item in cusCourse" :key="item.code" :label="item.name" :value="item.code">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
      item.code
    }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年初余额" prop="balance">
              <el-input-number v-model="courseAuxilaryBalanceForm.balance" auto-complete="off"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-input v-model="addForm.customerType" auto-complete="off"></el-input>-->
        <!--<el-input type="hidden" v-model="addForm.province" auto-complete="off"></el-input>-->
        <!--<el-input type="hidden" v-model="addForm.city" auto-complete="off"></el-input>-->
        <!--<el-input type="hidden" v-model="addForm.county" auto-complete="off"></el-input>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="courseAuxilaryBalanceFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addBalanceSubmit" :loading="addBalanceLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--打印标签界面-->
    <el-dialog title="打印标签" :visible.sync="printLabelFormVisible" :close-on-click-modal="false">
      <el-form :model="printLabelForm" label-width="80px" ref="printLabelForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="标签城市" prop="labelCity">
              <el-input v-model="printLabelForm.labelCity" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标签收货人" prop="labelName">
              <el-input v-model="printLabelForm.labelName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click.native="saveLabel">保存当前方案</el-button>
            <el-button type="primary" @click.native="printLabel">打印标签</el-button>
          </el-col>
        </el-row>
      </el-form>

    </el-dialog>
  </section>
</template>

<script>
const xibinLng = 118.625626;
const xibinLat = 24.794916;
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getCustomerListPage,
  saveCustomer,
  removeCustomer,
  addCustomerCourseAuxiliaryBlance,
} from "../../api/customerApi";
import NProgress from "nprogress";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
var codemaster = require("../../../static/codemaster.json");
var config = require("../../../static/config.json");
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmView from "vue-baidu-map/components/map/MapView.vue";
import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch.vue";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
import BmInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
export default {
  components: {
    BaiduMap,
    BmView,
    BmLocalSearch,
    BmMarker,
    BmInfoWindow,
  },
  data() {
    return {
      // 百度地图
      baiduMap: null,
      location: { lng: xibinLng, lat: xibinLat },
      zoom: 18,
      addressKeyword: "",
      storeName: "",
      markerPo: { lng: xibinLng, lat: xibinLat },
      isShowInfo: false,
      markerIcon: "static/logo/LOGO108.png", //标注图片
      // markerIcon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
      //   scale: 0.6, //图标缩放大小
      //   fillColor: json.signal, //填充颜色
      //   fillOpacity: 1, //填充透明度
      // }),
      address: "",
      editFormActiveName: "first",
      showMoreQueryCondition: false,
      options: regionData,
      selectedAddFormLocationOptions: [],
      selectedEditFormLocationOptions: [],
      filters: {
        customerCode: "",
        customerName: "",
        customerType: "",
        status: "",
        province: "",
        city: "",
        county: "",
      },
      records: [],
      currentRow: {},
      total: 0,
      page: 1,
      size: 10,
      listLoading: false,
      loading: true,
      sels: [], //列表选中列

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        customerCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
          {
            min: 2,
            max: 64,
            message: "长度在 2 到 10 个字符",
          },
        ],
        customerName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
          },
        ],
        customerEmail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change",
          },
        ],
        contactEmail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change",
          },
        ],
      },
      //新增界面数据
      addForm: {
        id: 0,
        customerCode: "",
        customerName: "",
        customerType: [],
        status: "",
        province: "",
        city: "",
        county: "",
        customerTel: "",
        customerAddress: "",
        customerEmail: "",
        contactName: "",
        contactEmail: "",
        contactTel: "",
        paymentCategory: "",
        remark: "",
      },

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        customerCode: [
          { required: true, message: "请选择关联科目", trigger: "blur" },
        ],
        customerName: [
          { required: true, message: "请输入年初余额", trigger: "blur" },
        ],
      },
      //编辑界面数据
      editForm: {
        id: 0,
        customerCode: "",
        customerName: "",
        customerType: [],
        status: "",
        province: "",
        city: "",
        county: "",
        lng: null,
        lat: null,
        customerTel: "",
        customerAddress: "",
        customerEmail: "",
        contactName: "",
        contactEmail: "",
        contactTel: "",
        consigneeName: "",
        consigneeAddress: "",
        consigneePhone: "",
        consigneeCompany: "",
        paymentCategory: "",
        remark: "",
      },
      courseAuxilaryBalanceFormVisible: false,
      addBalanceLoading: false,
      courseAuxilaryBalanceFormRules: {
        courseNo: [{ required: true, message: "请输入编码", trigger: "blur" }],
      },
      courseAuxilaryBalanceForm: {
        courseNo: "",
        balance: 0,
      },
      printLabelForm: {
        labelName: '',
        labelCity: ''
      },
      printLabelFormVisible: false,
      cusCourse: codemaster.FI_CUS_COURSE,
      BD_CUSTOMER_PAYMENT_CATEGORY: codemaster.BD_CUSTOMER_PAYMENT_CATEGORY
    };
  },
  watch: {
    selectedAddFormLocationOptions: function (val) {
      if (val !== null && val !== "" && val.length >= 3) {
        this.addForm.province = CodeToText[val[0]];
        this.addForm.city = CodeToText[val[1]];
        this.addForm.county = CodeToText[val[2]];
      } else {
        this.addForm.province = "";
        this.addForm.city = "";
        this.addForm.county = "";
      }
    },
    selectedEditFormLocationOptions: function (val) {
      if (val !== null && val !== "" && val.length >= 3) {
        this.editForm.province = CodeToText[val[0]];
        this.editForm.city = CodeToText[val[1]];
        this.editForm.county = CodeToText[val[2]];
      } else {
        this.editForm.province = "";
        this.editForm.city = "";
        this.editForm.county = "";
      }
    },
  },
  methods: {
    handlePrintLabel(index, row) {
      this.printLabelFormVisible = true;
      this.currentRow = Object.assign({}, row);
      this.printLabelForm.labelName = this.currentRow.labelName;
      this.printLabelForm.labelCity = this.currentRow.labelCity;
    },
    saveLabel() {
      let para = Object.assign({}, this.currentRow);
      para.labelName = this.printLabelForm.labelName;
      para.labelCity = this.printLabelForm.labelCity;
      saveCustomer({ customer: JSON.stringify(para) })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.printLabelFormVisible = false;
          this.getRecords();
        })
        .catch((data) => {
          this.editLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    printLabel() {
      let user = JSON.parse(localStorage.getItem("user"));
      window.open(
        config.reportUrl +
        "customerLabel?companyId=" +
        user.companyId +
        "&customerCode=" +
        this.currentRow.customerCode +
        "&labelName=" +
        this.printLabelForm.labelName +
        "&labelCity=" +
        this.printLabelForm.labelCity
      );
    },
    mapHandler({ BMap, map }) {
      this.baiduMap = map;
    },
    tabClick(tab) {
      if (tab.name === "second") {
        console.log("显示百度地图");
      }
    },
    reset() {
      this.$refs["queryForm"].resetFields();
    },
    showMoreConditionHandler: function () {
      this.showMoreQueryCondition = !this.showMoreQueryCondition;
    },
    handleAddFormLocationChange(val) {
      console.log(val);
    },
    handleEditFormLocationChange(val) {
      console.log(val);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRecords();
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      console.log(row);
      let _this = this;
      this.editFormVisible = true;
      this.currentRow = row;
      this.editForm = Object.assign({}, row);
      this.markerPo.lng = this.editForm.lng;
      this.markerPo.lat = this.editForm.lat;
      // ！！！！重要 地图初始化后 需要主动拖拽地图才会让marker跳到正确位置，所以使用 setTimeout来触发这个动作
      if (this.baiduMap !== null) {
        setTimeout(() => {
          this.baiduMap.zoomTo(17);
          this.baiduMap.panTo(
            new BMap.Point(this.markerPo.lng, this.markerPo.lat)
          );

        }, 200);
      } else {
        // 第一次打开对话框无法获取到baiduMap对象（地图尚未初始化）,所以用更新坐标替代
        this.location.lng = this.markerPo.lng;
        this.location.lat = this.markerPo.lat;
      }
      // ！！！！重要 地图初始化后 需要主动拖拽地图才会让marker跳到正确位置，所以使用 setTimeout来触发这个动作
      this.editForm.customerType = row.customerType.split(",");
      if (
        this.editForm.province !== "" &&
        this.editForm.city !== "" &&
        this.editForm.county !== ""
      ) {
        this.selectedEditFormLocationOptions = [
          TextToCode[this.editForm.province].code,
          TextToCode[this.editForm.province][this.editForm.city].code,
          TextToCode[this.editForm.province][this.editForm.city][
            this.editForm.county
          ].code,
        ];
      } else if (this.editForm.province !== "" && this.editForm.city !== "") {
        this.selectedEditFormLocationOptions = [
          TextToCode[this.editForm.province].code,
          TextToCode[this.editForm.province][this.editForm.city].code,
        ];
      } else if (this.editForm.province !== "") {
        this.selectedEditFormLocationOptions = [
          TextToCode[this.editForm.province].code,
        ];
      } else {
        this.selectedEditFormLocationOptions = [];
      }
    },
    handleAddBalance: function (index, row) {
      this.courseAuxilaryBalanceFormVisible = true;
      this.currentRow = row;
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.selectedAddFormLocationOptions = [];
      this.addForm = {
        id: 0,
        customerCode: "",
        customerName: "",
        customerType: [],
        status: "",
        province: "",
        city: "",
        county: "",
        customerTel: "",
        customerAddress: "",
        customerEmail: "",
        contactName: "",
        contactEmail: "",
        contactTel: "",
        remark: "",
      };
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.listLoading = true;
        NProgress.start();
        let para = { id: row.id, customerCode: row.customerCode };
        removeCustomer(para)
          .then((res) => {
            this.listLoading = false;
            NProgress.done();
            this.getRecords();
          })
          .catch((data) => {
            this.listLoading = false;
            util.errorCallBack(data, this.$router, this.$message);
          });
      });
    },
    addBalanceSubmit: function () {
      let _this = this;
      this.$refs.courseAuxilaryBalanceForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addBalanceLoading = true;
            //NProgress.start();
            addCustomerCourseAuxiliaryBlance({
              customerCode: this.currentRow.customerCode,
              balance: this.courseAuxilaryBalanceForm.balance,
              courseNo: this.courseAuxilaryBalanceForm.courseNo,
            })
              .then((res) => {
                this.addBalanceLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["courseAuxilaryBalanceForm"].resetFields();
                this.courseAuxilaryBalanceFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.addBalanceLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    //编辑
    editSubmit: function () {
      let _this = this;
      this.editForm.lng = this.markerPo.lng;
      this.editForm.lat = this.markerPo.lat;
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.customerType = util.arrayToString(this.editForm.customerType);
            saveCustomer({ customer: JSON.stringify(para) })
              .then((res) => {
                this.editLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.editLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    //新增
    addSubmit: function () {
      let _this = this;
      this.addForm["lng"] = this.markerPo.lng;
      this.addForm["lat"] = this.markerPo.lat;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;

            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.customerType = util.arrayToString(this.addForm.customerType);
            saveCustomer({ customer: JSON.stringify(para) })
              .then((res) => {
                this.addLoading = false;
                //NProgress.done();
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
                _this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getRecords();
              })
              .catch((data) => {
                this.addLoading = false;
                util.errorCallBack(data, this.$router, this.$message);
              });
          });
        }
      });
    },
    //获取用户列表
    getRecords() {
      let para = {
        page: this.page,
        size: this.size,
        conditions: JSON.stringify(this.filters),
      };
      this.listLoading = true;
      //NProgress.start();
      getCustomerListPage(para)
        .then((res) => {
          this.total = res.data.size;
          this.records = res.data.list;
          this.listLoading = false;
          //NProgress.done();
        })
        .catch((data) => {
          this.listLoading = false;
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },

    // 百度地图
    getLocationPoint: function (e) {
      this.markerPo = e.point;
      console.log(e.point);
      // this.lng = e.point.lng;
      // this.lat = e.point.lat;
      // /* 创建地址解析器的实例 */
      // let geoCoder = new BMap.Geocoder();
      // /* 获取位置对应的坐标 */
      // geoCoder.getPoint(this.addressKeyword, (point) => {
      //   this.selectedLng = point.lng;
      //   this.selectedLat = point.lat;
      // });
      // /* 利用坐标获取地址的详细信息 */
      // geocoder.getLocation(e.point, (res) => {
      //   console.log(res);
      // });
    },
    infoWindowOpen() {
      //弹框打开

      this.isShowInfo = true;
    },
    infoWindowClose() {
      //弹框关闭

      this.isShowInfo = false;
    },
    dragend(val) {
      //标注拖拽完成获取坐标信息

      this.markerPo = val.point;

      let geocoder = new BMap.Geocoder(); //创建地址解析器的实例

      geocoder.getLocation(val.point, (rs) => {
        this.address = rs.address;
      });
      console.log(this.address);
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
  },
  mounted() {
    this.getRecords();
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>
