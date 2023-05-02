<template>
  <section class="chart-container">
    <div v-title data-title="产品分类销售图表"></div>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-date-picker
          v-model="pieChartTime"
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
        <div id="chartPie" style="width: 100%; height: 600%"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartPieDay" style="width: 100%; height: 600%"></div>
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
  monthSaleByDate,
  pieChartAndMapForMonthSaleByProvince,
  pieChartForCurrentMonthSaleByType,
  lineChartForCurrentAndPreMonthSaleByType,
} from "../../api/chartsApi";
export default {
  data() {
    return {
      json_fields: {
        产品类别: "fittingTypeName", 
        本月销售额: "currentMonthSale", 
        本月销售数: "currentMonthNum",
        上月销售额: "preMonthSale"
      },
      chartColumn: null,
      chartPie: null,
      chartPieDay: null,
      pieChartData: [],
      pieChartDayData: [],
      pieChartTime: new Date(),
      columnChartData: null,
      excelData:null
    };
  },

  methods: {
    // 把柱状图的数据转化为excel导出的数据
    convertToExcelData(columnChartData){
      let excelData = [];
      for(let i = 0;i<columnChartData.xAxis.length;i++){
        let row  = {};
        row['fittingTypeName'] = columnChartData.xAxis[i];
        row['currentMonthSale'] = columnChartData.currentMonth[i];
        row['currentMonthNum'] = columnChartData.currentMonthNum[i];
        row['preMonthSale'] = columnChartData.preMonth[i];
        excelData.push(row);
      }
      return excelData;
    },
    // 把查询的当月和上月的产品分类销售数据转化为柱状图数据格式
    convertColumnChartData(columnChartData) {
      let { currentMonth, preMonth } = columnChartData;
      let data = {
        xAxis: [],
        currentMonth: [],
        preMonth: [],
        currentMonthNum: [],
        preMonthNum:[]
      };
      let sameCurrentIndex = [];
      let samePreIndex = [];
      for (let i = 0; i < currentMonth.length; i++) {
        for(let j = 0; j<preMonth.length;j++){
          if(currentMonth[i].fittingTypeName === preMonth[j].fittingTypeName){
            data.xAxis.push(currentMonth[i].fittingTypeName);
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
      for(let i = 0; i < currentMonth.length; i++){
        if(sameCurrentIndex.indexOf(i)<0){
          data.xAxis.push(currentMonth[i].fittingTypeName);
          data.currentMonth.push(currentMonth[i].sales);
          data.preMonth.push(0);
          data.currentMonthNum.push(currentMonth[i].outboundNum);
          data.preMonthNum.push(0);
        }
      }
      for(let j = 0; j < preMonth.length; j++){
        if(samePreIndex.indexOf(j)<0){
          data.xAxis.push(preMonth[j].fittingTypeName);
          data.currentMonth.push(0);
          data.preMonth.push(preMonth[j].sales);
          data.currentMonthNum.push(0);
          data.preMonthNum.push(preMonth[j].outboundNum);
        }
      }
      return data;
    },
    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById("chartColumn"),"macarons");
      lineChartForCurrentAndPreMonthSaleByType({
        month: this.pieChartTime,
        preMonth: new Date(this.pieChartTime - this.pieChartTime.getDate()*1000*24*60*60),
      })
        .then((res) => {
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
    convertPieChartData(pieChartData) {
      let usefulData = {
        legendData: [],
        seriesData: [],
        totalSale: 0,
      };
      let totalSale = 0;
      for (let i = 0; i < pieChartData.length; i++) {
        usefulData.legendData.push(pieChartData[i].fittingTypeName);
        usefulData.seriesData.push({
          value: pieChartData[i].sales,
          name: pieChartData[i].fittingTypeName,
        });
        totalSale = NP.plus(
          totalSale,
          pieChartData[i].sales ? pieChartData[i].sales : 0
        );
      }
      usefulData.totalSale = totalSale;
      return usefulData;
    },
    drawPieChartDay() {
      this.chartPieDay = echarts.init(
        document.getElementById("chartPieDay"),
        "macarons"
      );
      pieChartForCurrentMonthSaleByType({ day: this.pieChartTime })
        .then((res) => {
          this.pieChartDayData = res.data;
          let usefuleData = this.convertPieChartData(this.pieChartDayData);
          this.chartPieDay.setOption({
            title: {
              text: "产品分类销售饼图",
              subtext: "单日销售:" + usefuleData.totalSale,
              x: "left",
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            legend: {
              orient: "vertical",
              left: "right",
              data: usefuleData.legendData,
            },
            series: [
              {
                name: "产品类别",
                type: "pie",
                radius: "80%",
                center: ["40%", "50%"],
                data: usefuleData.seriesData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          });
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    drawPieChart() {
      this.chartPie = echarts.init(
        document.getElementById("chartPie"),
        "macarons"
      );
      pieChartForCurrentMonthSaleByType({ month: this.pieChartTime })
        .then((res) => {
          this.pieChartData = res.data;
          let usefuleData = this.convertPieChartData(this.pieChartData);
          this.chartPie.setOption({
            title: {
              text: "产品分类销售饼图",
              subtext: "单月销售:" + usefuleData.totalSale,
              x: "left",
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            legend: {
              orient: "vertical",
              left: "right",
              data: usefuleData.legendData,
            },
            series: [
              {
                name: "产品类别",
                type: "pie",
                radius: "80%",
                center: ["40%", "50%"],
                data: usefuleData.seriesData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          });
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    drawCharts() {
      this.drawPieChart();
      this.drawPieChartDay();
      this.drawColumnChart();
    },
    onTimeChange(){
      this.drawCharts();
    }
  },

  mounted: function () {
    this.drawCharts();
  }
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
