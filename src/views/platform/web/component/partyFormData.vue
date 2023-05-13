<template>
  <!-- --------------------数据编辑或者添加表单组件----------------------- -->
  <div class="pad20">
    <el-form
      :model="currentItemData"
      :rules="newsFormRules"
      ref="newsForm"
      size="small"
      label-width="80px"
    >
      <div class="flex_mid m-b-20">
        <el-tooltip class="item" effect="dark" content="显示在列表前面的图片,点击可修改" placement="top-start">
          <el-upload
            :multiple="false"
            :on-change="newsImgUpload"
            :show-file-list="false"
            :auto-upload="false"
            action
          >
            <img :src="currentItemData.Icon" width="100px" height="100px" />
          </el-upload>
        </el-tooltip>
        <div class="flex_1 m-l-30">
          <div class="flex_dom">
            <el-form-item label="是否开启" prop="Status">
              <el-checkbox placeholder="请输入内容" v-model="currentItemData.Status"></el-checkbox>
            </el-form-item>
            <el-form-item label="开启时间" prop="Starttime">
              <el-date-picker placeholder="请输入内容" v-model="currentItemData.Starttime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="Endtime">
              <el-date-picker placeholder="请输入内容" v-model="currentItemData.Endtime"></el-date-picker>
            </el-form-item>
          </div>
          <div class="flex_dom">
            <el-form-item label="举办地址" prop="Status" style="width:100%">
              <el-input placeholder="输入举办地址" style="width:100%" v-model="currentItemData.Address"></el-input>
            </el-form-item>
          </div>

          <div class="flex_dom">
            <el-form-item label="活动标题" prop="Label" style="width:50%">
              <el-input placeholder="请输入内容" v-model="currentItemData.Label"></el-input>
            </el-form-item>
            <el-form-item label="附件" style="width:50%">
              <el-upload
                :multiple="false"
                :on-change="uploadEnclosure"
                :show-file-list="false"
                :auto-upload="false"
                action
              >
                <el-input placeholder="点击选择附件" v-model="currentItemData.Downfile" disabled></el-input>
              </el-upload>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item label="简介">
        <el-input placeholder="请输入内容" v-model="currentItemData.Description"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <Tinymce ref :height="400" v-model="currentItemData.Content" :id="currentItemData.Id"></Tinymce>
      </el-form-item>
    </el-form>
    <div class="center-end m-v-15">
      <el-button @click="cancleUpdate" class="m-r-30">取 消</el-button>
      <el-button type="primary" @click="saveNewsFormData">保 存</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { updateParty, addParty, getOne } from "@/api/party";
import common from "@/utils/common";
import $ImgAPI from "@/api/ImgAPI";
export default {
  name: "partyForm",
  props: {
    // 表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    platform: {
      typ: Number,
      default: 0
    },
    editEnable: {
      typ: Boolean,
      default: false
    },
    kindList: {
      typ: Array,
      default: []
    }
  },
  components: {
    Tinymce
  },
  data() {
    return {
      common,
      currentItemData: this.formItemData,
      // 表单验证
      newsFormRules: {
        Title: [{ required: true, message: "标题不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    },
    platform(newvar) {
      this.setData();
    },
    college(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    async setData() {
      this.currentItemData = this.formItemData;
      let res = await getOne(this.currentItemData.Id, "");
      if (res.code == 200) {
        this.currentItemData = res.data;
      }
    },

    // 上传的图片
    async newsImgUpload(file) {
      let that = this;
      let res = await $ImgAPI.UploadImg("party/0", file.raw);
      if (res.code == 200) {
        that.currentItemData.Icon = res.data;
      } else {
        that.$message({
          message: res.title,
          type: "warning"
        });
      }
    },
    // 上传附件
    async uploadEnclosure(file) {
      // 上传附件之前的验证
      let that = this;
      let RightType = this.common.beforeUploadEnclosure(file.name);
      if (RightType) {
        let res = await $ImgAPI.UploadImg("party/0", file.raw);
        if (res.code == 200) {
          that.currentItemData.Downfile = res.data;
        } else {
          that.$message({
            message: res.title,
            type: "warning"
          });
        }
      } else {
        that.$message({
          message: RightType,
          type: "warning"
        });
      }
    },
    // 添加或编辑数据
    saveNewsFormData() {
      // 验证表单数据
      this.currentItemData.PlatformID = this.platform;
      this.$refs.newsForm.validate(async valid => {
        if (valid) {
          if (this.currentItemData.Id > 0) {
            // 编辑数据
            let res = await updateParty(
              this.currentItemData.Id,
              "",
              this.currentItemData
            );
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.currentItemData = res.data;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit("updateRowData", res.data, 1);
            }
          } else if (this.currentItemData.Id == 0) {
            // 添加数据
            let res = await addParty("", "", this.currentItemData);
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.currentItemData = res.data;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$emit("updateRowData", res.data, 0);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 取消编辑或者添加
    cancleUpdate() {
      this.$emit("updateRowData");
    }
  }
};
</script> 
<style scoped>
</style>