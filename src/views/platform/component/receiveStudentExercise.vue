<template>
  <div>
    <el-table
      tooltip-effect="light"
      :data="studentDoExerciseList"
      border
      style="width: 100%"
      :height="documentHeight"
      ref="refElTabel"
    >
      <el-table-column prop="ID" label="ID" width="50"></el-table-column>
      <el-table-column prop="Label" label="试卷名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StudentLabel" label="学员姓名" width="100"></el-table-column>
      <el-table-column prop="StartTime" label="开始时间" width="110"></el-table-column>
      <el-table-column prop="EndTime" label="结束时间" width="110"></el-table-column>
      <el-table-column prop="Score" label="得分" width="50"></el-table-column>
      <el-table-column width="110" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            style="margin:0px;"
            @click="seeWrongQuestion(scope.$index, scope.row)"
          >查看错题</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="between-center m-v-10">
      <el-button type="primary" @click="sendToStudents()">确定发送</el-button>
      <div>
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

    <el-dialog
      :visible.sync="studentDoExerciseDailog"
      :title="'【'+studentDoExercise.Label+'】试卷详情'"
      height="500px"
    >
      <studentWrongQuestions :studentDoExercise="studentDoExercise"></studentWrongQuestions>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllClass,
  editClassInfo,
  addClassInfo,
  getOneClass, 
  getClassTeachers,
  getTimeTableByMonth,
  addClassDaily,
  addClassCheck,
  getClassDaily,
  addClassStu,
  getClassStu,
  handOutTask,
  getClassFinishExercise
} from "@/api/class";
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
      currentItemData: this.formItemData,
      // 表单验证
      ClassFormRules: {
        Label: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      },
      studentDoExercise: {},
      studentDoExerciseList: [],
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
    async  fire() { this.documentHeight = document.body.clientHeight-400;
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getClassFinishExercise(this.classItem.Id, {
        limit: this.rows,
        offset: offsetRow
      });
      this.studentDoExerciseList = res.data ? res.data : [];
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.fire();
    },

    // 查看这个学员的错题
    seeWrongQuestion(index, row) {
      this.studentDoExercise = { ...row };
      this.studentDoExerciseDailog = true;
      this.currentIndex = index;
    }
  }
};
</script>  