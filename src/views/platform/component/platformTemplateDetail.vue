<template>
  <!-- --------------------数据编辑或者添加表单组件----------------------- -->
  <div class="wid_100">
    <el-form size="small" label-width="50px">
      <div class="flex_dom bg-f1 p-l-20 p-t-10">
        <el-form-item label="备注" prop="label" style="width:450px">
          <el-input placeholder="请输入备注" v-model="currentItemData.label"></el-input>
        </el-form-item>
        <el-radio-group
          class="flex_dom m-l-20"
          @change="changeTemplateOrContent"
          v-model="showTempateCode"
        >
          <el-radio-button :label="true">布局代码</el-radio-button>
          <el-radio-button :label="false">页面数据</el-radio-button>
        </el-radio-group>
        <el-form-item label prop="label" class="wid_100">
          <div class="flex_dom">
            <el-upload
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file){return uploadAttach(file )}"
            >
              <el-tooltip
                class="item cursor"
                style="width:100%"
                effect="dark"
                content="可上传 js  css png jpg gif等网页资源"
                placement="top"
              >
                <el-button type="info">上传资源</el-button>
              </el-tooltip>
            </el-upload>
            
          <el-tooltip
          v-show="fileURL.length>0"
            class="item cursor"
            style="width:100%"
            effect="dark"
            content="点击复制后贴到任何你想要放的地方"
            placement="top"
          >
            <span
              class="tag-read m-l-20"
              style="width:100%"
              :data-clipboard-text="fileURL"
              @click="copyText"
            >{{fileURL}}</span>
          </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item v-show="showTempateCode==true">
          
            <el-button type="success" @click="previewPage">预览页面</el-button>
         
        </el-form-item>
        <el-form-item v-show="showTempateCode==false">
          <div class="flex_dom">
            <el-button type="primary" @click="addBusinessItem">新增数据</el-button>
            <el-button type="warning" class="m-l-10" @click="saveDataList">保存数据</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div class="wid_100" v-show="showTempateCode==true">
      <textarea ref="mycode" class="CodeMirror" v-model="currentItemData.content"></textarea>
    </div>
    <div class="wid_100" :style="{height:documentHeight+100+'px'} " v-show="showTempateCode==false">
      <div class="wid_100 m-l-20">
        <vuedraggable class="wrapper m-t-20" v-model="dataList">
          <transition-group>
            <div class="m-b-10 m-r-20" v-for="(item,index) in dataList" :key="index+1">
              <div class="flex_dom cardBorder" :id="'card'+index">
                <el-form
                  label-width="150px"
                  :model="item"
                  style="width:400px"
                  class="bg-f5 p-t-10 p-r-10"
                >
                  <el-form-item label="(label)名称">
                    <el-input v-model="item.label" style="width:100%" placeholder="填写模块名"></el-input>
                  </el-form-item>
                  <el-form-item label="(description)副标题">
                    <el-input v-model="item.description" placeholder="可填写英文做副标题" style="width:100%"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="(display)是否显示">
                    <el-checkbox v-model="item.display" checked="checked" style="width:100%">打钩显示</el-checkbox>
                  </el-form-item> -->
                  <el-form-item label="(image)图片">
                    <el-upload
                      :auto-upload="false"
                      action
                      class="wid_100 flex_dom bg-eee"
                      :show-file-list="false"
                      :on-change="function(file){return uploadPlatformItem(file,index,item)}"
                    >
                      <img v-if="item.image" :src="item.image" style="width:200px" />
                      <el-button v-else>点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="(content)内容">
                    <el-button type="primary" @click="openContentEditer(index)">点击编辑</el-button>
                  </el-form-item>
                </el-form>
                <div style="width:100%" v-html="item.content" />

                <div class="dele_banner" @click="deleBusinessItem(index)">
                  <i class="el-icon-error font24 color-999"></i>
                </div>
              </div>
            </div>
          </transition-group>
        </vuedraggable>
      </div>
    </div>
    <div>
      <el-dialog
        :visible.sync="previewPageEnable"
        width="100%"
        :modal="false"
        append-to-body
        :title="currentItemData.label "
        @close="previewPageEnable=false"
      >
        <businessFormData :formItemData="currentItem" @updateRowData="updateList" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getWebTemplate,
  setWebTemplate,
  getWebContent,
  setWebContent,
  savePreviewPage
} from "@/api/platform";
import common from "@/utils/common";
import $ImgAPI from "@/api/ImgAPI";
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";

import businessFormData from "@/views/platform/web/component/businessFormData";
import vuedraggable from "vuedraggable";
let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/javascript/javascript");
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
require("codemirror/addon/hint/show-hint");
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
export default {
  name: "newsForm",
  props: {
    // 表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0, icon: "/upload/icon/Icon-DOCX.png" };
      }
    },
    currentPlatform: {
      typ: Number,
      default: 0
    },
    college: {
      typ: Number,
      default: 0
    }
  },
  components: { businessFormData, vuedraggable },
  data() {
    return {
      common,
      code: "//按Ctrl键进行代码提示",
      showTempateCode: true,
      documentHeight: 500,
      fileURL: "",
      // 表单验证
      newsFormRules: {
        Title: [{ required: true, message: "标题不能为空", trigger: "blur" }]
      },
      currentItemData: this.formItemData,
      currentPreviewHtml: "",
      previewPageEnable: false,
      previewSRC: "",
      dataList: [],
      currentItem: { label: "没有模块名" },
         editor :{}
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    },
    currentPlatform(newvar) {
      this.setData();
    },
    college(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.documentHeight = document.body.clientHeight - 250;
    let mime = "text/html";
      this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      mode: mime,
      // theme: "ambiance", //选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      autofocus: true,
      extraKeys: { Ctrl: "autocomplete", Enter: "newlineAndIndentEnter" } //自定义快捷键
    });
     this.editor.setSize("auto", this.documentHeight + 100 + "px");
    //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
    // let that = this;
    //  this.editor.on("cursorActivity", function() {
    //   that.editor.showHint(); 
    // });
    this.setData();
     
    this.getWebContent();
  },
  methods: {
    changeTemplateOrContent() {
      if (this.showTempateCode == false) {
        this.getWebContent();
      }
    },
    async uploadPlatformItem(file, index, item) {
      let that = this;
      var index = file.name.lastIndexOf(".");
      var suffix = file.name.substr(index + 1).toLowerCase();
      if (
        suffix.toLowerCase() != "jpg" &&
        suffix.toLowerCase() != "jpeg" &&
        suffix.toLowerCase() != "png" &&
        suffix.toLowerCase() != "gif"
      ) {
        this.$message({
          message: "只能上传图片",
          type: "warning"
        });
        return;
      }
      let res = await $ImgAPI.UploadImg("platform/"+  this.currentPlatform +"?originname=true", file.raw);
      if (res.code == 200) {
        item.image = res.data;
        that.$forceUpdate();
      } else {
        that.$message({
          message: res.title,
          type: "warning"
        });
      }
    },
    async getWebContent() {
      this.dataList = [];
      let res = await getWebContent(
        this.currentPlatform + "/" + this.currentItemData.url,
        ""
      );

      this.dataList = res.data ? res.data : [];
    },
    setData() {
      this.currentItemData = this.formItemData;
      this.editor.setValue(this.currentItemData.content)
      this.dataList = [];
    },
    selectViewModel(item) {
      if (item.$children[0].id == this.currentPlatform) {
        item.$children[0].setContent(this.currentItemData.content);
      }
    },
    // 添加banner
    addBusinessItem() {
      let item = {};
      item.label = "未命名模块";
      item.description = "未命名模块";
      item.display = true;
      // item.imgHoverOpacity = 0.7;
      // item.imgHoverScale = 0.9;
      // item.imgStyle = "";
      item.content = "这里没有什么内容";
      this.dataList.unshift(item);
    },
    // 删除banner
    async deleBusinessItem(index) {
      this.$confirm("这里删除后还需要点击保存按钮，确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.dataList.splice(index, 1);
        this.$message({
          message: "删除成功,请最后点击保存按钮",
          type: "success"
        });
      });
    },
    // 编辑或者添加之后更新表格数据-资料列表
    updateList(rowData) {
      this.$set(this.dataList, this.currentIndex, rowData);

      this.contentDilag = false;
    },
    // 保存banner列表
    async saveDataList() {
      let res = await setWebContent(
        this.currentPlatform + "/" + this.currentItemData.url,
        "",
        this.dataList
      );



      this.$emit()
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    openContentEditer(index) {
      this.currentIndex = index;
      this.contentDilag = true;
      this.currentItem = this.dataList[index];
      this.currentItem.Id = index;
    },
    // 复制文本
    copyText() {
      let clipboard = new this.clipboard(".tag-read");
      clipboard.on("success", e => {
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        clipboard.destroy();
      });
    },
    async previewPage() {
      let that = this;
      this.currentItemData.content = this.editor.getValue(); 
      let res = await savePreviewPage(
        this.currentPlatform + "/" + this.currentItemData.url,
        "",
        this.currentItemData.content
      );
      // this.currentPreviewHtml = res;
      window.open("/api/platform/getPreviewPage/" + res.data, "_blank");
      that
        .$confirm("预览效果如何?满意的话就发布吧,不满意就再修改一下", "提示", {
          confirmButtonText: "满意.发布",
          cancelButtonText: "再修改一下",
          type: "warning"
        })
        .then(async () => {
          if (this.showTempateCode) {
            that.saveTemplate();
          } else {
            this.saveDataList();
          }
        });
    },

    // 上传附件
    async uploadAttach(file) {
      // 上传附件之前的验证
      let that = this;
      let res = await $ImgAPI.UploadImg("platform/"+  this.currentPlatform +"?originname=true", file.raw);
      if (res.code == 200) {
        that.fileURL = res.data;
      } else {
        that.$message({
          message: res.title,
          type: "warning"
        });
      }
    },
    // 添加或编辑数据
    async saveTemplate() {
      // 添加数据  getWebTemplate,setWebTemplate
        this.currentItemData.content = this.editor.getValue(); 
      let res = await setWebTemplate(
        this.currentPlatform + "/" + this.currentItemData.url,
        { label: this.currentItemData.label },
        this.currentItemData.content
      );

      this.isShowPlatformDialog = false;
      this.$message({
        message: "发布成功",
        type: "success"
      });
      let item = this.currentItemData;
      // item.content = res.data;
      this.$emit("updateRowData", item);
    },
    // 取消编辑或者添加
    cancleUpdate() {
      this.$emit("updateRowData");
    }
  }
};
</script> 
<style scoped>
.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}

.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
.dele_banner {
  position: absolute;
  right: 5px;
  top: 5px;
}
.myImg:hover {
  opacity: 0.1;
}
.cardBorder {
  -webkit-box-shadow: 0 1px 5px 0 #dedede;
  box-shadow: 0 1px 5px 0 #dedede;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  border: 2px dashed rgba(46, 84, 56, 0.2);
}
.el-upload {
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>