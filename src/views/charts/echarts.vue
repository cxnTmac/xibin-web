<template>
    <section class="chart-container">
        <div v-title data-title="数据图表"></div>
        <el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="chartPie" style="width:100%; height:600px;"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="chartPieAndMapForMonthSalesByProvince" style="width:100%; height:600px;"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="chartLine" style="width:100%; height:400px;"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="chartColumn" style="width:100%; height:400px;"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div id="chartBar" style="width:100%; height:400px;"></div>
                </el-col>
            </el-row>
            
            
            <!-- <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col> -->
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/map/js/china.js'
    import util from '../../common/js/util'
    import '../../assets/theme/echarts-theme/macarons.js'
    import {monthSaleByDate,pieChartAndMapForMonthSaleByProvince, pieChartForCurrentMonthSaleByType} from '../../api/chartsApi';
    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                chartPieAndMapForMonthSalesByProvince:null,
                pieChartData:[],
                provinceSaleData:[],
                daySaleData:[]
            }
        },

        methods: {
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  title: { text: 'Column Chart' },
                  tooltip: {},
                  xAxis: {
                      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                  },
                  yAxis: {},
                  series: [{
                      name: '销量',
                      type: 'bar',
                      data: [5, 20, 36, 10, 10, 20]
                    }]
                });
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title: {
                        text: 'Bar Chart',
                        subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年', '2012年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                });
            },
            convertLineChartData(lineChartData){
                let usefulData = {
                    datex:[],
                    sales:[]
                }
                for(let i = 0;i<lineChartData.length;i++){
                    if(lineChartData[i].datex!== undefined){
                    usefulData.datex.push(lineChartData[i].datex)
                    usefulData.sales.push(lineChartData[i].sales)
                    }
                }
                console.log(usefulData)
                return usefulData
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'),'macarons');
                monthSaleByDate({}).then((res) => {
                    this.daySaleData = res.data
                    let usefulData = this.convertLineChartData(this.daySaleData)
                    this.chartLine.setOption({
                        title: {
                            text: '每日销售额折线图',
                            subtext: '本月',
                            x: 'left'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['销售额']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: usefulData.datex
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '销售额',
                                type: 'line',
                                stack: '总量',
                                data: usefulData.sales
                            }
                        ]
                    });
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            convertPieChartData(pieChartData){
                let usefulData = {
                    legendData:[],
                    seriesData:[]
                }
                for(let i = 0;i<pieChartData.length;i++){
                    usefulData.legendData.push(pieChartData[i].fittingTypeName)
                    usefulData.seriesData.push({
                        value:pieChartData[i].sales,
                        name:pieChartData[i].fittingTypeName
                    })
                }
                return usefulData
            },
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'),'macarons');
                 pieChartForCurrentMonthSaleByType({}).then((res) => {
                    this.pieChartData = res.data;
                    let usefuleData = this.convertPieChartData(this.pieChartData)
                    this.chartPie.setOption({
                    title: {
                        text: '产品分类销售饼图',
                        subtext: '本月',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: usefuleData.legendData
                    },
                    series: [
                        {
                            name: '产品类别',
                            type: 'pie',
                            radius: '80%',
                            center: ['40%', '50%'],
                            data: usefuleData.seriesData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
				}).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            convertProvinceSaleData(provinceSaleData){
                 let usefulData = {
                    legendData:[],
                    seriesData:[]
                }
                for(let i = 0;i<provinceSaleData.length;i++){
                    
                    if(provinceSaleData[i].province === '广西壮族自治区'){
                        usefulData.legendData.push('广西')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'广西'
                        })
                    }else if(provinceSaleData[i].province === '内蒙古自治区'){
                        usefulData.legendData.push('内蒙古')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'内蒙古'
                        })
                    }else if(provinceSaleData[i].province === '西藏自治区'){
                        usefulData.legendData.push('西藏')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'西藏'
                        })
                    }else if(provinceSaleData[i].province === '宁夏回族自治区'){
                        usefulData.legendData.push('宁夏')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'宁夏'
                        })
                    }else if(provinceSaleData[i].province === '新疆维吾尔自治区'){
                        usefulData.legendData.push('新疆')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'新疆'
                        })
                    }else if(provinceSaleData[i].province === '香港特别行政区'){
                        usefulData.legendData.push('香港')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'香港'
                        })
                    }else if(provinceSaleData[i].province === '澳门特别行政区'){
                        usefulData.legendData.push('澳门')
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:'澳门'
                        })
                    }else {
                        usefulData.legendData.push(provinceSaleData[i].province.replace('省','').replace('市',''))
                        usefulData.seriesData.push({
                            value:provinceSaleData[i].sales,
                            name:provinceSaleData[i].province.replace('省','').replace('市','')
                        })
                    }
                }
                return usefulData
            },
            getMaxSales(provinceSaleData){
                let max = 0
                for(let i = 0;i<provinceSaleData.length;i++){
                    if(provinceSaleData[i].sales>max){
                        max = provinceSaleData[i].sales
                    }
                }
                return max
            },
            drawPieAndMapForMonthSalesByProvinceChart(){
                this.chartPieAndMapForMonthSalesByProvince = echarts.init(document.getElementById('chartPieAndMapForMonthSalesByProvince'),'macarons');
                let chart = this.chartPieAndMapForMonthSalesByProvince
                
                pieChartAndMapForMonthSaleByProvince({}).then((res) => {
                    this.provinceSaleData = res.data
                    let maxSales = this.getMaxSales(this.provinceSaleData)
                    let usefulData = this.convertProvinceSaleData(this.provinceSaleData)
                    let option = {
                        title : {
                            text: '全国销售情况',
                            subtext: '本月'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            x:'right',
                            orient: 'vertical',
                            selectedMode:'multible',
                            data:usefulData.legendData
                        },
                        dataRange: {
                            orient: 'horizontal',
                            min: 0,
                            max: maxSales,
                            text:['高','低'],           // 文本，默认为数值文本
                            splitNumber:0
                        },
                        toolbox: {
                            show : true,
                            orient: 'vertical',
                            x:'left',
                            y:'center',
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false}
                            }
                        },
                        series : [
                            {
                                name: '全国销售地图',
                                type: 'map',
                                mapType: 'china',
                                mapLocation: {
                                    x: 'right'
                                },
                                selectedMode : 'false',
                                itemStyle:{
                                    normal:{label:{show:true}},
                                    emphasis:{label:{show:true}}
                                },
                                data:usefulData.seriesData
                            },
                            {
                                name:'全国销售饼图',
                                type:'pie',
                                // roseType : 'area',
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },
                                center: [300, 225],
                                radius: [30, 120],
                                data:usefulData.seriesData
                            }
                        ],
                        animation: true
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
                }).catch((data) => {
                    util.errorCallBack(data,this.$router,this.$message);
                });
            },
            drawCharts() {
                this.drawColumnChart()
                this.drawBarChart()
                this.drawLineChart()
                this.drawPieChart()
                this.drawPieAndMapForMonthSalesByProvinceChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
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
