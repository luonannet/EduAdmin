
<template>
  <!-- --------------------证书----------------------- -->
  <div class="p_both10">
    <el-table
      :data="certList"
      border
      tooltip-effect="dark"
      style="width: 100%"
      :height="documentHeight"
    >
      <el-table-column prop="Imageurl" label="证书预览">
        <template slot-scope="scope">
          <img :src="scope.row.Imageurl" style="width:500px;height:auto" />
        </template>
      </el-table-column>

      <el-table-column label width="300" fixed="right">
        <template slot-scope="scope">
          <el-form
            ref="refbuyCourse"
            :rules="buyCourseRules"
            label-width="80px"
            style="padding:0px  ;height:400px"
            size="small"
            class="dialog-body-pad openAddCert"
          >
            <el-form-item label="证书名称:">
              <span>{{scope.row.Label}}</span>
            </el-form-item>
            <el-form-item label="证书编号:">
              <span>{{scope.row.SN}}</span>
            </el-form-item>
            <el-form-item label="身份证号:">
              <span>{{scope.row.IDcard}}</span>
            </el-form-item> 
            <el-form-item label="上传时间:">
              <span>{{common.dateFormat(scope.row.Createtime, 2)}}</span>
            </el-form-item>
            <el-form-item label="上传人:">
              <span>{{scope.row.ManagerLabel}}</span>
            </el-form-item>

            <el-form-item label="备注:">
              <span>{{scope.row.Comment}}</span>
            </el-form-item>
            <el-form-item label>
              <div class="flex_dom">
                <el-button type="warning" @click="openUpdateCert(scope.row,scope.$index)">修改</el-button>

                <el-button type="danger" @click="deleteCert(scope.row.Id,scope.$index)">删除</el-button>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <div class="between-center">
      <el-button type="primary" class="m-v-15" @click="openAddCert()">添加证书</el-button>
      <el-pagination
        background
        :current-page.sync="nowPage"
        :page-size="rows"
        layout="total,prev, pager, next, jumper"
        :total="allRows"
        @current-change=" getCertListNowpage"
      />
    </div>
    <!-- 添加证书 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addCertDialog"
      :append-to-body="true"
      width="500px"
      title="添加证书"
    >
      <el-form
        ref="refAddNewForm"
        :model="newCertificate"
        :rules="buyCourseRules"
        label-width="80px"
        style="padding:30px  "
        size="small"
        class="dialog-body-pad openAddCert"
      >
        <el-form-item label="证书名称">
          <el-input v-model="newCertificate.Label" placeholder="填写证书的名称" />
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input v-model="newCertificate.SN" placeholder="填写证书的编号" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input :disabled="customData.IDcard&&customData.IDcard.length>10" v-model="newCertificate.IDcard" @input="$forceUpdate()" placeholder="对方身份证" />
        </el-form-item>
        <el-form-item label="证书图片">
          <el-upload
            :auto-upload="false"
            action
            :show-file-list="false"
            :on-change="uploadCertificateImg"
          >
            <i class="el-icon-edit color-333" />
          </el-upload>
          <img :src="newCertificate.Imageurl" style="width:350px;height:auto" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input :rows="5" v-model="newCertificate.Comment" />
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <el-button @click="addCertDialog = false">取 消</el-button>
        <el-button type="primary" class="m-l-40" @click="saveAddCert">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryStudentCert } from "@/api/student";
import { addCert, updateCert, listCert, deleteCert } from "@/api/certificate";

import $ImgHttp from "@/api/ImgAPI"; 
import common from "@/utils/common";
export default {
  name: "studentCertificate",
  props: {
    // 学员数据
    customData: {
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
      rows: 4,
      sendSMS: true,
      // 学员Id
      customID: null,
      // 该学员所有的购买记录
      certList: [],
      // 添加购买记录弹出框
      addCertDialog: false,
      // 添加购买记录的表单数据
      newCertificate: { Imageurl: "" },
      // 学习的时长-天
      courseStudyDay: 0,
      // 选中的课程类别ID的值
      selectCourseKindId: null,
      // 选中的课程类别Index的值
      selectCourseKindIndex: null,
      // 选中学院的Id
      selectCollegeid: null,
      // 选中学院的Index
      selectCollegeIndex: null,
      // 课程类别的选项列表
      courseKindsOps: [],
      // 课程的选项列表
      courseOptions: [],
      customItemData: {},
      // 表单验证
      buyCourseRules: {
        selectedCourseId: [
          { required: true, message: "课程不能为空", trigger: "blur" }
        ],
        courseStudyTime: [
          { required: true, message: "课时时效不能为空", trigger: "blur" }
        ],
        actualPrice: [
          { required: true, message: "实际金额不能为空", trigger: "blur" }
        ]
      },
      documentHeight: 500
    };
  },
  watch: {
    customData(newval) {
      this.fire();
    }
  },

  methods: {
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      this.certList = [];
      this.customItemData = this.customData;
      this.newCertificate.IDcard =  this.customData.Idcard;
      this.getCertListNowpage();
    },

    forceUpdate($event) {
      this.$forceUpdate();
    },
    // 学员资料图片上传
    async uploadCertificateImg(file) {
      let res = await $ImgHttp.UploadImg("studentCert/0", file.raw);
      if (res.code != 200) {
        this.$message({
          message: res.data,
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "上传成功！",
        type: "success"
      });
      this.newCertificate.Imageurl = res.data;
    },

    // 点击添加购买课程记录
    openAddCert() {
      this.addCertDialog = true;
      this.newCertificate = { Imageurl: "" };
      this.newCertificate.IDcard = this.customData.Idcard;
      this.newCertificate.Tel = this.customData.Telephone;
      this.newCertificate.TStudentID = this.customData.id;  
    },
    openUpdateCert(item, index) {
      this.addCertDialog = true;
      this.selectCollegeIndex = index;
      this.newCertificate = item;
    },

    // 保存新增合同
    async saveAddCert() {
      this.$refs["refAddNewForm"].validate(async valid => {
        if (valid) {
          let res;
          if (this.newCertificate.Id > 0) {
            res = await updateCert(
              this.newCertificate.Id,
              "",
              this.newCertificate
            );
          } else {
            res = await addCert("", "", this.newCertificate);
          }

          if (this.newCertificate.Id > 0) {
            this.$set(this.certList, this.selectCollegeIndex, res.data);
          } else {
            this.certList.unshift(res.data);
            this.allRows = this.allRows + 1;
          }
          this.addCertDialog = false;
          this.$message({
            message: "操作成功",
            type: "success"
          });
        } else {
          return false;
        }
      });
    },

    // 显示日期处理
    dateFormat(row, column, cellValue, index) {
      return this.common.dateFormat(cellValue, false);
    },

    // 获取学员列表-tableData
    async getCertList() {
      const that = this;
      this.listLoading = true;
      // 取数据的位置
      const offsetRow = (this.nowPage - 1) * this.rows;
      let res;

      // 校区-学员数据
      res = await listCert("/" + this.customData.id + "/0", {
        limit: this.rows,
        offset: offsetRow
      });

      if (res.code == 200) {
        this.certList = [];
        this.allRows = res.title;
        this.certList = res.data ? res.data : [];
      }
      this.listLoading = false;
    },

    // 分页获取数据
    getCertListNowpage(val) {
      this.nowPage = val;
      this.getCertList();
    },

    // 允许做题与否
    async onChangeExamHandler(checked, row, vedioOrExam) {
      const urlParams = row.Id + "/" + vedioOrExam + "/" + checked;
      const res = customAllowDoExercise(urlParams);
      if (res.code == 200) {
      }
    },
    // 删除购买记录
    deleteCert(id, index) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await deleteCert(id, "", "");
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.certList.splice(index, 1);
          }
        })
        .catch(() => {
          return false;
        });
    }
  }
};
</script>
<style scoped>
.openAddCert >>> .el-select,
.openAddCert >>> .el-date-editor,
.openAddCert >>> .el-input-number--small {
  width: 100%;
}
</style>
