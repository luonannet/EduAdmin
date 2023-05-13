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
            <img :src="currentItemData.icon" width="100px" height="100px" />
          </el-upload>
        </el-tooltip>
        <div class="flex_1 m-l-30">
          <div class="flex_dom">
            <el-form-item label="新闻类别">
              <el-select v-model="currentItemData.KindID" placeholder="请选择类别">
                <el-option
                  :label="item.Label"
                  :key="index"
                  :value="item.value"
                  v-for="(item,index) in kindList"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件">
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
          <el-form-item label="新闻标题" prop="Title">
            <el-input placeholder="请输入内容" v-model="currentItemData.Title"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="副标题">
        <el-input placeholder="请输入内容" v-model="currentItemData.Description"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <Tinymce ref :height="400" v-model="currentItemData.Content"   :id="currentItemData.Id"></Tinymce>
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
import { editNewsRow, addNewsRow } from "@/api/news";
import common from "@/utils/common";
import $ImgAPI from "@/api/ImgAPI";
export default {
  name: "newsForm",
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
        Title: [{ required: true, message: '标题不能为空', trigger: "blur" }]
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
    setData() {
      this.currentItemData = this.formItemData;
    },


    // 上传的图片
    async newsImgUpload(file) {
      let that = this;
      let res = await $ImgAPI.UploadImg("news/0", file.raw);
      if (res.code == 200) {
        that.currentItemData.icon = res.data;
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
        let res = await $ImgAPI.UploadImg("news/0", file.raw);
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
      this.currentItemData.Platform = this.platform;
      this.currentItemData.Isnews = 1;
      this.$refs.newsForm.validate(async valid => {
        if (valid) {
          this.currentItemData.Isnews = 1; //新闻
          if (this.currentItemData.Id > 0) {
            // 编辑数据
            let res = await editNewsRow(
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
            let res = await addNewsRow("", "", this.currentItemData);
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