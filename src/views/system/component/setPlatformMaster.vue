<template>
  <div>
    <span class="m-v-10">负责人拥有本校区的管辖权，可以设置其他员工的工作权限，可以查看其他员工所负责的学员等</span>
    <div v-if="managerList.length>0" class="m-t-10 m-l-20">
      <p class="m-v-20">请从以下员工中选择一个作为本校区负责人。</p>
      <el-radio-group
        class="bge0e3ea"
        v-model="currentPlatform.MasterID"
        :disabled="!currenteditEnable"
      >
        <el-radio :label="item.Id" :key="item.Id" v-for="item in managerList">{{item.Realname}}</el-radio>
      </el-radio-group>
      <div class="around-center m-t-20">
        <el-button
          type="warning"
          :disabled="false"
          v-show="!currenteditEnable"
          class="m-l-40"
          @click="currenteditEnable=true"
        >编辑</el-button>
        <el-button
          type="primary"
          :disabled="false"
          v-show="currenteditEnable"
          class="m-l-40"
          @click="saveFormItemData"
        >确认</el-button>
        <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
      </div>
    </div>
    <div class="around-center hgt250" v-else>目前没有老师加入本校，请先给本校添加员工和老师。然后再来从中选择一个当负责人</div>
  </div>
</template>

<script>
import common from "@/utils/common";
import { getAllManagerOfPlatform, setPlatformMaster } from "@/api/platform";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    platformMaster: {
      type: Number,
      default: function() {
        return 0;
      }
    }
  },
  data() {
    return {
      currentPlatform: {},
      currenteditEnable: false,
      managerList: [],
      documentHeight: 500
    };
  },
  watch: {
    formItemData(newvar) {
      this.fire();
    }
  },
  mounted() {
    this.fire();
  },
  methods: {
    fire() {
      this.documentHeight = document.body.clientHeight - 400;
      if (!this.formItemData || !this.formItemData.Id) {
        return;
      }
      this.currentPlatform = this.formItemData;

      this.getAllManagerOfThisPlatform();
    },
    async getAllManagerOfThisPlatform() {
      let res = await getAllManagerOfPlatform(this.currentPlatform.Id, {
        onlyLive: true,
        needtotal: false
      });
      this.managerList = res.data ? res.data : [];
    },
    // 添加或编辑数据
    async saveFormItemData() {
      let res = await setPlatformMaster(
        this.formItemData.Id,
        { masterid: this.currentPlatform.MasterID, add: 1 },
        ""
      );
      this.currentPlatform = res.data;
      this.$message({
        message: "修改成功",
        type: "success"
      });
    }
  }
};
</script>  