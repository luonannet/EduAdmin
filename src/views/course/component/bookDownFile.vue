<template>
  <div>
    <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <div class="flex_column">
      <div class="m-b-10" v-for="(item,index) in dataList" :key="index">
        <div class="flex_mid cardBorder">
          <div class="flex_column" style="width: 140px; height: 200px">
            <el-upload
              :auto-upload="false"
              action
              class="bg-ddd"
              :show-file-list="false"
              :on-change="function(file, item){return uploadImage(file,item,index)}"
            >
              <img v-if="item.image" :src="item.image" style="width: 140px; height: 140px" />
              <i
                v-else
                slot="default"
                class="el-icon-plus"
              >&nbsp;{{item.imageProgress?item.imageProgress:'点击上传'}}</i>
            </el-upload>
            <el-button @click="onPreview(item.image)">&nbsp;预览</el-button>
          </div>
          <el-form label-width="90px" :model="item" style="width:100%">
            <div class="flex_mid">
              <el-form-item label="资料名称" style="width:30%">
                <el-input v-model="item.label" style="width:100%" placeholder="填写资料的名称"></el-input>
              </el-form-item>

              <el-form-item label="资料地址：" class="m-l-20" style="width:70%">
                <div class="flex_dom">
                  <el-upload
                    :auto-upload="false"
                    action
                    class="bg-ddd"
                    :show-file-list="false"
                    :on-change="function(file, item){return uploadDoc(file,item,index)}"
                  >
                    <i
                      slot="default"
                      class="el-icon-plus"
                    >&nbsp;{{item.docProgress?item.docProgress:'点击上传资料'}}</i>
                  </el-upload>
                  <el-input v-model="item.href" placeholder="请输入连接地址.或者下载地址"></el-input>
                </div>
              </el-form-item>
              <a :href="item.href" style="width:50px" download>下载</a>
            </div>
            <el-form-item label="简介">
              <el-input type="textarea" rows="5" v-model="item.title" placeholder="相关介绍"></el-input>
            </el-form-item>
          </el-form>

          <div class="dele_Data" @click="deleDataItem(index)">
            <i class="el-icon-error font24 color-999"></i>
          </div>
          <div class="bg-green"></div>
        </div>
      </div>
    </div>
    <div class="m-v-15">
      <el-button type="primary" @click="addDataItem">新 增</el-button>
      <el-button type="success" @click="saveDataList">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { SetBookInfo } from "@/api/book";
import $ImgHttp from "@/api/ImgAPI";
import common from "@/utils/common";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
export default {
  name: "bookDownFile",
  props: {
    // 表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0, icon: "/upload/icon/Icon-DOCX.png" };
      }
    }
  },
  components: {
    myImageViewer
  },
  data() {
    return {
      myImageViewer,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 列表
      dataList: [],
      currentItemData: this.formItemData,
      editEnable: false,
      documentHeight: 500,
      progress: 0
    };
  },
  watch: {
    formItemData(newval) {
      this.fire();
    }
  },
  mounted() {},
  methods: {
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      if (!this.formItemData || !this.formItemData.Id) {
        return;
      }
      this.currentItemData = this.formItemData;
      this.setData(this.currentItemData.Info);
      this.editEnable = false;
      let editorList = this.currentItemData.Editors.split(",");
      editorList.forEach(editorid => {
        if (editorid == this.$store.getters.manager.Id) {
          this.editEnable = true;
        }
      });
    },
    setData(info) {
      if (!info || info == "") {
        info = "[]";
      }
      this.dataList = JSON.parse(info);
    },
    uploadImage(file, row, index) {
      let that = this;
      if (that.editEnable == false) {
        that.$message({
          message: "你不是本教材编委，不能发布资料",
          type: "error"
        });
        return;
      }
      let filename = file.name.split(".");
      let NameValue =
        "book_" +
        this.currentItemData.Id +
        "image_" +
        index +
        "." +
        filename[filename.length - 1].toLowerCase();

      let res = common.uploadCosFile(
        file,
        "doc",
        NameValue,
        function(progressData) {
          row.imageProgress = "上传进度:" + progressData.percent * 100 + "%";
        },
        function(err, data, fileURL) {
          if (!err) {
            that.$message({
              message: "上传成功",
              type: "success"
            });
          } else {
            console.log("cos上传错误:", err);
          }
          that.dataList[index].image = "http://" + fileURL;
          that.$forceUpdate();
        }
      );
    },
    uploadDoc(file, row, index) {
      let that = this;
      if (that.editEnable == false) {
        that.$message({
          message: "你不是本教材编委，不能发布资料",
          type: "error"
        });
        return;
      }

      let filename = file.name.split(".");
      let NameValue =
        "book_" +
        this.currentItemData.Id +
        "doc_" +
        index +
        "." +
        filename[filename.length - 1].toLowerCase();

      let res = common.uploadCosFile(
        file,
        "doc",
        NameValue,
        function(progressData) {
          row.docProgress = "上传进度:" + progressData.percent * 100 + "%";
        },
        function(err, data, fileURL) {
          if (!err) {
            that.$message({
              message: "上传成功",
              type: "success"
            });
          } else {
            console.log("cos上传错误:", err);
          }
          that.dataList[index].href = "http://" + fileURL;
          that.$forceUpdate();
        }
      );
    },

    // 保存Data列表
    async saveDataList() {
      let res = await SetBookInfo(this.currentItemData.Id, "", this.dataList);
      if (res.code == 200) {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.$emit("subClickEvent", 1, res.data);
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
    },
    // 添加Data
    addDataItem() {
      this.dataList.unshift({});
    },
    // 删除Data
    async deleDataItem(index) {
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
    }
  }
};
</script>
<style scoped>
.dele_Data {
  position: absolute;
  right: 5px;
  top: 5px;
}
.cardBorder {
  -webkit-box-shadow: 0 1px 5px 0 #dedede;
  box-shadow: 0 1px 5px 0 #dedede;
  padding: 0px 30px 0px 20px;
  position: relative;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px dashed rgba(46, 84, 56, 0.2);
}
.el-upload {
  border: 1px dashed #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
