<template>
  <div v-cloak class="font16 hgt_full">
    <my-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <div class="flex_column hgt_full">
      <!-- 搜索内容-->
      <div class="p-t-20">
        <el-form :inline="true">
          <el-form-item label="所属学院">
            <el-select
              v-model="collegeIndex"
              class="wid160"
              placeholder="请选择学院"
              @change="collegeChange"
            >
              <el-option label="全部学院" :value="0"></el-option>
              <el-option
                v-for="(item,index) in collegeList"
                :key="index"
                :label="item.Label"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程类别">
            <el-select
              v-model="searchCourseKindId"
              @change="forceUpdate()"
              class="wid160"
              placeholder="请选择课程类别"
            >
              <el-option label="全部课程类别" :value="0"></el-option>
              <el-option
                v-for="(item,index) in courseKindsOps"
                :key="index"
                :label="item.Label"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input
              v-model="searchCourseLabel"
              placeholder="请输入课程名称"
              @keyup.native.enter="getCourseListOfKind"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getCourseListOfKind">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <!-- 图片预览 -->
      <my-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />

      <el-table
        ref="refElTabel"
        :data="courseList"
        border
        tooltip-effect="light"
        style="width: 100%"
        height="100%"
      >
        <el-table-column label="ID" width="50" prop="Id" />
        <el-table-column label="封面图" width="60" prop="Background">
          <template slot-scope="scope">
            <img
              v-if="scope.row.Background"
              class="wid20"
              src="/assets/slice/uploadedIcon.png"
              @click="onPreview(scope.row.Background)"
            />
          </template>
        </el-table-column>
        <el-table-column label="教学图" width="60" prop="Jxtx">
          <template slot-scope="scope">
            <img
              v-if="scope.row.Jxtx"
              class="wid20"
              src="/assets/slice/uploadedIcon.png"
              @click="onPreview(scope.row.Jxtx)"
            />
          </template>
        </el-table-column>
        <el-table-column label="详情图" width="60" prop="Kcxq">
          <template slot-scope="scope">
            <img
              v-if="scope.row.Kcxq"
              class="wid20"
              src="/assets/slice/uploadedIcon.png"
              @click="onPreview(scope.row.Kcxq)"
            />
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="260" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span
              class="color-1f85aa font-w6 cursor"
              @click="openMoreOptationDialog(scope.$index, scope.row)"
            >{{ scope.row.Label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="130" prop="Createtime" :formatter="dateFormat" />
        <el-table-column label="宣传售价" width="70" prop="Price" />
        <el-table-column label="课时量" width="60" prop="CourseNum" />
        <el-table-column label="产品描述" :show-overflow-tooltip="true" prop="Description" />
        <el-table-column label="是否上架" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.Open==1?'success':'warning'"
              @click="setIsUpperShelf(scope.$index, scope.row)"
            >{{ scope.row.Open==1?"已经上架":"没有上架" }}</el-button>
            <el-button type="primary" @click="openMakeExercise(scope.$index, scope.row)">专家组卷</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-v-15">
        <el-button type="primary" @click="openCourseDialog(0)">新增课程</el-button>
      </div>
    </div>
    <div>
      <!-- 更多操作弹出框 -->
      <my-dialog
        :visible.sync="moreOperationDialog"
        :close-show="true"
        :title="currentItemData.Label"
      >
        <!-- 展示校区的基本信息 -->
        <div slot="left_content" class="p_both20 p-b-20">
          <course-row-detail @itemModify="updateListItem" :formItemData="currentItemData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs @tab-click="onChangeTabs">
            <el-tab-pane id="priceSetting" label="价格设定" name="priceSetting">
              <course-price-tab :formItemData="currentItemData" />
            </el-tab-pane>
            <el-tab-pane id="smxq" label="禁售校区" name="smxq">
              <courseSellPlatform :currentFormData="currentItemData" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </my-dialog>
      <!-- 课程弹出框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="600px"
        :title="currentItemData.Id>0?'编辑'+currentItemData.Label:'新增课程'"
      >
        <course-row-detail
          @subClickEvent="updateListItem"
          :courseKindIdProp="searchCourseKindId"
          :editEnable="true"
          :formItemData="currentItemData"
        />
        <div></div>
      </el-dialog>
      <my-dialog
        :visible.sync="makeExamDialog"
        :title="'【'+currentItemData.Label+'】试卷管理'"
        :showLeft="false"
      >
        <div slot="right_content" class="flex_dom hgt_100">
          <makeExercise :courseItemData="currentItemData"></makeExercise>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import courseTravelBrochure from "@/views/course/component/courseTravelBrochure";
import coursePriceTab from "@/views/course/component/coursePriceTab";
import makeExercise from "@/views/course/question/component/makeExercise";
import courseSellPlatform from "@/views/course/component/courseSellPlatform";
import courseRowDetail from "@/views/course/component/courseRowDetail";
import common from "@/utils/common";
import {
  getCourseList,
  GetCourseOfKind,
  setCourseUpperShelf,
  addCourse,
  editCourse,
  getCourseBookByCourse,
  getCourseTravelBrochure,
  updateCourseTravelBrochure,
  saveCoursePriceList,
  getSubjectChapter,
  addExam,
  editExam,
  getZhangOfSubject,
  saveExamQuestions,
  getDoWrongQuseStuList,
  getTopWrongQuseList
} from "@/api/course";

import { getCollegeWithCourseKind } from "@/api/college";
import { getExerciseByBookChapter } from "@/api/exercise";

export default {
  name: "courseList",
  components: {
    myDialog,
    myImageViewer,
    courseTravelBrochure,
    coursePriceTab,
    courseSellPlatform,
    courseRowDetail,
    makeExercise
  },
  data() {
    return {
      editDialog: false,
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 课程列表数据
      courseList: [],
      // 默认选中的学院
      collegeIndex: 0,
      // 当前操作的课程数据的索引
      currentCourseIndex: 0,
      // 搜索内容-课程名称
      searchCourseLabel: "",
      // 搜索内容-课程类别的Id
      searchCourseKindId: 0,
      searchCourseCollegeId: 0,
      CourseKindLabel: "",
      // 学院的选项数据
      collegeList: [],
      makeExamDialog: false,
      // 课程类别的选项数据
      courseKindsOps: [],
      // 当前所在面板的名称
      activeName: "priceSetting",
      // 控制更多操作的模态框
      moreOperationDialog: false,
      // 当前操作课程的索引
      currentCourseIndex: null,
      // 课程的表单数据
      currentItemData: {}
    };
  },
  mounted() {
    this.collegeList = this.$store.getters.app.collegeWithCourseKind;
    this.getCourseListOfKind();
    if (this.collegeList.length == 0) {
      this.getAllCollegeWithCourseKind();
    }
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate();
    },
    onChangeTabs(item) {
      item.$children[0].fire();
    },
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false;
    },

    // 根据课程类别获取课程列表
    async getCourseListOfKind() {
      let that = this; 
      let res = await GetCourseOfKind(
        "",
        {
          label: that.searchCourseLabel,
          all: 1,
          kindid: that.searchCourseKindId,
          collegeID: that.searchCourseCollegeId, 
          public:-1 //获取全部
        },
        ""
      );
      if (res.code == 200) {
        that.courseList = res.data ? res.data : [];
      }
    },
    // 获取所有学院以及所属的课程类别
    async getAllCollegeWithCourseKind() {
      let that = this;
      let res = await getCollegeWithCourseKind("", { include: 1 });
      if (res.code == 200) {
        this.collegeList = res.data ? res.data : [];
      }
    },
    // 组卷管理
    openMakeExercise(index, row) {
      this.currentItemData = { ...row };
      this.makeExamDialog = true;
      this.currentCourseIndex = index;
    },
    // 选中学院类别后回调
    collegeChange(selVa) {
      // 清空数据
      this.courseKindsOps = [];
      this.courseList = [];
      this.searchCourseKindId = 0;
      let currentCollege = null;
      this.searchCourseCollegeId = selVa;
      this.collegeList.forEach(item => {
        if (item.Id == selVa) {
          currentCollege = item;
        }
      });
      if (currentCollege && currentCollege.Children) {
        this.courseKindsOps = currentCollege.Children;

        this.searchCourseKindId = 0;
      }
    },

    // 设置是否上架
    setIsUpperShelf(index, row) {
      const checked = row.Open == 1 ? 0 : 1;
      const tip = checked == 1 ? "你确认要上架" : "你确认要下架";
      this.$confirm(tip, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await setCourseUpperShelf(
            row.Id,
            {
              open: checked
            },
            true
          );
          if (res.code == 200) {
            this.$message({
              message: "设置成功",
              type: "success"
            });
            this.$set(this.courseList, index, res.data);
          }
        })
        .catch(() => {});
    },
    // 切换tabs标签页在调用函数
    changDialogTab(tab) {
      if (tab.$attrs.id == "travelBrochure") {
        // this.$refs.travelBrochure.getTravelBrochure(this.currentItemData.Id);
      } else if (tab.$attrs.id == "priceSetting") {
        // this.$refs.refCoursePriceTab.getCourseRow(this.currentItemData);
      }
    },
    // 添加或编辑之后更新列表数据
    updateListItem(type, rowData) {
      if (type == 0) {
        this.courseList.push(rowData);
      } else if (type == 1) {
        this.$set(this.courseList, this.currentCourseIndex, rowData);
      }
      this.editDialog = false;
    },
    // 打开更多操作的模态框
    openMoreOptationDialog(index, row) {
      this.moreOperationDialog = true;
      this.currentCourseIndex = index;
      this.currentItemData = row;
      // this.$refs.travelBrochure.getTravelBrochure(this.currentItemData.Id);
      // this.$refs.refCourseDetail.getCourseRowData(row);
    },
    // 打开课程的模态框
    openCourseDialog(type) {
      this.editDialog = true;
      this.currentItemData = {};
    },
    // 更新课程列表
    updataCourseList(type, row) {
      if (type) {
        this.courseList.unshift(row);
      } else {
        this.courseList.splice(this.currentCourseIndex, 1, row);
        this.currentItemData = row;
        // this.$refs.refCourseDetail.getCourseRowData(row);
      }
    },
    // 格式化时间
    dateFormat(row, column) {
      if (row.Createtime) {
        return this.common.dateFormat(row.Createtime, 2);
      }
    }
  }
};
</script>
<style scoped>
</style>
