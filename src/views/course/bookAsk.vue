<template>
  <div v-cloak class="font16 hgt_full">
    <router-view />
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->

      <!-- 科目列表 -->

      <el-table
        ref="refSubjectListElTabel"
        :data="dataList"
        border
        tooltip-effect="light"
        style="width: 100%"
        :height="documentHeight"
      >
        <el-table-column prop="Id" label="ID" width="50" />
        <el-table-column prop="author_label" width="120" label="提问学员" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="content" label="提问内容" width="250" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="CreateTime" width="120" label="提问时间" :formatter="TimeFormatter" />
        <el-table-column prop="reply" :show-overflow-tooltip="true" label="答复内容" />
        <el-table-column prop="ReplyLabel" width="120" :show-overflow-tooltip="true" label="答复人" />
        <el-table-column prop="ReplyTime" width="120" :formatter="TimeFormatter" label="答复时间" />
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" @click="videoAsk(scope.$index, scope.row)">回复</el-button>
            <el-button type="warning" @click="deleteIt(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="between-center m-v-15">
        <div>
          <el-pagination
            background
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
            @current-change=" currentPageChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增弹出框 -->
    <div>
      <my-dialog
        :visible.sync="moreOperationDialog"
        :showLeft="false"
        :close-show="true"
        title="回复学员问答"
      >
        <div slot="right_content" class="p_both20 p-b-20">
          <bookAskReply @itemModify="updateListItem" :formItemData="customFormData" />
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import Layout from "@/layout";
import bookAskReply from "@/views/course/component/bookAskReply";
import { getAskList } from "@/api/question";
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
export default {
  name: "bookAsk",
  components: {
    myDialog,
    bookAskReply
  },
  data() {
    return {
      common,
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 20,
      // 搜索查询-课程类别
      searchBookCourseKind: "",
      // 查询内容
      searchContent: "",
      activeName: "xgxz",
      // 科目的列表数据
      editEnable: false,
      dataList: [],
      // 更多操作弹窗
      moreOperationDialog: false,
      bookID: 0,
      currentItemIndex: 0,
      customFormData: {},
      documentHeight: 500,
      currentPlatform: 0
    };
  },
  mounted() {
    this.documentHeight = document.body.clientHeight - 400;
    if (!isNaN(this.$router.currentRoute.query.Id)) {
      this.bookID = parseInt(this.$router.currentRoute.query.Id);
    } else {
      let paths = this.$router.currentRoute.path.split("/");
      this.currentPlatform = parseInt(paths[paths.length - 1]);
      if (isNaN(this.currentPlatform)) {
        this.currentPlatform = 0;
      }
    }
    this.getAskList();
  },
  methods: {
    // 获取科目列表
    async getAskList() {
      // 取数据的位置
      this.dataList = [];
      let that = this;
      const offsetRow = (this.nowPage - 1) * this.rows;
      const params = {
        limit: this.rows,
        offset: offsetRow,
        label: this.searchContent,
        coursekind: this.searchBookCourseKind,
        platform: this.currentPlatform
      };
      const res = await getAskList(this.bookID, params);
      if (res.code == 200) {
        that.allRows = res.title;
        that.dataList = res.data ? res.data : [];
      } else {
        this.$message({
          message: res.title,
          type: "warning"
        });
      }
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getAskList();
    },
    // 显示列表的时候格式化时间
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, 2);
    },
    // 学员留言
    videoAsk: function(index, row) {
      this.currentItemIndex = index;
      this.customFormData = { ...row };
      this.moreOperationDialog = true;
    },
    // 添加或编辑之后更新列表数据
    updateListItem(type, rowData) {
      if (type == 0) {
        this.dataList.push(rowData);
      } else {
        this.$set(this.dataList, this.currentItemIndex, rowData);
      }
      this.moreOperationDialog = false;
    },
    // 关联章节管理
    deleteIt: function(index, row) {
      this.$router.push({
        name: "bookAdpter",
        query: { Id: row.Id }
      });
    }
  }
};
</script>
<style scope>
.el-dialog.exerciseSitaution {
  width: 70% !important;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 30% !important;
  height: 100%;
  min-width: 600px;
  position: relative;
  overflow: auto;
}
.closeDialog:hover {
  color: #1890ff;
}
</style>
