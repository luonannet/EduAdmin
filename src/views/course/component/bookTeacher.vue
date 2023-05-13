<template>
  <div class="p_both10 p-t-5">
    <div class="m-t-20" v-show="showSearchStuResult">
      <div class="m-t-20 center flex_wrap m-l-15">
        <el-checkbox-group v-model="checkBoxAddStu">
          <el-checkbox
            :label="item.Id"
            class="m-b-5"
            :key="item.Id"
            v-for="item in serachStuList"
          >{{item.Realname}}（{{cutTelephone(item.Tel)}}）</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="m-t-30 center-end">
        <el-button type="primary" @click="addTeacherToBook" class="border0">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllManagerOfPlatform } from "@/api/platform";
import { setBookEditors } from "@/api/book";

import common from "@/utils/common";
export default {
  name: "ClassTeacher",
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
      // 搜索表单数据
      stuSearchForm: {
        searchPhone: "",
        searchName: ""
      },
      queryFromLabel: false, // 是否根据这个学员的录入员进行查询
      // 日期选择-日期筛选
      queryEndDate: null,
      // 查询学员所选条件值
      seaechConditionVal: "",
      // 查询学员内容的值
      searchContentVal: "",
      // 搜索学生的类型-条件查询
      searchTypeVal: "realname",
      // 查询学员的条件选项
      searchCustomOptions: [
        {
          value: "realname",
          Label: "姓名"
        },

        {
          value: "tel",
          Label: "电话"
        },
        {
          value: "comments",
          Label: "备注"
        }
      ],
      // 搜索表单验证
      stuSearchFormRules: {
        searchPhone: [
          {
            pattern: /^\d{5,11}$/,
            message: "请输入正确的手机号，且不得少于5位数",
            trigger: "blur"
          }
        ]
      },
      // 数据总条数-分页
      allRows: 0,
      // 当前页数-分页
      nowPage: 1,
      // 每页数据的总条-分页
      rows: 40,
      // 查找老师的列表-查找结果
      serachStuList: [],
      // 选中的要加入班级的老师
      checkBoxAddStu: [],
      // 是否显示添加老师模块
      ShowSearchForm: false,
      // 是否显示搜索老师的搜索结果模块
      showSearchStuResult: false,
      // 获取班级的所有老师
      classAllStuList: [],
      // 复选框所选中的老师ID
      selectExistTeachers: [],
      documentHeight: 500
    };
  },
  watch: {
    currentPlatform(newval) {
      this.fire();
    },
    formItemData(newval) {
      this.changeBook();
    }
  },
  methods: {
    // 获取班级的所有老师
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      this.searchTeacher();
    },
    cutTelephone(originTel) {
      return "电话末四位:" + originTel.substr(-4);
    },
    //修改教材
    changeBook() {
      let editors = this.formItemData.Editors.split(",");
      //将搜索出来的结果中，选中那些已经是本班老师的打钩
      this.$nextTick(() => {
        this.serachStuList.forEach(searchItem => {
          editors.forEach(selectItem => {
            if (searchItem.Id == selectItem) {
              this.checkBoxAddStu.push(searchItem.Id);
            }
          });
        });
      });

      this.showSearchStuResult = true;
    },
    // 查找老师
    async searchTeacher() {
      let that = this;
      // 取数据的位置
      const offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getAllManagerOfPlatform(this.currentPlatform, {
        onlyLive: true,
        needtotal: false
      });
      that.checkBoxAddStu = [];
      if (res.data) {
        that.serachStuList = res.data;
        this.changeBook();
      } else {
        that.serachStuList = [];
        that.$message({
          message: "没有找到老师",
          type: "warning"
        });
      }
    },
    // 添加老师
    async addTeacherToBook() {
      let that = this;
      if (this.checkBoxAddStu.length < 1) {
        this.$message({
          message: "还没有选中要添加的老师",
          type: "warning"
        });
        return;
      }
      let newStu = [...this.checkBoxAddStu];
      if (this.classAllStuList.length > 0) {
        this.classAllStuList.forEach(stuItem => {
          let index = newStu.indexOf(stuItem.ID);
          if (index != -1) {
            newStu.splice(index, 1);
          }
        });
      }
      if (newStu.length == 0) {
        this.$message({
          message: "该老师已经添加过了",
          type: "warning"
        });
        this.checkBoxAddStu = [];
        return;
      }
      let res = await setBookEditors(this.formItemData.Id, "", newStu);
      that.$emit("updateEditors", newStu.join(","));
      this.$message({
        message: "操作成功",
        type: "success"
      });
    },
    // 当复选框发生改变时获取所选中的项
    changeSelectStu(checked, item) {
      if (checked) {
        this.selectExistTeachers.push(item.id);
      } else {
        let newCheckList = [];
        this.selectExistTeachers.forEach(olditem => {
          if (olditem == item.id) {
          } else {
            newCheckList.push(olditem);
          }
        });
        this.selectExistTeachers = newCheckList;
      }
    },
    // 移除班级老师
    async removeClassTeacher() {
      if (this.selectExistTeachers.length == 0) {
        this.$message({
          message: "还没有勾选老师",
          type: "warning"
        });
      } else {
        this.$confirm("你确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          let res = await removeClassTeacher(
            this.formItemData.Id,
            "",
            this.selectExistTeachers
          );
          this.classAllStuList = res.data;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.selectExistTeachers = [];
        });
      }
    }
  }
};
</script> 
<style scoped>
.quan_xian_item {
  width: calc(100% / 5);
}
</style> 