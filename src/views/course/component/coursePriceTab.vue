<template>
  <div>
    <el-form style="padding:10px 0px 0px 0px" label-width="80px" size="small">
      <el-form-item label="绑定教材">
        <div style="display:flex">
          <el-input v-model="searchSubjectContent" placeholder="请输入搜索的教材名称" class="m-r-12 flex_1" />
          <el-button type="primary" @click="getBookList">查询</el-button>
        </div>
      </el-form-item>
      <el-form-item label="可选教材">
        <div class="addSubject flex_dom flex_wrap">
          <p v-for="(item,index) in allBookList" :key="item.Id">
            {{ item.Label }}
            <i class="el-icon-circle-plus" @click="addBookToSourse(item,index)" style="margin-right:30px"/>
          </p>
        </div>
      </el-form-item>
    </el-form>
    <vxe-grid
      border
      :height="documentHeight"
      resizable
      :data.sync="currentCourseBooks"
      :edit-config="{trigger: 'click', mode: 'row'}"
      :columns="coursePriceColumnTitle"
    />
    <div class="between-center m-v-15">
      <el-button type="primary" @click="insertColumns">新增课程有效期</el-button>
      <el-button type="primary" @click="saveCoursePrice">保存</el-button>
    </div>
  </div>
</template>
<script>
import { saveCoursePriceList, getCoursePriceList } from "@/api/course";
import { queryBookList } from "@/api/book";
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
      // 学院默认选中第一项
      collegeIndex: 0,
      currentItemData: {},
      currentCourseBooks:[],
      // 设置价格表格列字段
      coursePriceColumnTitle: [],
      // 存储价格的列名称
      priceColumnTitle: [],

      tableColumnValue: [],
      // 存储课程类别下查找的科目
      allBookList: [],
      CourseKindsOps: [],
      // 查找教材搜索内容
      searchSubjectContent: "",
      documentHeight: 500
    };
  },
  watch: {
    formItemData(newval) {
      this.fire();
    }
  },

  methods: {
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      if (!this.formItemData || !this.formItemData.Id) {
        console.log("-----------走了")
        return;
      }
      this.currentItemData = this.formItemData;
      this.getCoursePrice();
    },
    //  选中学院后回调
    collegeChangeGetCourseKind(index) {
      this.allBookList = [];
      this.currentItemData.TCourseKindID = null;
      this.currentItemData.TCollegeID = this.$store.getters.app.collegeWithCourseKind[
        index
      ].Id;
      this.CourseKindsOps = [
        ...this.$store.getters.app.collegeWithCourseKind[index].Children
      ];
      if (this.CourseKindsOps.length > 0) {
        this.currentItemData.TCourseKindID = this.CourseKindsOps[0].Id;
        this.courseKindLabel = this.CourseKindsOps[0].Label;
        // this.getBookList();
      }
    },
    saveCourse: function() {
      this.$refs.refCourseForm.validate(async valid => {
        if (valid) {
          const res = await editCourse(
            this.currentItemData.Id,
            "",
            this.currentItemData
          );
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("subClickEvent", 1, res.data);
          }
        } else {
          return false;
        }
      });
    },
    // 查找课程类别下的教材
    async getBookList() {
      this.allBookList = [];
      let params = { coursekind: this.courseKindLabel };
      if (this.searchSubjectContent) {
        params = { label: this.searchSubjectContent };
      }
      const res = await queryBookList("", params);
      if (res.code == 200) {
        this.allBookList = res.data ? res.data : [];
      }
    },
    // 获取科目价格
    async getCoursePrice() {
      // 初始化数据
      this.coursePriceColumnTitle = [
        { title: "ID", field: "Id", width: 70 },
        { title: "教材名称", field: "Label" }
      ];
      this.priceColumnTitle = [];
      this.currentCourseBooks = [];
      if (!this.currentItemData.Id) {
        return;
      }
      const res = await getCoursePriceList(this.currentItemData.Id);
      if (res.code == 200) {
        for (const items of res.data.Children) {
          for (const item in items) {
            if (
              this.priceColumnTitle.indexOf(item) == -1 &&
              item != "Id" &&
              item != "Label" &&
              item != "TCourseHasBookId"
            ) {
              this.priceColumnTitle.push(item);
            }
          }
        }
        if (this.priceColumnTitle.length > 0) {
          this.priceColumnTitle.forEach(name => {
            this.coursePriceColumnTitle.push({
              editRender: { name: "input" },
              field: name,
              title: name + "天"
            });
            this.tableColumnValue.push(name);
          });
        }
        this.currentCourseBooks = res.data.Children;
      }
    },
    // 给课程关联学科
    addBookToSourse(subjectItem, index) {
      let has = false;
      this.currentCourseBooks = this.currentCourseBooks  ? this.currentCourseBooks  : [];
      this.currentCourseBooks.forEach(item => { 
        if (parseInt(item.Id) ==  subjectItem.Id) {
          has = true;
        }
      });
      if (!has) {
        let courseBookitem = {};
        courseBookitem.Label = subjectItem.Label;
        courseBookitem.Id = subjectItem.Id + "";
        courseBookitem.TCourseId = this.currentItemData.Id + "";
        courseBookitem.TopicNum = subjectItem.Topic + "";
        this.currentCourseBooks.push(courseBookitem);  
      }else{
         this.$message({
            message: subjectItem.Label+"已经添加到了本课程",
            type: "warning"
          });
      }
    },
    // 新增课程有效期列
    insertColumns() {
      this.$prompt("请输入有效期.(填数字，单位天）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (isNaN(value)) {
            this.$message({
              message: "请填写数字",
              type: "warning"
            });
            return;
          }
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.coursePriceColumnTitle.push({
            editRender: { name: "input" },
            field: value,
            title: value + "天"
          });
          this.tableColumnValue.push(value);
          // 添加列后,将字段添加到数据表中
          for (const items of this.currentCourseBooks) {
            items[value] = null;
          }
        })
        .catch(() => {});
    },
    // 保存价格
    saveCoursePrice() {
      for (const items of this.currentCourseBooks) {
        for (const item in items) {
          if (items[item] == null || items[item] == "") {
            this.$alert("价格不能为空", "提示", {
              confirmButtonText: "确定",
              type: "warning",
              callback: action => {}
            });
            return;
          }
        }
      }
      this.$confirm("只可提交一次,确认提交吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const urlParams = "?id=" + this.currentItemData.Id;
          const res = await saveCoursePriceList(
            urlParams,
            "",
            this.currentCourseBooks
          );
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getCoursePrice();
          }
        })
        .catch(e => {});
    }
  }
};
</script>
<style scoped>
</style>
