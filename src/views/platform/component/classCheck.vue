<template>
  <!-- 考勤记录表单 -->
  <div>
    <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <p class="marg10 color-red" v-show="isRightTeacher==false">您不是本课程的授课老师，不允许填写下面的考勤资料。</p>
    <el-form
      :model="classCheck"
      :rules="ClassCheckRules"
      ref="ClassCheckElForm"
      label-width="100px"
      style="padding:10px 10px 10px 10px"
      size="small"
      class="dialog-body-pad"
      :disabled="isRightTeacher==false"
    >
      <p
        class="text-center m-b-20 color-c0c4cc font16"
        v-if="!editEnable"
      >于 {{common.dateFormat(classCheck.Createtime)}} 日已完成考勤，不允许再修改。</p>
      <el-form-item label="教教材目">
        <el-input v-model="classDaily.BookLabel" disabled></el-input>
      </el-form-item>
      <el-form-item label="上课时间">
         
        <el-input v-model="classTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="计划课时">
        <el-input v-model="classDaily.CourseNum" disabled></el-input>
      </el-form-item>
      <el-form-item label="实际课时" prop="ShiJi">
        <span v-if="!editEnable">{{classCheck.ShiJi}}</span>
        <el-input
          v-else
          v-model.number="classCheck.ShiJi"
          :disabled="!isRightTeacher"
          placeholder="请输入实际上课课时"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="!editEnable" label="缺勤学员">
        <div class="flex_mid flex_wrap">{{classCheck.Check}}</div>
      </el-form-item>
      <el-form-item v-else label="选择缺勤学员">
        <div class="flex_mid flex_wrap">
          <el-checkbox-group v-model="missClaaStuList" :disabled="classCheck.Createtime>0">
            <el-checkbox
              :key="item.ID"
              :label="item"
              v-for="item in classAllStuList"
            >{{item.Realname}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>

      <el-form-item label="考勤照片" prop="Dianmingbiao">
        <div class="flex_dom flex_wrap">
          <div class="relative marg15" v-for="(item,index) in classCheck.Dianmingbiao" :key="index">
            <el-tooltip class="item cursor" effect="dark" :content="item.Label" placement="top">
              <img
                v-if="item.ImgSrc"
                class="wid20"
                :src="item.ImgSrc"
                @click="onPreview(item.ImgSrc)"
              />
            </el-tooltip>
            <div v-if="editEnable" class="between-center m-v-5 wid80">
              <el-upload
                :auto-upload="false"
                action
                :show-file-list="false"
                :on-change="function(file, fileList){return updateClassCheckImg(file, fileList,index)}"
              >
                <i class="el-icon-edit color-333"></i>
              </el-upload>
            </div>
            <div v-if="editEnable" class="deleImgIcon cursor" @click="deleClassCheckImg(index)">
              <img src="/assets/slice/deleteIcon.png" alt />
            </div>
          </div>
          <el-upload
            :auto-upload="false"
            action
            v-if="editEnable&&isRightTeacher"
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="uploadClassCheckImg"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="教学进度" prop="Jindu">
        <span v-if="!editEnable">{{classCheck.Jindu}}</span>
        <div class="center" v-else>
          <el-input
            v-model="classCheck.Jindu"
            :disabled="!isRightTeacher"
            placeholder="请输入教学进度，例如30-20页"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="教学内容" prop="JiaoxueNeirong">
        <span v-if="!editEnable">{{classCheck.JiaoxueNeirong}}</span>
        <el-input
          v-else
          v-model="classCheck.JiaoxueNeirong"
          type="textarea"
          :disabled=" !isRightTeacher"
          :rows="4"
          placeholder="请输入教学内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="around-center hgt60 bge0e3ea">
      <div>
        <el-button
          @click="cancleOperation"
          class="m-r-30"
        >{{editEnable&&isRightTeacher?'取 消':'关 闭'}}</el-button>
        <el-button
          type="primary"
          v-if="editEnable&&isRightTeacher"
          @click="saveClassCheck"
          class="m-l-40"
        >保 存</el-button>
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
  handOutTask,
  getAllClassTaskRecord
} from "@/api/class";
import common from "@/utils/common";
import $ImgAPI from "@/api/ImgAPI";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
export default {
  name: "ClassCheckForm",
  components: {
    myImageViewer
  },
  props: {
    classDaily: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 考勤记录的表单数据
      classCheck: {
        Dianmingbiao: []
      },
      // 课堂考勤的表单验证
      ClassCheckRules: {
        ShiJi: [
          { required: true, message: "实际课时不能为空", trigger: "blur" }
        ],
        Dianmingbiao: [
          { required: true, message: "必须上传考勤表或者现场照片", trigger: "blur" }
        ],
        Jindu: [{ required: true, message: "教学进度必填", trigger: "blur" }],
        JiaoxueNeirong: [
          { required: true, message: "教学内容必填", trigger: "blur" }
        ]
      },
      // 上课时间
      classTime: "",
      // 存放班级所有的学员
      classAllStuList: [],
      // 班级的学生人数
      planStudentNum: null,
      // 缺勤的学生
      missClaaStuList: [],
      // 根据姓名搜索学员
      searchStudentName: "",
      // // 搜索结果-学生
      // searchResultStuList: [],
      // 是否显示搜索学生的模块
      isShowSearchStuDIv: false,
      // 考勤记录是否可以编辑
      editEnable: true,
      // 判断是不是当前老师在操作考勤，非本老师只可以查看
      isRightTeacher: true
    };
  },
  methods: {
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false;
    },

    // 考勤表的图片上传
    async uploadClassCheckImg(file) {
      let that = this;
      let res = await $ImgAPI.UploadImg("courseTime/0", file.raw);
      if (res.code == 200) {
        that.$message({
          message: "操作成功",
          type: "success"
        });
        let ImgItem = { ImgSrc: res.data, Label: file.raw.name };
        that.classCheck.Dianmingbiao.push(ImgItem);
      } else {
        that.$message({
          message: res.title,
          type: "warning"
        });
      }
    },
    // 更换考勤表的图片
    async updateClassCheckImg(file, fileList, index) {
      let that = this;
      let res = await $ImgAPI.UploadImg("courseTime/0", file.raw);
      if (res.code == 200) {
        that.$message({
          message: "操作成功",
          type: "success"
        });
        let ImgItem = { ImgSrc: res.data, Label: file.raw.name };
        that.classCheck.Dianmingbiao.splice(index, 1, ImgItem);
      } else {
        that.$message({
          message: res.title,
          type: "warning"
        });
      }
    },
    // 删除考勤表的图片
    deleClassCheckImg(index) {
      this.classCheck.Dianmingbiao.splice(index, 1);
    },
    // 保存考勤记录
    saveClassCheck() {
      this.$refs.ClassCheckElForm.validate(async valid => {
        if (valid) {
          let checkObj = { ...this.classCheck };
          checkObj.Dianmingbiao = JSON.stringify(checkObj.Dianmingbiao); 
          let temp = [];
          this.missClaaStuList.forEach(item => {
            temp.push(item.id);
            if (checkObj.Check) {
              checkObj.Check = checkObj.Check + "," + item.Realname;
            } else {
              checkObj.Check = item.Realname;
            }
          });
          checkObj.QueqingStudent = temp.join(",");
          checkObj.planStudentNum = this.classAllStuList.length;
          checkObj.ShidaoNumber = this.planStudentNum - temp.length;

          let res = await addClassCheck(this.classDaily.Id, "", checkObj);
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$emit("subAddClassCheckEvent", res.data);
          }
          this.editEnable = false;
        } else {
          return false;
        }
      });
    },
    // 获取考勤记录
    async getClassDaily() {
     
      this.classAllStuList = this.classDaily.stuList;
      this.planStudentNum = 0;
      if (this.classAllStuList) {
        this.planStudentNum = this.classAllStuList.length;
      }
      this.classCheck = JSON.parse(this.classDaily.Check); 
      this.classCheck.Dianmingbiao = JSON.parse(this.classCheck.Dianmingbiao);
    },
    async getClassStudent() {
      let res = await getClassStu(this.classDaily.ClassID);
      this.classAllStuList = res.data ? res.data : [];
    },

    // 关闭考勤记录模态框
    cancleOperation() {
      this.$emit("subAddClassCheckEvent");
    }
  },

  mounted() {
    if (this.classDaily.TeacherID == this.$store.getters.manager.Id) {
      this.isRightTeacher = true;
    } else {
      this.isRightTeacher = false;
    }
     this.classTime = this.classDaily.StartTime + '-' + this.classDaily.EndTime;
    this.editEnable = !this.classDaily.Check;
  
    if (!this.editEnable) {
      this.getClassDaily();
    } else {
      this.getClassStudent();
    }
  }
};
</script>  
<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  box-sizing: border-box;
  margin-top: 15px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.deleImgIcon {
  position: absolute;
  top: -10px;
  right: -3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  z-index: 10;
}
</style>