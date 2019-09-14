<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form :model="searchForm">
        <el-form-item label="状态">
          <el-radio-group v-model="searchForm.status">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">草稿</el-radio>
            <el-radio :label="3">待审核</el-radio>
            <el-radio :label="4">审核通过</el-radio>
            <el-radio :label="5">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select placeholder="请选择" v-model="searchForm.channal_id">
            <el-option label="老衲" value="oldNa"></el-option>
            <el-option label="贫尼" value="qionggui"></el-option>
          </el-select>
        </el-form-item>

        <!-- 
            range-separator：设置中间的分割文字
        -->
        <el-form-item label="时间">
          <el-date-picker
            v-model="searchForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <el-button type="primary">筛选</el-button>
    </div>

    <p>共找到 {{ total }} 条符合条件的内容</p>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="cover.images[0]" label="封面" width="260">
        <template slot-scope="scope">
          <!-- scope.row是它所在的这一行的数据 -->
          <img v-for="item in scope.row.cover.images" width="60" height="60" :src="item" alt />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">修改</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      background：给分页加背景色的样式
      layout 设置这个分页有哪些内容，以及从左到右怎么排列
      :page-size  设置页容量
      :total      设置数据总条数
      总页数不需要设置，它会自动根据总条数和页容量帮你计算出来
    -->
    <el-pagination
      background
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </el-card>
</template>

<script>
import axios from "axios";

export default {
  name: "homearticle",
  data() {
    return {
      searchForm: {
        status: 1,
        channal_id: "",
        date: []
      },

      total: 0,
      // 表格的数据源
      tableData: []
    };
  },

  methods: {
    // 当页码发生改变就调用这个事件
    // 参数就是改变后的页码
    handleCurrentChange(page) {
      // 获取token
      let token = JSON.parse(window.localStorage.getItem("userInfo")).token;
      //改变后的页码是几，就要去查第几页的数据
      axios
        .get("http://ttapi.research.itcast.cn/mp/v1_0/articles", {

          headers: {
            Authorization: `Bearer ${token}`
          },

          params:{
            page,
            per_page:10
          }
        })
        .then(res => {
            // console.log(res);
            this.tableData = res.data.data.results;
        });
    }
  },

  created() {
    //   得到对象
    const res = JSON.parse(window.localStorage.getItem("userInfo"));
    // console.log(res.token);

    axios
      .get("http://ttapi.research.itcast.cn/mp/v1_0/articles", {
        // 设置请求头
        headers: {
          Authorization: `Bearer ${res.token}`
        }
      })
      .then(res => {
        console.log(res);
        this.tableData = res.data.data.results;
        this.total = res.data.data.total_count;
      });
  },

  filters: {
    formatStatus(val) {
      // switch里的判断是全等判断
      // 既要值相等，也要类型相等
      switch (val) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核失败";
        case 4:
          return "已删除";
      }
    }
  }
};
</script>

<style>
</style>