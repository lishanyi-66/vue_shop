<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      // 配置选项
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#e9eef3",
            },
          },
        },
        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        xAxis: {
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      },
    };
  },
  // 初始化完毕
  created() {},
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 获取数据
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据失败");
    }
    console.log(res.data);

    // 准备配置项
    const result = _.merge(res.data, this.option);
    myChart.setOption(result);
  },
};
</script>