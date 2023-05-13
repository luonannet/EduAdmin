<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full p-t-20">
      <!-- 查询表单 -->
      <div class="m-b-10">
        <el-form :inline="true">
          <el-form-item label="建班年份:">
            <el-date-picker
              style="width:100px"
              v-model="searchGrade"
              value-format="yyyy"
              type="year"
              placeholder="选择年"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="班级名称:">
            <el-input
              v-model="searchClassLabel"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入班级名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        tooltip-effect="light"
        :data="classList"
        border
        style="width: 100%"
        
        ref="refElTabel"
      >
        <el-table-column prop="Id" label="ID" width="50"></el-table-column>
        <el-table-column
          label="班级名称"
          :formatter="TimeFormatter"
          :show-overflow-tooltip="true"
          width="260"
        >
          <template slot-scope="scope">
            <span
              class="color-1f85aa font-w6 cursor"
              @click="openMoreOptationDialog(scope.$index, scope.row)"
            >{{scope.row.Label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="授课方式" width="120">
          <template slot-scope="scope">
            <span>{{common.FormatSelect(common.teachingForm,scope.row.TeachMethod)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="StudentNum" label="学员人数" width="80"></el-table-column>
        <el-table-column prop="ManagerLabel" label="班主任" width="80"></el-table-column>
        <el-table-column prop="CreaterLabel" label="创建人员" width="80"></el-table-column>
        <el-table-column prop="Createtime" label="创建时间" width="90" :formatter="TimeFormatter"></el-table-column>
        <el-table-column prop="OpenTime" label="开课时间" width="90" :formatter="TimeFormatter"></el-table-column>
        <el-table-column prop="Endtime" label="结课时间" width="90" :formatter="TimeFormatter"></el-table-column>
        <el-table-column prop="Description" label="情况备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="warning"
              style="margin:0px;"
              @click="openExerciseManager(scope.$index, scope.row)"
            >试卷管理</el-button>
            <el-button
              type="success"
              style="margin:0px;"
              @click="openClassStudents(scope.$index, scope.row)"
            >学员作业</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="between-center m-v-10">
        <el-button type="primary" @click="createClass()">创建班级</el-button>
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
    <!-- 弹出框 -->
    <div>
      <!-- 班级相关操作的模态框 -->
      <my-dialog :visible.sync="moreOperationDialog" :title="classFormData.Label">
        <div slot="left_content" class="p_both20 p-b-20">
          <class-row-detail
            :formItemData="classFormData"
            :platform="currentPlatform"
            @subClickEvent="updateListItem"
          ></class-row-detail>
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs @tab-click="onChangeTabs">
            <el-tab-pane label="本班学员" name="bbxy" id="bbxy">
              <classStudent :formItemData="classFormData"></classStudent>
            </el-tab-pane>
            <el-tab-pane label="所开课程" name="skkc" id="skkc">
              <classCourse :formItemData="classFormData" @subClickEvent="updateListItem"></classCourse>
            </el-tab-pane>
            <el-tab-pane label="选择班主任" name="rkls" id="rkls">
              <classManager :formItemData="classFormData"  @subClickEvent="updateListItem"></classManager>
            </el-tab-pane>

            <el-tab-pane label="课程表" name="kcb" id="kcb">
              <classDaily :formItemData="classFormData"></classDaily>
            </el-tab-pane>
          </el-tabs>
        </div>
      </my-dialog>
      <!-- 班级的模态框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="500px"
        :title="classFormData.Id>0?'编辑'+classFormData.Label:'新增班级'"
      >
        <class-row-detail
          :editEnable="true"
          :formItemData="classFormData"
          :platform="currentPlatform"
          @subClickEvent="updateListItem"
        />
      </el-dialog>

      <!-- 班级相关操作的模态框 -->
      <my-dialog
        :visible.sync="classStudentsDialog"
        :title="'【'+classFormData.Label+'】学员作业'"
        :showLeft="false"
      >
        <div slot="right_content" class="flex_dom hgt_100">
          <studentWork :formItemData="classFormData"    @subClickEvent="updateListItem"></studentWork>
        </div>
      </my-dialog>
      <!-- 班级相关操作的模态框 -->
      <my-dialog
        :visible.sync="makeExamDialog"
        :title="'【'+classFormData.Label+'】试卷管理'"
        :showLeft="false"
      >
        <div slot="right_content" class="flex_dom hgt_100">
          <makeExercise :classItemData="classFormData"></makeExercise>
        </div>
      </my-dialog>
    </div>
  </div>
</template> 
<script>
import classRowDetail from "@/views/platform/component/classRowDetail";
import classStudent from "@/views/platform/component/classStudent";
import studentWork from "@/views/platform/component/studentWork";
import makeExercise from "@/views/course/question/component/makeExercise";
import classCourse from "@/views/platform/component/classCourse";
import classManager from "@/views/platform/component/classManager";
import classDaily from "@/views/platform/component/classDaily";
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
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
import { isDate } from "xe-utils/methods";
export default {
  name: "classList",
  components: {
    myDialog,
    classRowDetail,
    classDaily,
    studentWork,
    classStudent,
    classCourse,
    makeExercise,
    classManager
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
      // 班级的列表数据
      classList: [],
      // 模态框获得的单条班级数据
      classFormData: {},
      // 当前操作的班级数据的索引
      currentIndex: 0,
      // 模态框当前激活的标签页
      activeClassTabs: "bbxy",
      // 控制班级更多操作的弹出框
      moreOperationDialog: false,
      classStudentsDialog: false,
      makeExamDialog: false,
      searchClassLabel: "",
      searchGrade: new Date(),
      // 当前的校区id
      currentPlatform: null,
      // 更多操作弹窗
      editDialog: false,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false
    };
  },
  methods: {
    onChangeTabs(item) {
      item.$children[0].fire();
    },
    // 获取所有班级的列表
    async getAllClass() {
      let that = this;
      let year = 0;
      if (isDate(that.searchGrade)) {
        year = that.searchGrade.getFullYear();
      } else {
        year = that.searchGrade;
      }
      // 取数据的位置
      let offsetRow = (that.nowPage - 1) * that.rows;
      let res = await getAllClass("", {
        label: that.searchClassLabel,
        platformid: that.currentPlatform,
        grade: year,
        limit: that.rows,
        offset: offsetRow
      });
      if (res.code == 200) {
        that.classList = res.data ? res.data : [];
        that.allRows = res.title;
      }
    },
    // 打开本班的学员列表
    openClassStudents(index, row) {
      this.classFormData = { ...row };
      this.classStudentsDialog = true;
      this.currentIndex = index;
    },
    // 组卷管理
    openExerciseManager(index, row) {
      this.classFormData = { ...row };
      this.makeExamDialog = true;
      this.currentIndex = index;
    },

    // 打开更多操作模态框
    openMoreOptationDialog(index, row) {
      this.classFormData = { ...row };
      this.classFormData.OpenTime = row.OpenTime * 1000;
      this.classFormData.Endtime = row.Endtime * 1000;
      this.classFormData.Createtime = row.Createtime * 1000;
      this.moreOperationDialog = true;
      this.currentIndex = index;
    },
    //打开班级信息模态框
    createClass(type) {
      this.classFormData = {};
      this.classFormData.OpenTime = new Date();
      this.classFormData.Endtime = new Date();
      this.classFormData.Createtime = new Date();
      this.editDialog = true;
    },
    // 添加班级成功之后更新表格数据-班级列表
    updateListItem(type, rowData) { 
      if (rowData.OpenTime > 1507800391000) {
        rowData.OpenTime =parseInt( rowData.OpenTime / 1000);
      }
      if (rowData.Endtime > 1507800391000) {
        rowData.Endtime = parseInt(rowData.Endtime / 1000);
      }
      if (rowData.Createtime > 1507800391000) {
        rowData.Createtime =parseInt( rowData.Createtime / 1000);
      }
      if (type == 0) {
        this.classList.unshift(rowData);
      } else if (type == 1) {
        this.$set(this.classList, this.currentIndex, rowData);
      }
      this.editDialog = false;
    },

    // 格式化日期
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue);
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getAllClass();
    },
    // 条件搜索
    searchSubmit() {
      this.nowPage = 1;
      this.getAllClass();
    }
  },
  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = parseInt(paths[paths.length - 1]);
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    this.nowPage = 1;
    this.getAllClass();
  }
};
</script>
<style scope>
.el-dialog.exerciseSitaution {
  width: 70% !important;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 30% !important;
  height: 100%;
  min-width: 600px;
  position: relative;
  overflow: auto;
}
.closeDialog:hover {
  color: #2e77f8;
}
</style>