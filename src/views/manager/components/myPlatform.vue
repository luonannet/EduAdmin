<template>
  <div class="p_both10 setright">
    <div class="flex_wrap flex_mid p-b-5 border-b-e0">
      <div v-for="item in platforms" :key="item.Id" class="quan_xian_item m-b-10">
        <el-checkbox
          @change="checked=>changePlatform(checked,item)"
          v-model="item.Selected"
        >{{item.Label}}</el-checkbox>
      </div>
    </div>
    <div class="around-center m-v-15">
      <el-button type="primary" @click="savePlatforms">保 存</el-button>
    </div>
  </div>
</template>
<script>
import { getPlatforms, setPlatform } from "@/api/manager";

export default {
  props: {
    // 表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    // 表单数据
    currentPlatform: {
      type: Number,
      default: 0
    }
  },
  name: "setPlatform",
  data() {
    return {
      platforms: [],
      myPlatforms: [],
      removePlatforms: [],
      documentHeight: 500
    };
  },
  watch: {
    formItemData(newval) {
      this.fire();
    }
  },

  methods: {
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      if (!this.formItemData || !this.formItemData.Id) {
        return;
      }
      this.getManagerPlatforms();
    },
    // 打开模态框时获取所有的权限选择
    async getManagerPlatforms(index) {
      let res = await getPlatforms(this.formItemData.Id, "");
      this.platforms = [];
      this.myPlatforms = res.data ? res.data : [];
      this.$nextTick(() => {
        this.platforms = this.$store.getters.app.platformList.slice(
          0,
          this.$store.getters.app.platformList.length
        );
        this.platforms.forEach(platform => {
          platform.Selected = false;
          this.myPlatforms.forEach(hasPlatform => {
            if (platform.Id == hasPlatform) {
              platform.Selected = true;
            }
          });
        });
      });
    },
    changePlatform(checked, itemObj) {
      if (checked == false) {
        this.removePlatforms.push(itemObj.Id);
      }
      this.$forceUpdate();
    },
    //保存用户的权限设置
    async savePlatforms() {
      let selectedIDS = [];
      this.platforms.forEach(platform => {
        if (platform.Selected == true) {
          selectedIDS.push(platform.Id);
        }
      });
      let res = await setPlatform(
        this.formItemData.Id,
        { remove: this.removePlatforms.join(",") },
        selectedIDS
      );

      if (this.formItemData.Id == this.$store.getters.manager.Id) {
        // 如果管理的正好是自己.那么就更新自己的左侧导航

        this.platforms = this.$store.getters.app.platformList.slice(
          0,
          this.$store.getters.app.platformList.length
        );
        let myplatformList = [];
        this.platforms.forEach(platform => {
          platform.Selected = false;
          res.data.forEach(hasPlatform => {
            if (platform.Id == hasPlatform) {
              myplatformList.push(platform);
            }
          });
        });

        this.$store
          .dispatch("permission/generateRoutes", myplatformList)
          .then(response => {});
      }
      this.$message({
        message: "修改成功",
        type: "success"
      });
    }
  }
};
</script>  
<style scoped>
.splitLine {
  width: 2px;
  height: 14px;
  background-color: #1890ff;
  border-radius: 1px;
  display: inline-block;
}
.quan_xian_item {
  width: calc(100% / 4);
}
</style>