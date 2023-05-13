<template>
  <div class="p_both10 p-t-5 hgt_full"> 
    <div class="flex_column hgt_full" >
      <div class="flex_1 hgt_full">
        <el-table
          ref="refElTabel"
          tooltip-effect="light"
          :data="members"
          :height="documentHeight"
          border
          style="width: 100%"
        >
          <el-table-column prop="Id" label="ID" width="50"></el-table-column>

          <el-table-column prop="Realname" label="姓名" width="90"></el-table-column>
          <el-table-column prop="Tel" label="报名电话" width="130"></el-table-column>
          <el-table-column prop="Createtime" :formatter="TimeFormatter" label="报名时间" width="130"></el-table-column>
          <el-table-column prop="Message" label="留言"></el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
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
  </div>
</template>
<script>
import { listPartyMembers } from "@/api/guest";
import common from "@/utils/common";
export default {
  name: "partyMember",
  props: {
    // 校区的表单数据
    currentPlatform: {
      type: Number,
      default: 0
    },
    // 班级
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },

  data() {
    return {
      common,

      // 日期选择-日期筛选
      queryEndDate: null,

      // 数据总条数-分页
      allRows: 0,
      // 当前页数-分页
      nowPage: 1,
      // 每页数据的总条-分页
      rows: 40,
      ShowSearchForm: false,
      // 获取班级的所有学员
      members: [],
      // 复选框所选中的学员ID
      documentHeight:  document.body.clientHeight -150
    };
  },
  watch: {
    formItemData(newval) {
      this.fire();
    }
  },
  mounted() {
    this.fire();
  },
  methods: {
    // 格式化日期
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, true);
    },
    // 获取班级的所有学员
    async fire() {
      // this.documentHeight = document.body.clientHeight - 100;
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSearchStuResult = false;
      this.getPageMembers();
    },
    async getPageMembers() {
      let that = this;
      that.members = [];
      let offsetRow = (that.nowPage - 1) * that.rows;
      let res = await listPartyMembers(this.formItemData.Id, {
        platform: that.currentPlatform,
        limit: that.rows,
        offset: offsetRow
      });
      that.members = res.data ? res.data : [];
      that.allRows = res.title;
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getPageMembers();
    }
  }
};
</script> 
<style scoped>
.quan_xian_item {
  width: calc(100% / 5);
}
</style> 