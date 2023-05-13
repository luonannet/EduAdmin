<template>
  <div v-cloak class="font16 hgt_full" style="height:100%">
    <div class="flex_column hgt_full m-t-40">
      <el-form label-width="180px" class="demo-ruleForm" size="small">
        <el-form-item label="系统名称">
          <el-input v-model="common.systemForm.Name" placeholder="可以输入多个号码，用英文逗号,隔开" />
        </el-form-item>
        <div class="flex_dom">
        <el-form-item label="系统logo"> 
         
          <el-upload
            :auto-upload="false"
            action
            class="m-l-10"
            :show-file-list="false"
            :on-change="function(file, fileList){return ImgUploadQuestion(file, fileList)}"
          >
            <el-button>上传logo</el-button>
          </el-upload>
        </el-form-item>
         <img  height="50" :src="common.systemForm.Logo" />
        </div>
         <el-form-item label="短信落款">
          <el-input v-model="common.systemForm.SMSName" placeholder="必须和 短信提供商哪里设置的落款名完全一致，否则短信发送会失败" />
        </el-form-item>
         <el-form-item label="秘钥">
          <el-input type="textarea" :rows="6" v-model="common.systemForm.Secret" placeholder="请输入秘钥" />
        </el-form-item>
        <el-form-item label>
          <el-button @click="setSystemData">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import platformRowDetail from "@/views/system/component/platformRowDetail";
import myDialog from "@/components/myDialog/myDialog";
import $ImgHttp from "@/api/ImgAPI";
import common from "@/utils/common";
import { setSystemData } from "@/api/system";
export default {
  name: "setting",
  components: {
   
    myDialog,
    platformRowDetail
  },
  data() {
    return {
       common, 
      imgsrc:"",
      documentHeight:500,
    };
  },
  mounted() {
    this.fire();
  },
  methods: {
     fire() { this.documentHeight = document.body.clientHeight-400;
      this.imgsrc = this.common.systemForm.Logo;
    },

    // 题库上传图片
    async ImgUploadQuestion(file, fileList) {
      let that = this;
      let res = await $ImgHttp.UploadImg("system/0", file.raw);
      if (res.code != 200) {
        that.$message({
          message: res.data,
          type: "warning"
        });
        return;
      }
      that.common.systemForm.Logo = res.data; 
      that.imgsrc =   that.common.systemForm.Logo ;
      that.$message({
        message: "操作成功",
        type: "success"
      });
    },
    // 题库上传图片
    async setSystemData() {
      let that = this;
      let res = await setSystemData("", "",  that.common.systemForm);

      that.common.systemForm = (res.data);
      that.$message({
        message: "操作成功",
        type: "success"
      });
    },
   
  
  }
};
</script>
<style scoped>
</style>
