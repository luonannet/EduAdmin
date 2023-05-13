<template>
  <div >
    <el-table
      :data="studentAchievementList"
      id="idWrongStu"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="QuestionContent" label="题干" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="QuestionAnalyse" :show-overflow-tooltip="true"  label="解析"></el-table-column>
      <el-table-column prop="QuestionAnswer"   width="70" label="正确答案"></el-table-column>
      <el-table-column prop="MyAnswer"   width="70" label="学员答案"></el-table-column> 
    </el-table>
  </div>
</template>

<script>
import { getStudentWrongQuestions } from "@/api/exercise";
import common from "@/utils/common";
import { isDate } from "xe-utils/methods";
export default {
  props: {
    // 班级资料
    studentDoExercise: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    editEnable: {
      typ: Boolean,
      default: false
    }
  },
  data() {
    return {
      common,
      // 学生成绩列表
      studentAchievementList: []
    };
  },
  mounted() {
    console.log("======getMyWrongQuestions 1======")
     this.getStudentWrongQuestions();
  },
  methods: {
    
    // 获取做题错的较多的学生的数据
    async getStudentWrongQuestions() {
      if (this.studentDoExercise.Chapter.length == 0) {
        this.$message({
          message: "学员的考试章节为空",
          type: "warning"
        });
      }
      let bookid = this.studentDoExercise.Chapter.split("-")[0];
      let res = await getStudentWrongQuestions(
        bookid + "/" + this.studentDoExercise.StudentID,
        ""
      );
      if (res.code == 200) { 
        this.studentAchievementList = res.data;
      }
    }
  }
};
</script>  