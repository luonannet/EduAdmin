<template>
  <div>
    <div class="m-l-20 bg-fff alarm_type flex_dom">
      <p class="item_nav" :class="{active_item_nav:alarmKind==0}" @click="searchSubmit(0)">全部消息</p>
      <p class="item_nav" :class="{active_item_nav:alarmKind==1}" @click="searchSubmit(1)">未推送提醒</p>
    </div>
    <div class="m-t-20 p-b-30">
      <div class="mes_item m-b-15 m_both20" v-for="(item,index) in alarmList" :key="index">
        <div class="center">
          <p v-if="item.Status==0" class="blue_dot m-r-10"></p>
          <el-tooltip effect="light" class="flex_1 m-r-10" :content="item.Title" placement="top">
            <div class="flex_dom">
              <p class="only_line font16">{{item.Title}}</p>
              <div class="flex_1" v-if="item.Status==0">
                <p class="unread_mark"></p>
              </div>
            </div>
          </el-tooltip>
          <p class="font12 color-92 m-l-10">{{common.dateFormat(item.ExeTime,2)}}</p>
        </div>
        <p class="font14 m-l-20 color-92 m-t-5">{{item.Content}}</p>
        <div class="center-end">
          <p
            class="alarm_handled_btn"
            @click="handleAlarm(item.Id,index)"
            v-if="item.Status==0"
          >立即处理</p>
          <p v-else>已经处理</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
import { handleAlarm, getAlarmList } from "@/api/alarm";
export default {
  name: "alarmList",
  data() {
    return {
      common,
      // 提醒消息列表
      alarmList: [],
      // 查询消息的类型,0全部消息,1未推送消息
      alarmKind: 0
    };
  },
  mounted() {
    this.getAlarms();
  },
  methods: {
    // 条件搜索
    searchSubmit(val) {
      this.alarmKind = val;
      this.getAlarms();
    },
    // 获取消息列表
    async getAlarms() {
      let res = await getAlarmList("", { kind: this.alarmKind });
      if (res.code == 200) {
        this.alarmList = res.data ? res.data : [];
      }
    },
    // 处理消息
    async handleAlarm(id, index) {
      let res = await handleAlarm(id);
      if (res.code == 200) {
        res.title = res.title ? res.title : 0;
        // this.$store.dispatch("Alarm", res.title);
        // this.common.go_alert("处理成功");
        this.alarmList.splice(index, 1, res.data);
      }
    }
  }
};
</script> 
<style scoped>
.alarm_type .item_nav {
  margin-right: 20px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  position: relative;
}
.alarm_type .item_nav:hover,
.active_item_nav {
  color: #2e77f8 !important;
}
.alarm_type .item_nav:hover::after,
.active_item_nav::after {
  position: absolute;
  content: "";
  bottom: 0;
  width: 100%;
  left: 50%;
  height: 1px;
  background: #2e77f8;
  transform: translateX(-50%);
}
.mes_item {
  padding: 20px 15px;
  box-sizing: border-box;
  background: #fff;
  color: #222;
  box-shadow: 0 2px 4px 0 #d8dfeb;
  border-radius: 4px;
}
.blue_dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2e77f8;
}

.unread_mark {
  display: inline-block;
  width: 6px;
  height: 6px;
  position: relative;
  top: -10px;
  left: 5px;
  background: #ff6161;
  border-radius: 100%;
}
.alarm_handled_btn {
  background: #2e77f8;
  color: #ffffff;
  padding: 6px 12px;
  font-family: 微软雅黑;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
}
</style> 