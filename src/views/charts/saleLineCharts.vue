<template>
  <section class="chart-container">
      
    <div v-title data-title="销售曲线图表"></div>
    
    <el-row :gutter="20">
      <el-col :span="24">
          <el-date-picker
          v-model="lineChartTime"
          type="date"
          placeholder="选择时间"
          @change="onTimeChange"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div id="chartLine" style="width: 100%; height: 400px"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartLineForYear" style="width: 100%; height: 400px"></div>
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
  yearSaleByMonth,
  pieChartAndMapForMonthSaleByProvince,
  pieChartForCurrentMonthSaleByType,
} from "../../api/chartsApi";
export default {
  data() {
    return {
      lineChartTime:new Date(),
      chartLine: null,
      daySaleData: [],
      chartLineForYear: null,
      monthSaleData: [],
    };
  },

  methods: {
    convertLineChartData(lineChartData) {
      let usefulData = {
        datex: [],
        sales: [],
      };
      for (let i = 0; i < lineChartData.length; i++) {
        if (lineChartData[i].datex !== undefined) {
          usefulData.datex.push(lineChartData[i].datex);
          usefulData.sales.push(lineChartData[i].sales);
        }
      }
      return usefulData;
    },
    drawLineChart() {
      this.chartLine = echarts.init(
        document.getElementById("chartLine"),
        "macarons"
      );
      monthSaleByDate({month: this.lineChartTime})
        .then((res) => {
          this.daySaleData = res.data;
          let usefulData = this.convertLineChartData(this.daySaleData);
          this.chartLine.setOption({
            title: {
              text: "每日销售曲线图",
              subtext: "每日",
              x: "left",
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: ["销售额"],
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: usefulData.datex,
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                name: "销售额",
                type: "line",
                stack: "总量",
                data: usefulData.sales,
              },
            ],
          });
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    drawLineChartForYear() {
      this.chartLineForYear = echarts.init(
        document.getElementById("chartLineForYear"),
        "macarons"
      );
      yearSaleByMonth({year: this.lineChartTime})
        .then((res) => {
          this.monthSaleData = res.data;
          let usefulData = this.convertLineChartData(this.monthSaleData);
          this.chartLineForYear.setOption({
            title: {
              text: "每月销售曲线图",
              subtext: "每月",
              x: "left",
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: ["销售额"],
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: usefulData.datex,
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                name: "销售额",
                type: "line",
                stack: "总量",
                data: usefulData.sales,
              },
            ],
          });
        })
        .catch((data) => {
          util.errorCallBack(data, this.$router, this.$message);
        });
    },
    drawCharts() {
      this.drawLineChart();
      this.drawLineChartForYear();
    },
    onTimeChange(){
    this.drawCharts();
  }
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
