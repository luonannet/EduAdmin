<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <svg-icon
          icon-class="message"
          style="   cursor: pointer; fill: #5a5e66; margin-left:20px; width: 20px; height: 20px; vertical-align: 10px;"
          @click="openAlarmDialog"
        />

        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->

        <lang-select class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="manager.Face" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/personalData">
            <el-dropdown-item>{{ $t('navbar.profile') }}</el-dropdown-item>
          </router-link>

          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <my-dialog :visible.sync="alarmListDialog" title="消息中心" :showLeft="false">
      <div slot="right_content" class="bg-f5f9ff hgt_100">
        <alarmList ref="refAlarmList"></alarmList>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
// import SizeSelect from '@/components/SizeSelect'
import LangSelect from "@/components/LangSelect";
import myDialog from "@/components/myDialog/myDialog";
import alarmList from "@/layout/components/alarmList";

import { handleAlarm, getSingleAlarm, getAlarmList } from "@/api/alarm";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    alarmList,
    LangSelect,
    myDialog
  },
  computed: {
    ...mapGetters(["sidebar", "manager", "device"])
  },
  data() {
    return {
      aramsNum: 0,
      // 提醒列表弹出框
      alarmListDialog: false,
      // 存放定时器
      timer: "",
      // 存放所有显示消息的Id
      allAlarmId: [],
      // 解决notify同事调用重叠的问题
      notifyPromise: Promise.resolve()
    };
  },
  created() {
    setInterval(() => {
      this.getAlarm();
    }, 30000);
  },
  mounted() {
    this.getAlarm();
  },
  methods: {
    // 获取提醒，有提醒弹出弹框
    async getAlarm() {
      if (this.$store.getters.manager == null) {
        return;
      }

      let res = await getSingleAlarm("");
      res.title = res.title ? res.title : 0;
      if (res.data && res.data.length > 0) {
        res.data.forEach((item, index) => {
          let isExist = this.allAlarmId.indexOf(item.Id);
          if (isExist == -1) {
            this.allAlarmId.push(item.Id);
            this.notifyPromise = this.notifyPromise
              .then(this.$nextTick)
              .then(() => {
                let h = this.$createElement;
                let notify = this.$notify.info({
                  title: item.Title,
                  duration: 0,
                  showClose: false,
                  message: h("div", { class: "font12 color-92" }, [
                    h("p", null, item.Content),
                    h("div", { class: "center-end" }, [
                      h(
                        "p",
                        {
                          class: "alarm_untreated_btn m-r-10",
                          on: {
                            click: async () => {
                              this.$message({
                                message: "存入你的未处理列表了",
                                type: "warning"
                              });
                              notify.close();
                            }
                          }
                        },
                        "暂不处理"
                      ),
                      h(
                        "p",
                        {
                          class: "alarm_handled_btn",
                          on: {
                            click: async () => {
                              let res = await handleAlarm(item.Id);
                              if (res.code == 200) {
                                this.$message({
                                  message: "不再提醒你这条消息",
                                  type: "success"
                                });
                                notify.close();
                              }
                            }
                          }
                        },
                        "我知道了"
                      )
                    ])
                  ])
                });
              });
          }
        });
      }
    },
    // 打开提醒消息列表
    openAlarmDialog() {
      this.alarmListDialog = true;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("manager/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
