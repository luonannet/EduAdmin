<template>
  <div class="p_both10"> 
    <div class="m-t-10" v-show="showSearchStuResult">
      <div class="m-t-20 center flex_wrap m-l-15">
        <el-checkbox-group v-model="checkBoxAddItem">
          <el-checkbox
            :label="item.Id"
            class="m-b-5"
            :key="item.Id"
            v-for="item in searchCourseList"
          >{{item.Label}}（{{item.Id}}）</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="m-t-30 center-end">
        <el-button type="primary" @click="addCourseToClass" class="border0">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getClassCourse, addClassCourse, removeClassCourse } from "@/api/class";
import { getCourseList } from "@/api/course";
import common from "@/utils/common";
export default {
  name: "ClassStudent",
  props: {
    // 校区的表单数据
    currentPlatform: {
      type: Number,
      default: 0
    },
    // 班级
    formItemData: {
      type: Object,
       default: function() {
        return { Id: 0 };
      }
    }
  },

  data() {
    return {
      common,
      // 数据总条数-分页
      allRows: 0,
      // 当前页数-分页
      nowPage: 1,
      // 每页数据的总条-分页
      rows: 40,
      searchCourseList: [],
      searchContent: "",
      // 获取班级的所有课程
      classAllCourseList: [],
      // 是否显示搜索课程的搜索结果模块
      showSearchStuResult: false,
      // 选中的要加入班级的课程
      checkBoxAddItem: [],
      // 复选框所选中的课程ID
      selectExistCourse: [],
      currentItemData: {},
      documentHeight:500,
    };
  },
  watch: {
    formItemData(newval) {
      
      this.fire();
    }
  },
  methods: {
    // 获取班级的所有课程
    async  fire() { this.documentHeight = document.body.clientHeight-400;
      this.currentItemData= {...this.formItemData}; 
      this.searchCourseList = [];
      this.searchCourse(); 
    },
    // 查找课程
    async searchCourse() {
      this.searchCourseList = [];
      this.ShowSearchForm = false;
      this.showSearchStuResult = false;
      let res = await getCourseList("", {
        label: this.searchContent,
        platform: this.currentPlatform
      });
      this.searchCourseList = res.data ? res.data : [];
      let existCourse = [];
      if (
        this.currentItemData.CourseList &&
        this.currentItemData.CourseList != ""
      ) {
        existCourse = this.currentItemData.CourseList.split(",");
      }

      this.checkBoxAddItem = [];

      //将搜索出来的结果中，选中那些已经是本班课程的打钩
      this.$nextTick(() => {
        this.searchCourseList.forEach(searchItem => {
          existCourse.forEach(existItem => {
            if (searchItem.Id == existItem) {
              this.checkBoxAddItem.push(searchItem.Id);
            }
          });
        });
      });
      this.showSearchStuResult = true;
    },
    // 向班级添加课程
    async addCourseToClass() {
      if (this.checkBoxAddItem.length < 1) {
        this.$message({
          message: "还没有选中要添加的课程",
          type: "warning"
        });
        return;
      }
      let res = await addClassCourse(
        this.currentItemData.Id,
        "",
        this.checkBoxAddItem
      );
      this.selectExistCourse = [];
      this.$message({
        message: "操作成功",
        type: "success"
      });
      this.currentItemData.CourseList = this.checkBoxAddItem.join(",");

      this.$emit("subClickEvent", 1, this.currentItemData);
    },
    // 当复选框发生改变时获取所选中的项
    changeSelectStu(checked, item) {
      if (checked) {
        this.selectExistCourse.push(item.Id);
      } else {
        let newCheckList = [];
        this.selectExistCourse.forEach(olditem => {
          if (olditem == item.Id) {
          } else {
            newCheckList.push(olditem);
          }
        });
        this.selectExistCourse = newCheckList;
      }
    },
    // 移除班级课程
    async removeClassStudent() {
      if (this.selectExistCourse.length == 0) {
        this.$message({
          message: "还没有勾选课程",
          type: "warning"
        });
      } else {
        this.$confirm("你确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let newclassCourse = this.classAllCourseList.filter(item => {
            if (!this.selectExistCourse.includes(item.Id)) {
              return item;
            }
          });
          let newClassCourseIDS = [];
          newclassCourse.forEach(item => {
            newClassCourseIDS.push(item.Id);
          });

          let res = await addClassCourse(
            this.formItemData.Id,
            "",
            newClassCourseIDS
          );
          this.classAllCourseList = res.data;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.formItemData.CourseList = newClassCourseIDS.join(",");
          if (isNaN(this.formItemData.OpenTime)) {
            this.formItemData.OpenTime = Math.floor(
              this.formItemData.OpenTime.getTime() / 1000
            );
          } else {
            this.formItemData.OpenTime = Math.floor(
              this.formItemData.OpenTime / 1000
            );
          }
          if (isNaN(this.formItemData.Endtime)) {
            this.formItemData.Endtime = Math.floor(
              this.formItemData.Endtime.getTime() / 1000
            );
          } else {
            this.formItemData.Endtime = Math.floor(
              this.formItemData.Endtime / 1000
            );
          }
          if (isNaN(this.formItemData.Createtime)) {
            this.formItemData.Createtime = Math.floor(
              this.formItemData.Createtime.getTime() / 1000
            );
          } else {
            this.formItemData.Createtime = Math.floor(
              this.formItemData.Createtime / 1000
            );
          }
          this.$emit("subClickEvent", 1, this.formItemData);
        });
      }
    }
  }
};
</script> 
<style scoped>
.quan_xian_item {
  width: calc(100% / 2);
}
</style> 