<template>
  <div>
    <el-form :inline="true">
      <!-- 我的校区的时候使用，用来展示本校区所属的工作人员 -->

      <el-form-item label>
        <el-switch
          v-model="readed"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :inactive-text="readed?'已经批阅的':'没有批阅的'"
          @change="fire"
        />
      </el-form-item>
    </el-form>
    <el-table
      tooltip-effect="light"
      :data="studentFinishWorkList"
      border
      style="width: 100%"
   :height="documentHeight"
      ref="refElTabel"
    >
      <el-table-column prop="StudentName" label="学员姓名" width="110"></el-table-column>
      <el-table-column label="作品发送记录" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a
            target="_blank"
            @click="openStudentWork(scope.$index, scope.row)"
          >{{scope.row.WorkName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="TeacherLabel" label="老师" width="110"></el-table-column>
      <el-table-column prop="Createtime" label="发送时间" :formatter="TimeFormatter" width="110"></el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        :current-page.sync="nowPage"
        :page-size="rows"
        layout="total,prev, pager, next, jumper"
        :total="allRows"
        @current-change="getStudentsWorks"
      />
    </div>
  </div>
</template>

<script>
import { getClassStudentWorks } from "@/api/class";
import common from "@/utils/common";
import studentWrongQuestions from "@/views/platform/component/studentWrongQuestions";
import { isDate } from "xe-utils/methods";
export default {
  components: {
    studentWrongQuestions
  },
  props: {
    classItem: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    // 校区的表单数据
    studentIDS: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      common,
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 50,
      readed: false,
      currentItemData: this.formItemData,
      // 表单验证
      ClassFormRules: {
        Label: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      }, 
      studentFinishWorkList: [],
      studentDoExerciseDailog: false,
      currentIndex: 0,
      documentHeight:500,
    };
  },
  watch: {
    classItem(newval) {
      this.fire();
    }
  },
  methods: {
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue);
    },
     fire() { this.documentHeight = document.body.clientHeight-400;
     
      this.getStudentsWorks();
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getStudentsWorks();
    },
    async openStudentWork(index, row) {
      let href = "/studentwork/scratch3/index.html?p="+this.classItem.PlatformID+"&id="+row.Id;
      window.open(href)
 
    },

    // 查看这个学员的错题
    async getStudentsWorks() {
      let that = this;
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getClassStudentWorks(
        that.classItem.Id + "/" + that.readed,
        {
          limit: that.rows,
          offset: offsetRow
        }
      );
      that.studentFinishWorkList = res.data ? res.data : [];
      that.allRows = res.title;
    }
  }
};
</script>  