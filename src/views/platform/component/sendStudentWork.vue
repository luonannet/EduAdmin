<template>
  <div>
    <el-form :inline="true">
      <el-form-item label>
        <el-upload
          :auto-upload="false"
          action
          :show-file-list="true"
          :file-list="fileList"
          :on-change="uploadBannerImg"
        >
          <el-button size="small" type="primary">上传作品</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="作品名称:">
        <el-input placeholder="输入这次作品的名字 以便区别" v-model="workName" />
      </el-form-item>
      <el-form-item label="备注:">
        <el-input  v-model="workDescription" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" class="m-l-10" @click="sendToStudents">发给学员</el-button>
      </el-form-item>
    </el-form>
    <div></div>
    <el-table
      tooltip-effect="light"
      :data="oldWorkList"
      border
      style="width: 100%"
     :height="documentHeight"
      ref="refElTabel"
    >
      <el-table-column prop="WorkName" label="作品记录" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="TeacherLabel" label="老师" width="110"></el-table-column>
      <el-table-column prop="Createtime" label="发送时间" :formatter="TimeFormatter" width="110"></el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        :current-page.sync="nowPage"
        :page-size="rows"
        layout="total,prev, pager, next, jumper"
        :total="allRows"
        @current-change=" getClassOldWorks"
      />
    </div>
  </div>
</template>

<script>
import { getClassOldWorks, sendStudentsWorks } from "@/api/class";
import $ImgHttp from "@/api/ImgAPI";
import common from "@/utils/common";
import { isDate } from "xe-utils/methods";
export default {
  props: {
    classItem: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  data() {
    return {
      common,
      workName: "",
      workDescription:"这个老师比较懒 这句话都没删",
      fileList: [],
      // 数据总条数-分页
      allRows: 0,
      // 当前页数-分页
      nowPage: 1,
      // 每页数据的总条-分页
      rows: 40,
      // 单条学员的数据
      customFormData: {},
      //这个班级曾经发过的作品
      oldWorkList: [], 
    };
  },
  watch: {
    classItem(newval) {
      this.fire();
    }
  },

  mounted() {this.fire();},
  methods: {
     fire() { this.documentHeight = document.body.clientHeight-400;
 
      this.getClassOldWorks();
      let now = new Date();
      this.workName =
        this.classItem.Label +
        "】" +
        now.getMonth() +
        "月" +
        now.getDate() +
        "日 " +
        now.getHours() +
        ":" +
        now.getMinutes() +
        " 分的作品";
    },
    // 图片上传
    async uploadBannerImg(file) {
      let res = await $ImgHttp.UploadImg(
        "studentWork/0?attach=" + file.name,
        file.raw
      );

      if (res.code != 200) {
        this.$message({
          message: res.data,
          type: "warning"
        });
        return;
      }
      this.fileList.push({ name: res.title, url: res.data });
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.$forceUpdate();
    },
    // 格式化显示时间
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, 2);
    },
    // 添加或编辑数据
    async sendToStudents() {
      if (this.fileList.length == 0) {
        this.$message({
          message: "你还没有上传作品",
          type: "warning"
        });
        return;
      }
      let res = await sendStudentsWorks(
        this.classItem.Id,
        { workname: this.workName,workDescription:this.workDescription },
        this.fileList
      );
      this.$message({
        message: "发送成功",
        type: "success"
      });
      this.oldWorkList.unshift(res.title);
    },
    async getClassOldWorks() {
      let res = await getClassOldWorks(this.classItem.Id, "");
      this.oldWorkList = res.data;
      this.allRows = res.title;
    }
  }
};
</script>  