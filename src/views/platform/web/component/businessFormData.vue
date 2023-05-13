<template>
  <!-- --------------------数据编辑或者添加表单组件----------------------- -->
  <div class="pad20">
    <Tinymce :height="tableHeight" v-model="currentItemData.content" :id="currentItemData.Id"></Tinymce>
    <div class="center-end m-v-15">
      <el-button type="primary" @click="saveNewsFormData">保存</el-button>
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
    }
  },
  components: {
    Tinymce
  },
  data() {
    return {
      common,
      tableHeight: window.innerHeight - 300,
      currentItemData: this.formItemData
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.tableHeight = window.innerHeight - 300;
      this.currentItemData = this.formItemData;
    },

 
    // 添加或编辑数据
    saveNewsFormData() {
      this.$emit("updateRowData", this.currentItemData);
    },
   
  }
};
</script> 
<style scoped>
</style>