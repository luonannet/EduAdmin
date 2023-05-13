<template>
  <div>
    选择要发给学员的作业
    <el-table
      tooltip-effect="light"
      :data="exerciseList"
      border
      style="width: 100%"
      :height="documentHeight"
      ref="refElTabel"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="30" />
      <el-table-column prop="Id" label="ID" width="50"></el-table-column>
      <el-table-column
        prop="Label"
        width="100"
        label="作业来源"
        :formatter="sourceFomratter"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="Label" label="作业名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Used" label="是否已经发过" width="100"></el-table-column>
      <el-table-column prop="Examtime" label="考试时间(分钟" width="110"></el-table-column>
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
  </div>
</template>

<script>
import { getClassExercise } from "@/api/exercise";
import { sendStudentsExercise } from "@/api/class";
import common from "@/utils/common";
import { isDate } from "xe-utils/methods";
export default {
  name: "questionsList",

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
      // 获取选中的学生ID
      selectedIDList: [],
      currentItemData: {},
      exerciseList: [],
      makeExamDialog: false,
      documentHeight: 500
    };
  },
  watch: {
    classItem(newval) {
      this.fire();
    }
  },
  methods: {
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      this.getThisClassExercise();
    },
    addNewExercise() {
      this.makeExamDialog = true;
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getThisClassExercise();
    },
    // 选中学院后回调选中课程类别
    async getThisClassExercise() {
      let that = this;
      // 取数据的位置
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getClassExercise(this.classItem.Id, {
        limit: that.rows,
        offset: offsetRow
      });
      that.exerciseList = res.data ? res.data : [];
      let exerciseids = that.classItem.Exerciseids.split(",");
      that.exerciseList.forEach(execise => {
        execise.Used = "没有发给班级";
        exerciseids.forEach(exericseid => {
          if (exericseid == execise.Id) {
            execise.Used = "已经发给学员";
          }
        });
      });
      that.allRows = res.title;
    }, // 课程大类改变
    // 获取选中的学生
    selectionChange(val) {
      this.selectedIDList = [];
      val.forEach(item => {
        this.selectedIDList.push(item.Id);
      });
    },
    sourceFomratter(item) {
      if (item.CourseID > 0) {
        return "教材编委发布";
      } else if (item.ClassID > 0) {
        return "班级内部发布";
      } else {
        return "未知";
      }
    },

    // 添加或编辑数据
    async sendToStudents() {
      let usedExeriseIDS = this.classItem.Exerciseids.split(",");
      let enabledExerciseIDS = [];
      this.selectedIDList.forEach(execise => {
        let hasIn = false;
        usedExeriseIDS.forEach(usedExerciseID => {
          if (usedExerciseID == execise) {
            hasIn = true;
          }
        });
        if (hasIn == false) {
          enabledExerciseIDS.push(execise);
        }
      });
      let that = this;
      let res = await sendStudentsExercise(
        that.classItem.Id,
        "",
        enabledExerciseIDS
      );
      that.$emit("updateClassItem", res.data);
      that.$message({
        message: "发送成功",
        type: "success"
      });
      this.$nextTick(() => {
        that.exerciseList.forEach(execise => {
          execise.Used = "没有发给班级";
          this.selectedIDList.forEach(exericseid => {
            if (exericseid == execise.Id) {
              execise.Used = "已经发给学员";
            }
          });
        });

        that.exerciseList = [...that.exerciseList];
      });
    }
  }
};
</script>  