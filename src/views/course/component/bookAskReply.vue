<template>
  <div>
    <el-form
      ref="currentForm"
      :model="currentItemData"
      :rules="subjectFormRules"
      style="padding:10px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <div class="between-center">
        <el-form-item label="提问者">
          <span>{{currentItemData.author_label}}</span>
        </el-form-item>
        <el-form-item label="提问时间">
          <span>{{common.dateFormat(currentItemData.CreateTime, 2)}}</span>
        </el-form-item>
      </div>
      <el-form-item label="描述">
        <span>{{currentItemData.content}}</span>
      </el-form-item>

      <el-form-item label="回复内容" prop="reply">
        <el-input type="textarea" :rows="10" v-model="currentItemData.reply" />
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" class="m-l-40" @click="saveFormItemData">确 认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reply } from "@/api/question";
import common from "@/utils/common";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
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
      currenteditEnable: this.editEnable,
      // 选中的学院
      currentCollegeID: {},
      currentCourseKindID: {},
      //  科目的基本数据
      currentItemData: {},
      courseKindsOps: [],
      // 表单验证
      subjectFormRules: {
        reply: [
          { required: true, message: "回复内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    }
  },

  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.currentItemData = this.formItemData;
      this.currentCollegeID = this.currentItemData.CollegeID;
      this.currentCourseKindID = this.currentItemData.CoursekindID;
      this.$store.getters.app.collegeWithCourseKind.forEach(college => {
        if (college.Id == this.currentItemData.CollegeID) {
          this.courseKindsOps = college.Children;
        }
      });
    },

    // 选中学院后回调选中课程类别
    collegeChange(collegeID) {
      this.$store.getters.app.collegeWithCourseKind.forEach(college => {
        if (college.Id == collegeID) {
          this.currentCourseKindID = 0;
          this.courseKindsOps = college.Children;
        }
      });
    }, // 课程大类改变
    courseKindChange(coursekindId) {
      this.courseKindsOps.forEach(coursekind => {
        if (coursekind.Id == coursekindId) {
          this.currentItemData.Coursekind = coursekind.Label;
          this.currentItemData.CoursekindID = coursekind.Id;
        }
      });
    },
    // 保存添加或编辑数据
    saveFormItemData() {
      // 验证表单数据
      this.$refs.currentForm.validate(async valid => {
        if (valid) {
          let res;
          this.currentItemData.CollegeID = this.currentCollegeID;

          // 编辑科目
          res = await reply(
            this.currentItemData.Id,
            "",
            this.currentItemData.reply
          );
          this.isShowPlatformDialog = false;
          this.currentItemData = res.data;
          this.$emit("itemModify", 1, res.data);
          this.$message({
            message: "回复成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "请完善表单",
            type: "warning"
          });
        }
        this.currenteditEnable = false;
      });
    },
    // 获取表单数据
    getSubjectRow(row) {
      this.currentItemData = {};
      this.currentItemData = row;
    }
  }
};
</script>
