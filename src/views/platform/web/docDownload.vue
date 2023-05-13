<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <el-tabs @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in common.docKindList" :label="item.Label"  :key="index"></el-tab-pane>
      </el-tabs>
      <el-table
        ref="refElTabel"
        tooltip-effect="light"
        :data="newsListTable"
        border
        style="width: 100%"
      >
        <el-table-column prop="Id" label="ID" width="50"></el-table-column>
        <el-table-column prop="Title" label="资料名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span
              class="color-1f85aa font-w6 cursor"
              @click="openMoreOperationDialog(scope.$index, scope.row)"
            >{{scope.row.Title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否公共" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.Platform==0">总部发布</span>
            <span v-else>本校私有</span>
          </template>
        </el-table-column>
        <el-table-column label="保密级别" width="100">
          <template slot-scope="scope">
            <span>{{common.FormatSelect(common.docRights,scope.row.Right)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Creattime" :formatter="TimeFormatter" label="发布时间" width="130"></el-table-column>
        <el-table-column prop="AuthorLabel" label="发布人" width="100"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteNewsRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="between-center m-v-15">
        <el-button type="primary" @click="newsAdd">添加资料</el-button>
        <el-pagination
          background
          @current-change=" currentPageChange"
          :current-page.sync="nowPage"
          :page-size="rows"
          layout="total,prev, pager, next, jumper"
          :total="allRows"
        ></el-pagination>
      </div>
    </div>
    <!-- 弹出框 -->
    <div>
      <my-dialog title="资料详情编辑" :showLeft="false" :visible.sync="moreOperationDialog">
        <div slot="right_content">
          <docFormData
            ref="newsForm"
            :college="currentKind"
            :platform="currentPlatform"
            :formItemData="currentRowData"
            @updateRowData="updateNewsList"
          ></docFormData>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
import docFormData from "@/views/platform/web/component/docFormData";
import { getDocument, deleNewsRow } from "@/api/news";
export default {
  name: "newsList",
  components: {
    myDialog,
    docFormData
  },
  data() {
    return {
      common,
      currentKind: 0,
      // 资料的数据列表
      newsListTable: [],
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 30,
      // 更多操作弹框展示
      moreOperationDialog: false,
      // 模态框获得的单条数据
      currentRowData: null,
      currentPlatform: 0,
      // 模态框获得的单条数据
      currentRowData: {},
      // 当前索引
      currentNewsIndex: null
    };
  },

  methods: {
    handleClick(item) {
      
    
      if (item==null) {
         this.currentKind  =this.common.docKindList[0].value;
      }else{
         this.currentKind  = this.common.docKindList[item.index].value;
      } 
      // this.currentKind = 0;
      // let selectIndex = 0;
      // if (item != null) {
      //   selectIndex = item.index;
      // }
      // let collegeItem = this.$store.getters.app.collegeWithCourseKind[
      //   selectIndex
      // ];
      // if (collegeItem) { 
      // }
      this.getNewsList();
    },
    // 获取资料的数据列表
    async getNewsList() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let newParams = {
        kind_id:this.currentKind, 
        needPublic: true,
        content: 1,
        limit: this.rows,
        offset: offsetRow
      };
      let res = await getDocument(this.currentPlatform, newParams);
      if (res.code == 200) {
        this.newsListTable = [];
        if (res.data) {
          this.newsListTable = res.data;
        }
        this.allRows = res.title;
      }
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getNewsList();
    },
    // 删除资料数据
    deleteNewsRow: function(index, row) {
      this.$confirm("你确定要删除吗？删了之后找不回来哦", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.currentNewsIndex = index;
          let res = await deleNewsRow(row.Id);
          if (res.code == 200) {
            this.getNewsList();
            this.$message({
              message: "删除成功 ",
              type: "success"
            });
          }
        })
        .catch(() => {});
    },
    // 打开编辑弹窗获取用户数据
    editNewsRow(index, row) {
      this.moreOperationDialog = true;
      this.currentNewsIndex = index;
      this.currentRowData = row;
    },
    // 显示列表的时候格式化时间
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, 2);
    },
    // 点击新增资料
    newsAdd() {
      this.moreOperationDialog = true;
      this.currentRowData = {
        icon: "/upload/icon/defaultnews.png",
        Id: 0,
        Downfile: "",
        Title: "",
        Description: "",
        Content: "",
        KindID: this.currentKind,
        Platform: this.currentPlatform
      };
    },
    // 编辑或者添加之后更新表格数据-资料列表
    updateNewsList(rowData, isType) {
      // isType编辑还是添加
      if (isType == 1) {
        this.$set(this.newsListTable, this.currentNewsIndex, rowData);
      } else if (isType == 0) {
        this.newsListTable.push(rowData);
      }
      this.moreOperationDialog = false;
    },
    // 打开更多操作的弹出框
    openMoreOperationDialog(index, row) {
      this.currentTeacherIndex = index;
      this.currentRowData = row;

      this.moreOperationDialog = true;
    }
  },

  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = parseInt(paths[paths.length - 1]);
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    this.$nextTick(() => {
      this.handleClick(null);
    }); 
  }
};
</script>
<style scope >
.selectStyle {
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  color: #606266;
  font-size: 14px;
}
.selectStyle::-ms-expand {
  display: none;
}
</style>

