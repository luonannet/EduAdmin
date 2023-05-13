<template>
  <div>
    <el-form style="padding:10px 0px 0px 0px" label-width="80px" size="small">
      <el-form-item label="班级名称" prop="Label"></el-form-item>
    </el-form>
    <div class="around-center hgt60 bge0e3ea">
      <el-button type="warning" class="m-l-40">编辑</el-button>
      <el-button type="primary" :disabled="false" class="m-l-40" @click="saveFormItemData">确 认</el-button>
    </div>
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
  getAllClassTaskRecord
} from "@/api/class";
import common from "@/utils/common";
import { isDate } from "xe-utils/methods";
export default {
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
      searchGrade: new Date(),
      currenteditEnable: this.editEnable,
      // 控制班级弹出框
      isShowClassDialog: false,
      // 创建班级的时间
      createClassTime: null,
      // 创建人
      createPerson: null,
      currentItemData: this.formItemData,
      // 表单验证
      ClassFormRules: {
        Label: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
 
  mounted() {
     
  },
  methods: {
    fire(){

    },
    // 添加或编辑数据
    saveFormItemData() {
      console.log("====studentIDS:===", this.studentIDS);
    }
  },
  mounted() {}
};
</script>  