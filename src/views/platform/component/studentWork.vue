<template>
  <div class="flex_dom hgt_100 pd0 marg0 wid_100">
    <div class="flex_dom hgt_100 wid_100">
      <div class="flex_dom hgt_100" style="width:350px;   ">
        <el-table :data="classAllStuList" ref="studentsTable" tooltip-effect="light">
          <!-- @selection-change="selectionCustomChange"
          <el-table-column type="selection" width="10" />-->
          <el-table-column prop="id" label="学号" width="60"></el-table-column>
          <el-table-column prop="Realname" label="姓名">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="'Tel:'+scope.row.Telephone"
                placement="top"
              >
                <span class="color-1f85aa font-w6">{{ scope.row.Realname }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="Sex" label="性别" width="50"></el-table-column>
        </el-table>
      </div>
      <div style="width:15px; background:#e0e3ea; "></div>

      <div slot="right_content" class="p-l-10 p-b-20 wid_100">
        <div class="center">
          <el-tabs @tab-click="onChangeTabs">
            <el-tab-pane id="fkj" label="发考卷" name="fkj">
              <sendStudentExercise
                ref="fkj"
                :classItem="formItemData"
                @updateClassItem="updateClassItem"
                :studentIDS="classAllStuList"
              />
            </el-tab-pane>
            <el-tab-pane id="gkj" label="改考卷" name="gkj">
              <receiveStudentExercise
                ref="gkj"
                :classItem="formItemData"
                :studentIDS="classAllStuList"
              />
            </el-tab-pane>
            <el-tab-pane id="fzy" label="发作业" name="fzy">
              <sendStudentWork ref="fzy" :classItem="formItemData" :studentIDS="classAllStuList" />
            </el-tab-pane>
            <el-tab-pane id="gzy" label="改作业" name="gzy">
              <receiveStudentWork
                ref="fzy"
                :classItem="formItemData"
                :studentIDS="classAllStuList"
              />
            </el-tab-pane>
            <!-- <el-tab-pane id="fly" label="发通知" name="fly">
              <sendMessage ref="fly" :classItem="formItemData"  :studentIDS="classAllStuList" />
            </el-tab-pane>-->
          </el-tabs>
        </div>
      </div>
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
  sendStudentsExercise,
  getClassMateWorks,
  getExerciseByBookChapter
} from "@/api/class";
import common from "@/utils/common";
import sendStudentExercise from "@/views/platform/component/sendStudentExercise";
import receiveStudentExercise from "@/views/platform/component/receiveStudentExercise";
import receiveStudentWork from "@/views/platform/component/receiveStudentWork";
import sendStudentWork from "@/views/platform/component/sendStudentWork";
import { isDate } from "xe-utils/methods";
export default {
  components: {
    sendStudentExercise,
    receiveStudentExercise,
    sendStudentWork,
    receiveStudentWork
  },
  props: {
    // 班级数据
    formItemData: {
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
      classAllStuList: [],
      //考卷列表
      exerciseList: [],
      // 创建人
      createPerson: null,
      currentItemData: this.formItemData,
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
    formItemData(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    onChangeTabs(item) {
      item.$children[0].fire();
    },
    setData() {
      this.currentItemData = this.formItemData;
      this.getClassAllStuList();
    },

    // 获取选中的学生
    selectionCustomChange(val) {
      this.selectedStudentIDList = [];
      val.forEach(item => {
        this.selectedStudentIDList.push(item.id);
      });
    },
    // 获取班级的所有学员
    async getAllMyExercise() {
      let res = await getExerciseByBookChapter(this.formItemData.Id);
      that.exerciseList = res.data ? res.data : [];
    },
    // 获取班级的所有学员
    async getClassAllStuList() {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false;
      let that = this;
      let res = await getClassStu(this.formItemData.Id);
      that.classAllStuList = res.data ? res.data : [];

      that.$nextTick(function() {
        this.$refs.studentsTable.toggleAllSelection();
      });
    },

    async getClassFinishExercise(studentid) {
      let res = await getClassFinishExercise(studentid);
      this.classAllStuList = res.data ? res.data : [];
    },
    async getClassMateWorks(studentid) {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false;
      let res = await getClassMateWorks(studentid, "");
      this.classAllStuList = res.data ? res.data : [];
    },
    updateClassItem(classitem) { 
      this.currentItemData.Exerciseids= classitem.Exerciseids; 
      this.$emit("subClickEvent", 1, this.currentItemData);
    },
    // 添加或编辑数据
    saveFormItemData() {
      this.currentItemData.PlatformID = parseInt(this.platform);
      if (isDate(this.searchGrade)) {
        this.currentItemData.Grade = this.searchGrade.getFullYear();
      }

      // 验证表单数据
      this.$refs.classForm.validate(async valid => {
        if (valid) {
          let rowdata = { ...this.currentItemData };
          if (isNaN(this.currentItemData.OpenTime)) {
            rowdata.OpenTime = Math.floor(
              this.currentItemData.OpenTime.getTime() / 1000
            );
          } else {
            rowdata.OpenTime = Math.floor(this.currentItemData.OpenTime / 1000);
          }
          if (isNaN(this.currentItemData.Endtime)) {
            rowdata.Endtime = Math.floor(
              this.currentItemData.Endtime.getTime() / 1000
            );
          } else {
            rowdata.Endtime = Math.floor(this.currentItemData.Endtime / 1000);
          }
          if (isNaN(this.currentItemData.Createtime)) {
            rowdata.Createtime = Math.floor(
              this.currentItemData.Createtime.getTime() / 1000
            );
          } else {
            rowdata.Createtime = Math.floor(
              this.currentItemData.Createtime / 1000
            );
          }
          if (rowdata.Id > 0) {
            // 编辑
            let res = await editClassInfo(rowdata.Id, "", rowdata);
            this.isShowPlatformDialog = false;
            this.currentItemData = res.data;
            this.$emit("subClickEvent", 1, res.data);
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            // 创建
            let res = await addClassInfo("", "", rowdata);

            this.$message({
              message: "创建成功",
              type: "success"
            });
            this.$emit("subClickEvent", 0, res.data);
          }
          this.currentItemData.OpenTime = this.currentItemData.OpenTime * 1000;
          this.currentItemData.Endtime = this.currentItemData.Endtime * 1000;
          this.currentItemData.Createtime =
            this.currentItemData.Createtime * 1000;
        } else {
          return false;
        }
      });
    }
  }
};
</script>  