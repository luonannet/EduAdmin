<template>
  <div class="font16 hgt_full" v-cloak>
    <platformRowDetail :fromPlatform="1" :formItemData="currentPlafformItem" />
  </div>
</template> 
<script>
import platformRowDetail from "@/views/system/component/platformRowDetail";
import common from "@/utils/common";
export default {
  name: "platformSetting",
  components: {
    platformRowDetail
  },
  data() {
    return {
      common,
      // 当前的校区id
      currentPlatform: 0,
      currentPlafformItem: {}
    };
  },
  methods: {},
  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = parseInt(paths[paths.length - 1]);
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
      this.$message({
        message: "没有这个校区",
        type: "warning"
      });
      return;
    }
    this.$nextTick(() => {
      this.platforms = this.$store.getters.app.platformList;
      let myplatformList = [];
      this.platforms.forEach(platform => {
        if (platform.Id == this.currentPlatform) {
          this.currentPlafformItem = platform;
        }
      });
    });
  }
};
</script>
<style scope>
.el-dialog.exerciseSitaution {
  width: 70% !important;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 30% !important;
  height: 100%;
  min-width: 600px;
  position: relative;
  overflow: auto;
}
.closeDialog:hover {
  color: #2e77f8;
}
</style>