<template>
  <section class="chart-container">
    <div v-title data-title="省份销售图表"></div>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-date-picker
          v-model="provinceSaleChartTime"
          type="date"
          placeholder="选择时间"
          @change="onTimeChange"
        >
        </el-date-picker>
        <download-excel
          class="export-excel-wrapper"
          :data="excelData"
          :fields="json_fields"
          name="本月分类销售.xls"
        >
          <el-button>导出EXCEL</el-button>
        </download-excel>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div
          id="chartPieAndMapForYearSalesByProvince"
          style="width: 100%; height: 600px"
        ></div>
      </el-col>
      <el-col :span="24">
        <div
          id="chartPieAndMapForMonthSalesByProvince"
          style="width: 100%; height: 600px"
        ></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="chartColumn" style="width: 100%; height: 1500px"></div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import echarts from "echarts";
import "echarts/map/js/china.js";
import util from "../../common/js/util";
import "../../assets/theme/echarts-theme/macarons.js";
import NP from "number-precision";
import {
  pieChartAndMapForMonthSaleByProvince,
  lineChartAndMapForCurrentAndPreMonthSaleByProvince,
} from "../../api/chartsApi";
export default {
  data() {
    return {
      json_fields: {
        产品类别: "fittingTypeName",
        本月销售额: "currentMonthSale",
        本月销售数: "currentMonthNum",
        上月销售额: "preMonthSale",
      },
      chartColumn: null,
      provinceSaleChartTime: new Date(),
      chartPieAndMapForMonthSalesByProvince: null,
      provinceSaleData: [],
      chartPieAndMapForYearSalesByProvince: null,
      provinceSaleDataForYear: [],
      columnChartData: null,
      excelData: null,
    };
  },

  methods: {
    // 把柱状图的数据转化为excel导出的数据
    convertToExcelData(columnChartData) {
      let excelData = [];
      for (let i = 0; i < columnChartData.xAxis.length; i++) {
        let row = {};
        row["fittingTypeName"] = columnChartData.xAxis[i];
        row["currentMonthSale"] = columnChartData.currentMonth[i];
        row["currentMonthNum"] = columnChartData.currentMonthNum[i];
        row["preMonthSale"] = columnChartData.preMonth[i];
        excelData.push(row);
      }
      return excelData;
    },
    convertColumnChartData(columnChartData) {
      let { currentMonth, preMonth } = columnChartData;
      let data = {
        xAxis: [],
        currentMonth: [],
        preMonth: [],
        currentMonthNum: [],
        preMonthNum: [],
      };

      // 找出都有的省份
      let sameCurrentIndex = [];
      let samePreIndex = [];
      for (let i = 0; i < currentMonth.length; i++) {
        for (let j = 0; j < preMonth.length; j++) {
          if (currentMonth[i].province === preMonth[j].province) {
            data.xAxis.push(currentMonth[i].province);
            data.currentMonth.push(currentMonth[i].sales);
            data.preMonth.push(preMonth[j].sales);
            data.currentMonthNum.push(currentMonth[i].outboundNum);
            data.preMonthNum.push(preMonth[j].outboundNum);
            sameCurrentIndex.push(i);
            samePreIndex.push(j);
            break;
          }
        }
      }
      // 处理单独有的省份
      for (let i = 0; i < currentMonth.length; i++) {
        if (sameCurrentIndex.indexOf(i) < 0) {
          data.xAxis.push(currentMonth[i].province);
          data.currentMonth.push(currentMonth[i].sales);
          data.preMonth.push(0);
          data.currentMonthNum.push(currentMonth[i].outboundNum);
          data.preMonthNum.push(0);
        }
      }
      for (let j = 0; j < preMonth.length; j++) {
        if (samePreIndex.indexOf(j) < 0) {
          data.xAxis.push(preMonth[j].province);
          data.currentMonth.push(0);
          data.preMonth.push(preMonth[j].sales);
          data.currentMonthNum.push(0);
          data.preMonthNum.push(preMonth[j].outboundNum);
        }
      }
      return data;
    },
    drawColumnChart() {
      this.chartColumn = echarts.init(
        document.getElementById("chartColumn"),
        "macarons"
      );
      lineChartAndMapForCurrentAndPreMonthSaleByProvince({
        month: this.provinceSaleChartTime,
        preMonth: new Date(
          this.provinceSaleChartTime -
            this.provinceSaleChartTime.getDate() * 1000 * 24 * 60 * 60
        ),
      })
        .then((res) => {
          debugger;
          this.columnChartData = res.data;
          let usefulData = this.convertColumnChartData(this.columnChartData);
          this.excelData = this.convertToExcelData(usefulData);
          this.chartColumn.setOption({
            title: { text: "与上月对比" },
            tooltip: {},
            yAxis: {
              data: usefulData.xAxis,
            },
            legend: {
              data: ["当月", "上月"],
            },
            xAxis: {},
            series: [
              {
                name: "当月",
                type: "bar",
                data: usefulData.currentMonth,
              },
              {
                name: "上月",
                type: "bar",
                data: usefulData.preMonth,
              },
            ],
          });
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    convertProvinceSaleData(provinceSaleData) {
      let usefulData = {
        legendData: [],
        seriesData: [],
      };
      for (let i = 0; i < provinceSaleData.length; i++) {
        if (provinceSaleData[i].province === "广西壮族自治区") {
          usefulData.legendData.push("广西");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "广西",
          });
        } else if (provinceSaleData[i].province === "内蒙古自治区") {
          usefulData.legendData.push("内蒙古");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "内蒙古",
          });
        } else if (provinceSaleData[i].province === "西藏自治区") {
          usefulData.legendData.push("西藏");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "西藏",
          });
        } else if (provinceSaleData[i].province === "宁夏回族自治区") {
          usefulData.legendData.push("宁夏");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "宁夏",
          });
        } else if (provinceSaleData[i].province === "新疆维吾尔自治区") {
          usefulData.legendData.push("新疆");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "新疆",
          });
        } else if (provinceSaleData[i].province === "香港特别行政区") {
          usefulData.legendData.push("香港");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "香港",
          });
        } else if (provinceSaleData[i].province === "澳门特别行政区") {
          usefulData.legendData.push("澳门");
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: "澳门",
          });
        } else {
          usefulData.legendData.push(
            provinceSaleData[i].province.replace("省", "").replace("市", "")
          );
          usefulData.seriesData.push({
            value: provinceSaleData[i].sales,
            name: provinceSaleData[i].province
              .replace("省", "")
              .replace("市", ""),
          });
        }
      }
      return usefulData;
    },
    getMaxSales(provinceSaleData) {
      let max = 0;
      for (let i = 0; i < provinceSaleData.length; i++) {
        if (provinceSaleData[i].sales > max) {
          max = provinceSaleData[i].sales;
        }
      }
      return max;
    },
    drawPieAndMapForMonthSalesByProvinceChart() {
      this.chartPieAndMapForMonthSalesByProvince = echarts.init(
        document.getElementById("chartPieAndMapForMonthSalesByProvince"),
        "macarons"
      );
      let chart = this.chartPieAndMapForMonthSalesByProvince;
      pieChartAndMapForMonthSaleByProvince({
        month: this.provinceSaleChartTime,
      })
        .then((res) => {
          this.provinceSaleData = res.data;
          let maxSales = this.getMaxSales(this.provinceSaleData);
          let usefulData = this.convertProvinceSaleData(this.provinceSaleData);
          let option = {
            title: {
              text: "全国销售情况",
              subtext: "本月",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              x: "right",
              orient: "vertical",
              selectedMode: "multible",
              data: usefulData.legendData,
            },
            dataRange: {
              orient: "horizontal",
              min: 0,
              max: maxSales,
              text: ["高", "低"], // 文本，默认为数值文本
              splitNumber: 0,
            },
            toolbox: {
              show: true,
              orient: "vertical",
              x: "left",
              y: "center",
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
              },
            },
            series: [
              {
                name: "全国销售地图",
                type: "map",
                mapType: "china",
                mapLocation: {
                  x: "right",
                },
                selectedMode: "false",
                itemStyle: {
                  normal: { label: { show: true } },
                  emphasis: { label: { show: true } },
                },
                data: usefulData.seriesData,
              },
              {
                name: "全国销售饼图",
                type: "pie",
                // roseType : 'area',
                tooltip: {
                  trigger: "item",
                  formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                center: [300, 225],
                radius: [30, 120],
                data: usefulData.seriesData,
              },
            ],
            animation: true,
          };
          chart.setOption(option, true);
          // chart.on("mapselectchanged", function (param){
          //     var selected = param.batch['0'].selected;
          //     var mapSeries = option.series[0];
          //     var data = [];
          //     var legendData = [];
          //     var name;
          //     let findFlag = false
          //     for (var p = 0, len = mapSeries.data.length; p < len; p++) {
          //         name = mapSeries.data[p].name;
          //         mapSeries.data[p].selected = selected[name];
          //         if (selected[name]) {
          //             data.push({
          //                 name: name,
          //                 value: mapSeries.data[p].value
          //             });
          //             legendData.push(name);
          //             findFlag = true
          //         }
          //     }
          //     option.series[0]=mapSeries;
          //     option.legend.data = legendData;
          //     option.series[1].data = data;
          //     chart.setOption(option, true);
          // })
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    drawPieAndMapForYearSalesByProvinceChart() {
      this.chartPieAndMapForYearSalesByProvince = echarts.init(
        document.getElementById("chartPieAndMapForYearSalesByProvince"),
        "macarons"
      );
      let chart = this.chartPieAndMapForYearSalesByProvince;
      pieChartAndMapForMonthSaleByProvince({ year: this.provinceSaleChartTime })
        .then((res) => {
          this.provinceSaleDataForYear = res.data;
          let maxSales = this.getMaxSales(this.provinceSaleDataForYear);
          let usefulData = this.convertProvinceSaleData(
            this.provinceSaleDataForYear
          );
          let option = {
            title: {
              text: "全国销售情况",
              subtext: "本年",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              x: "right",
              orient: "vertical",
              selectedMode: "multible",
              data: usefulData.legendData,
            },
            dataRange: {
              orient: "horizontal",
              min: 0,
              max: maxSales,
              text: ["高", "低"], // 文本，默认为数值文本
              splitNumber: 0,
            },
            toolbox: {
              show: true,
              orient: "vertical",
              x: "left",
              y: "center",
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
              },
            },
            series: [
              {
                name: "全国销售地图",
                type: "map",
                mapType: "china",
                mapLocation: {
                  x: "right",
                },
                selectedMode: "false",
                itemStyle: {
                  normal: { label: { show: true } },
                  emphasis: { label: { show: true } },
                },
                data: usefulData.seriesData,
              },
              {
                name: "全国销售饼图",
                type: "pie",
                // roseType : 'area',
                tooltip: {
                  trigger: "item",
                  formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                center: [300, 225],
                radius: [30, 120],
                data: usefulData.seriesData,
              },
            ],
            animation: true,
          };
          chart.setOption(option, true);
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    drawCharts() {
      this.drawPieAndMapForMonthSalesByProvinceChart();
      this.drawPieAndMapForYearSalesByProvinceChart();
      this.drawColumnChart();
    },
    onTimeChange() {
      this.drawCharts();
    },
  },

  mounted: function () {
    this.drawCharts();
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  float: left;
}
/*.chart div {
        height: 400px;
        float: left;
    }*/

.el-col {
  padding: 30px 20px;
}
</style>
