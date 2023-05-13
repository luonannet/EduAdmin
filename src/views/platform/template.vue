<template>
  <div class="font16 hgt_full" v-cloak>
    <div :style="{height:(documentHeight-150)+'px',overflow:'auto'}">
      <div class="p-t-20">
        <platformPageCard
          v-for="(item, index) in templateList"
          :key="index"
          @delete="deleteTemplate"
          @edit="editeTemplate"
          :index="index"
          :pageTemplateItem="item"
        />
      </div>
    </div>
    <el-button type="primary" @click="createTemplate" class="m-t-10">新增页面</el-button>
    <!-- 班级相关操作的模态框 -->
    <my-dialog
      :visible.sync="editDialog"
      :title="'页面地址:          '+classFormData.url "
      :showLeft="false"
    >
      <div slot="right_content" class="flex_dom hgt_100">
        <platformTemplateDetail
          :formItemData="classFormData"
          @updateRowData="updateListItem"
          :currentPlatform="currentPlatform"
        />
      </div>
    </my-dialog>
  </div>
</template> 
<script>
import platformTemplateDetail from "@/views/platform/component/platformTemplateDetail";
import platformPageCard from "@/views/platform/component/platformPageCard";
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
import { getWebTemplate, deleteWebTemplate } from "@/api/platform";
import { isDate } from "xe-utils/methods";
export default {
  name: "templateList",
  components: {
    myDialog,
    platformTemplateDetail,
    platformPageCard
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
      templateList: [],
      // 模态框获得的单条班级数据
      classFormData: {},
      // 当前操作的班级数据的索引
      currentIndex: 0,
      // 模态框当前激活的标签页
      activeClassTabs: "bbxy",
      // 控制班级更多操作的弹出框
      moreOperationDialog: false,
      classStudentsDialog: false,
      searchClassLabel: "",
      searchGrade: new Date(),
      // 当前的校区id
      currentPlatform: 0,
      // 更多操作弹窗
      editDialog: false,
      documentHeight: 500
    };
  },
  methods: {
    onChangeTabs(item) {
      item.$children[0].fire();
    },
    // 获取所有班级的列表
    async getAllTemplate() {
      let that = this;
      let year = 0;
      if (isDate(that.searchGrade)) {
        year = that.searchGrade.getFullYear();
      } else {
        year = that.searchGrade;
      }
      // 取数据的位置
      let offsetRow = (that.nowPage - 1) * that.rows;
      let res = await getWebTemplate(that.currentPlatform + "/all");
      if (res.data) {
        for (var key in res.data) {
          let item = null;
          item = res.data[key];
          if (item) {
            let jsonItem = JSON.parse(item);
            jsonItem.url = key;
            that.templateList.push(jsonItem);
          }
        }
      }
    },
    // 启用
    enableTemplate(index, row) {
      this.classFormData = { ...row };
      this.classStudentsDialog = true;
      this.currentIndex = index;
    },
    // 编辑
    editeTemplate(index, row) {
      this.classFormData = { ...row };
      this.editDialog = true;
      this.currentIndex = index;
    },

    async deleteTemplate(index, row) {
      if (row.url == "index") {
        this.$alert("这是首页.不能删掉.您可以修改内容.", "警告");

        return;
      }
      this.$prompt("请输入你要删除的页面地址确认", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "邮箱格式不正确"
      }).then(async ({ value }) => {
        if (value != row.url) {
          this.$message({
            message: "输入错误.不予删除",
            type: "warning"
          });
          return;
        }

        this.$confirm("你确定要删除吗？删了之后找不回来哦", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let res = await deleteWebTemplate(
            this.currentPlatform + "/" + row.url
          );
          this.$message({
            message: "删除成功",
            type: "success"
          });

          let hasIn = false;
          this.templateList.forEach(item => {
            if (item.url == row.url) {
              this.templateList.splice(index, 1);
            }
          });
        });
      });
    },
 
    //打开班级信息模态框
    createTemplate(type) {
      this.$prompt(
        "请输入新页面的地址,一般是英文或者英文和数字组合,请不要使用汉字",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(async ({ value }) => {
        this.classFormData = {};
        this.classFormData.url = value;
        this.classFormData.label = "请修改页面备注";
        this.classFormData.content = "<div > 这个页面刚刚建好,还没填写内容</div>";
        this.editDialog = true;
        return;
      });
    },
    // 添加班级成功之后更新表格数据-班级列表
    updateListItem(rowData) {
      let hasIn = false;
      this.templateList.forEach(item => {
        if (item.url == rowData.url) {
          console.log(item.label, rowData.label);
          item.label = rowData.label;
          item.content = rowData.content;
          hasIn = true;
        }
      });
      if (hasIn == false) {
        this.templateList.push(rowData);
      }
    },

    // 格式化日期
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue);
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getAllTemplate();
    },
    // 条件搜索
    searchSubmit() {
      this.nowPage = 1;
      this.getAllTemplate();
    }
  },
  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = parseInt(paths[paths.length - 1]);
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    this.nowPage = 1;
    this.documentHeight = document.body.clientHeight;
    this.getAllTemplate();
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