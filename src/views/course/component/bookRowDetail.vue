<template>
  <div>
    <el-form
      ref="currentForm"
      :disabled="currenteditEnable==false"
      :model="currentItemData"
      :rules="subjectFormRules"
      style="padding:10px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="名称" prop="Label">
        <el-tooltip class="item" effect="dark" content="教材的名字一经填写,不要随便修改 以免混乱" placement="top-start">
          <el-input v-model="currentItemData.Label"  />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="currentItemData.Description" />
      </el-form-item>

      <el-form-item label="所属学院">
        <el-select v-model="currentCollegeID" placeholder="请选择学院" @change="collegeChange">
          <el-option
            v-for="(item,index) in $store.getters.app.collegeWithCourseKind"
            :key="index"
            :label="item.Label"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程类别">
        <el-select v-model="currentCourseKindID" placeholder="请选择课程分类" @change="courseKindChange">
          <el-option
            v-for="(item,index) in courseKindsOps"
            :key="index"
            :label="item.Label"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div>
      <el-button
        type="warning"
        v-show="!currenteditEnable"
        class="m-l-40"
        @click="currenteditEnable=true"
      >编辑</el-button>
      <el-button
        type="primary"
        v-show="currenteditEnable"
        class="m-l-40"
        @click="saveFormItemData"
      >确 认</el-button>
      <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { editBook, addBook } from "@/api/book";
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
      currenteditEnable: this.editEnable,
      // 选中的学院
      currentCollegeID: {},
      currentCourseKindID: {},
      //  科目的基本数据
      currentItemData: {},
      courseKindsOps: [],
      // 表单验证
      subjectFormRules: {
        Label: [{ required: true, message: "名称不能为空", trigger: "blur" }]
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

          if (this.currentItemData.Id > 0) {
            // 编辑科目
            res = await editBook(
              this.currentItemData.Id,
              "",
              this.currentItemData
            );
            this.isShowPlatformDialog = false;
            this.currentItemData = res.data;
            this.$emit("itemModify", 1, res.data);
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            // 创建科目
            res = await addBook("", "", this.currentItemData);
            this.isShowPlatformDialog = false;
            this.currentItemData = res.data;
            this.$emit("itemModify", 0, res.data);
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
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
