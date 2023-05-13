<template>
  <!-- 考勤记录表单 -->
  <div >
    <el-card shadow="hover" :class="'card m-t-40 '+systemRemainCSS"  >
      <div slot="header" class="clearfix">
        <span>{{pageTemplateItem.url}}</span>
        <el-link
          icon="el-icon-close"
          @click="$emit('delete',index,pageTemplateItem)"
          v-if="systemRemain"
          style="float: right; "
        >删除</el-link>
        <label style="float: right; " class="font12" v-else>系统保留</label>
      </div>
      <el-form
        :model="pageTemplateItem"
        :rules="pageRules"
        ref="ClassCheckElForm"
        label-width="50px"
        style="padding:0px  0px  0px  0px"
        size="small"
        class="dialog-body-pad"
      >
        <el-input v-model="pageTemplateItem.label" type="textarea" :rows="9" disabled></el-input>
        <el-link
          icon="el-icon-edit"
          style="float: right; padding: 0px 0px"
          @click="$emit('edit',index,pageTemplateItem)"
        >编辑</el-link>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {} from "@/api/class";
import $ImgAPI from "@/api/ImgAPI";
export default {
  name: "platformPageCard",
  props: {
    pageTemplateItem: {},
    index: 0
  },
  watch: {
    pageTemplateItem(newval) {
      this.checkSystemRemain();
    }
  },

  data() {
    return {
      systemRemain: false,
      systemRemainCSS:"",
      pageRules: {
        ShiJi: [
          { required: true, message: "实际课时不能为空", trigger: "blur" }
        ],
        Dianmingbiao: [
          {
            required: true,
            message: "必须上传考勤表或者现场照片",
            trigger: "blur"
          }
        ],
        Jindu: [{ required: true, message: "教学进度必填", trigger: "blur" }],
        JiaoxueNeirong: [
          { required: true, message: "教学内容必填", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    checkSystemRemain(){ 
      if (
        this.pageTemplateItem.url != "index" &&
        this.pageTemplateItem.url != "header" &&
        this.pageTemplateItem.url != "footer"
      ) {
        this.systemRemain = true;
        this.systemRemainCSS ="bg-f7";
      } else {
        this.systemRemain = false;
        this.systemRemainCSS ="bg-danlv";
      }
    },
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false;
    }
  },

  mounted() {
      this.checkSystemRemain()
  }
};
</script>  
<style scoped>
.card {
  float: left;
  margin: 15px;
  width: 200px;
  height: 300px;
  border: 1px solid rgb(176, 180, 177);
}
</style>