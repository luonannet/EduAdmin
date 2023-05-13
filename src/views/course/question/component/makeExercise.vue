<template>
  <div class="flex_dom hgt_100 pd0 marg0 wid_100">
    <div class="flex_dom hgt_100 wid_100">
      <div class="flex_dom hgt_100" style="width:350px;   ">
        <div class="flex_column wid_100 between-center">
        <span>请先创建或者选择一个试卷，然后再去右边组卷</span>
          <el-table
            :data="exerciseList"
            ref="examTable"
            tooltip-effect="light"
            highlight-current-row
            @current-change="onChangeExam"
          >
            <el-table-column prop="Label" label="试卷名称"></el-table-column>
            <el-table-column prop="CreateTime" :formatter="TimeFormatter" label="组卷时间" width="80"></el-table-column>
          </el-table>

          <el-button type="primary" @click="addNewExercie" style="width:140px">添加试卷</el-button>
        </div>
      </div>
      <div style="width:15px; background:#e0e3ea; "></div>  
      <div slot="right_content" class="p-l-10 p-b-20 wid_100">
        <div class="center">
          <el-tabs @tab-click="onChangeTabs" v-show="currentExercise&&currentExercise.Id>0">
            <el-tab-pane id="gkj" label="添加试题" name="gkj">
              <questionsList ref="gkj" :exerciseItem="currentExercise" />
            </el-tab-pane>
            <el-tab-pane id="fkj" label="试卷预览" name="fkj">
              <examQuestions ref="bhst" :exerciseItem="currentExercise" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addExam,
  getExerciseQuestion,
  getCourseExercise
} from "@/api/exercise";
import { getClassExercise } from "@/api/class";
import common from "@/utils/common";
import questionsList from "@/views/course/question/questionsList";
import examQuestions from "@/views/course/question/component/examQuestions";
import { isDate } from "xe-utils/methods";
export default {
  components: {
    questionsList,
    examQuestions
  },
  props: {
    // 班级数据
    classItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    // 课程数据
    courseItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    editEnable: {
      typ: Boolean,
      default: false
    },
    platform: {
      typ: Number,
      default: 0
    }
  },
  data() {
    return {
      common,
      // 当前所在tab页
      searchGrade: new Date(),
      currenteditEnable: this.editEnable,
      // 控制班级弹出框
      isShowClassDialog: false,
      // 创建班级的时间
      createClassTime: null,
      // 获取班级的所有学员
      exerciseList: [],
      //考卷列表
      exerciseList: [],
      currentExercise: { Id: 0 },
      // 创建人
      createPerson: null,
      currentItemData: this.classItemData,
      selectedStudentIDList: [],
      // 表单验证
      ClassFormRules: {
        Label: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    classItemData(newvar) {
      this.setData();
    },
    courseItemData(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue);
    },
    addNewExercie(val) {
      this.$prompt("请输入新试卷的名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value==""){
            this.$alert("试卷名称不能为空")
            return
          }
          let exercise = {
            ManagerID: this.$store.getters.manager.Id,
            Label: value,
            QuestionId: "",
            Examtime: "60",
            ExamKind: 0,
            State: 1,
            Public: 0,
            ClassID: this.classItemData.Id,
            CourseID: this.courseItemData.Id
          };

          this.createExam(exercise);
        })
        .catch(() => {});
    },
    async createExam(exerciseItem) {
      let res = await addExam("", "", exerciseItem);
      this.exerciseList.unshift(res.data);
    },
    async onChangeExam(val) {
      if (!val){
        val = {Id:0}
        }
      this.currentExercise = val;
    },
    onChangeTabs(item) {
      item.$children[0].fire();
    },
    setData() {
      if (this.classItemData.Id > 0) {
        this.currentItemData = this.classItemData;
        this.getClassExercise();
      } else if (this.courseItemData.Id > 0) {
        this.getCourseExercise();
      }
    },

    // 获取选中的学生
    selectionCustomChange(val) {
      this.selectedStudentIDList = [];
      val.forEach(item => {
        this.selectedStudentIDList.push(item.id);
      });
    },

    // 搜索某个课程的考卷
    async getCourseExercise() {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false;
      let that = this;
      let res = await getCourseExercise(this.courseItemData.Id);
      that.exerciseList = res.data ? res.data : [];
      that.$nextTick(function() {
        this.$refs.examTable.toggleAllSelection();
      });
    },
    // 获取班级的所有学员
    async getClassExercise() {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false;
      let that = this;
      let res = await getClassExercise(this.classItemData.Id);
      that.exerciseList = res.data ? res.data : [];
      that.$nextTick(function() {
        this.$refs.examTable.toggleAllSelection();
      });
    },

    async getClassFinishExercise(studentid) {
      let res = await getClassFinishExercise(studentid);
      this.exerciseList = res.data ? res.data : [];
    },
    async getClassMateWorks(studentid) {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false;
      let res = await getClassMateWorks(studentid, "");
      this.exerciseList = res.data ? res.data : [];
    }

    // // 添加或编辑数据
    // saveclassItemData() {
    //   this.currentItemData.PlatformID = parseInt(this.platform);
    //   if (isDate(this.searchGrade)) {
    //     this.currentItemData.Grade = this.searchGrade.getFullYear();
    //   }

    //   // 验证表单数据
    //   this.$refs.classForm.validate(async valid => {
    //     if (valid) {
    //       let rowdata = { ...this.currentItemData };
    //       if (isNaN(this.currentItemData.OpenTime)) {
    //         rowdata.OpenTime = Math.floor(
    //           this.currentItemData.OpenTime.getTime() / 1000
    //         );
    //       } else {
    //         rowdata.OpenTime = Math.floor(this.currentItemData.OpenTime / 1000);
    //       }
    //       if (isNaN(this.currentItemData.Endtime)) {
    //         rowdata.Endtime = Math.floor(
    //           this.currentItemData.Endtime.getTime() / 1000
    //         );
    //       } else {
    //         rowdata.Endtime = Math.floor(this.currentItemData.Endtime / 1000);
    //       }
    //       if (isNaN(this.currentItemData.Createtime)) {
    //         rowdata.Createtime = Math.floor(
    //           this.currentItemData.Createtime.getTime() / 1000
    //         );
    //       } else {
    //         rowdata.Createtime = Math.floor(
    //           this.currentItemData.Createtime / 1000
    //         );
    //       }
    //       if (rowdata.Id > 0) {
    //         // 编辑
    //         let res = await editClassInfo(rowdata.Id, "", rowdata);
    //         this.isShowPlatformDialog = false;
    //         this.currentItemData = res.data;
    //         this.$emit("subClickEvent", 1, res.data);
    //         this.$message({
    //           message: "修改成功",
    //           type: "success"
    //         });
    //       } else {
    //         // 创建
    //         let res = await addClassInfo("", "", rowdata);

    //         this.$message({
    //           message: "创建成功",
    //           type: "success"
    //         });
    //         this.$emit("subClickEvent", 0, res.data);
    //       }
    //       this.currentItemData.OpenTime = this.currentItemData.OpenTime * 1000;
    //       this.currentItemData.Endtime = this.currentItemData.Endtime * 1000;
    //       this.currentItemData.Createtime =
    //         this.currentItemData.Createtime * 1000;
    //     } else {
    //       return false;
    //     }
    //   });
    // }
  }
};
</script>  