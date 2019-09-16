<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form :model="searchForm">
        <el-form-item label="状态">
          <el-radio-group v-model="searchForm.status">
            <el-radio label>全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select placeholder="请选择" v-model="searchForm.channal_id">
            <el-option label="全部频道" value></el-option>
            <el-option v-for="item in channelList" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 
            range-separator：设置中间的分割文字
        -->
        <el-form-item label="时间">
          <el-date-picker
            v-model="searchForm.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="search">筛选</el-button>
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
          <el-tag>{{scope.row.status | formatStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">修改</el-button>
          <el-button size="mini" type="danger" @click="doDel(scope.row)">删除</el-button>
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
import JSONbig from "json-bigint";
import axios from "axios";

axios.defaults.baseURL = "https://some-domain.com/api/";

//这个方法里的data就是服务器接口返回的原始数据
//你在这个方法里 return 什么那么你请求时拿到的响应体就是什么
//如果这个方法你什么都不改,那么就代表服务器返回什么,你就拿到什么,并且会自动把JSON转成JS对象
//这个方法可以允许你对你的响应体进行转换,你转换什么返回,那么发请求后拿到的就是什么
axios.defaults.transformResponse = [
  function(data) {
    //我们尝试吧响应体当JSON 转成JS 对象,能转就返回了不能转会报错
    try {

      //如果你能按JSON 转化成对象,那么就转
      return JSONbig.parse(data);
    } catch (error) {

      //如果不能就原样返回
      return data;
    }
}];

export default {
  name: "homearticle",
  data() {
    return {
      searchForm: {
        status: "",
        channal_id: "",
        date: []
      },

      total: 0,
      // 表格的数据源
      tableData: [],
      //频道的数组
      channelList: []
    };
  },
  methods: {
    doDel(row) {
      this.$confirm("请问要真的删除吗?", "是否删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //当点击的是确认就进来

          //发请求
          let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
          //服务器返回的id 精度丢失
          axios
            .delete(
              `http://ttapi.research.itcast.cn/mp/v1_0/articles/${row.id}`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`
                }
              }
            )
            .then(res => {
             
              this.$message.success("删除成功");
               //重新加载这一张数据
              this.loadData(1);
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          //当点击的是取消就进来catch
          this.$message({
            type: "info",
            message: "好孩子，不要删库跑路！O(∩_∩)O哈哈~"
          });
        });
    },

    //筛选的方法
    search() {
      this.loadData(1);
    },

    //当页码发生改变就调用这个事件
    //参数就是改变的页码
    handleCurrentChange(page) {
      this.loadData(page);
    },
    //加载数据的方法
    loadData(page) {
      //   得到对象
      const res = JSON.parse(window.localStorage.getItem("userInfo"));
      // console.log(res.token);

      axios
        .get("http://ttapi.research.itcast.cn/mp/v1_0/articles", {
          // 设置请求头
          headers: {
            Authorization: `Bearer ${res.token}`
          },
          params: {
            status:
              this.searchForm.status == "" ? undefined : this.searchForm.status,
            channal_id:
              this.searchForm.channal_id == ""
                ? undefined
                : this.searchForm.channal_id,
            begin_pubdate: this.searchForm.date[0],
            end_pubdate: this.searchForm.date[1],

            page,
            per_page: 10
          }
        })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data.results;
          this.total = res.data.data.total_count;
        });
    }
  },

  created() {
    //发请求-页码发生改变就调用
    this.loadData(1);

    //发请求-频道
    axios.get("http://ttapi.research.itcast.cn/mp/v1_0/channels").then(res => {
      // console.log(res);
      this.channelList = res.data.data.channels;
    });
  },

  filters: {
    formatStatus(val) {
      //switch 里的判断是全等判断
      //既要值相等,也要类型相等
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
        default:
          return "没有";
      }
    }
  }
};
</script>

<style>
</style>