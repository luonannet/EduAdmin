<template>
  <div v-cloak class="font16 hgt_full">
    <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <div class="flex_column hgt_full">
      <div class="flex_1 overflow_hide ">
        <div class="hgt_100 overflow_auto">
          <div class=" p-v-10">
            <div
              v-for="(item,index) in customTrackList"
              :key="index"
              class="m-v-10 radius3 border-e5ecf7"
            >
              <div class="flex_dom marg20">
                <div class=" font14 color-666">
                  <span>{{ item.ManagerLabel }}：{{ item.track_method }}</span>
                  <span class="font12 m-l-10 color-666">{{ common.dateFormat(item.Createtime, 2) }}</span>
                </div>
                <div class="font14 color-666 m-l-20">
                  <span class="color-1f85aa">学员：{{ item.StudentLabel }}</span>
                  <span class="font12 color-1f85aa">({{ item.StudentTel }})</span>
                </div>
              </div>
              <p v-if="item.Kind==2" class="m-v-15 font14 color-666 p_both20">
                <audio :src="item.Content" controls="controls">你的浏览器太老，不支持显示录音</audio>
              </p>
              <p v-else class="m-v-5 font14 color-666 p_both20">{{ item.Content }}</p>
              <div v-show="item.ImageList.length>0" class="p_both20">
                <div class="flex_dom flex_wrap">
                  <div
                    v-for="(img,index) in item.ImageList"
                    :key="index"
                    class="marg10 flex_mid flex_wrap"
                  >
                    <img v-if="img" class="wid20" :src="img" @click="onPreview(img)" />
                  </div>
                </div>
              </div>
              <div class="m-l-20">
                <p
                  v-for="(replyItem,replyIndex) in item.Reply"
                  :key="replyIndex"
                  class="color-666 font14 m-b-10"
                >
                  <span class="color-1f85aa">[{{ replyItem.ManagerLabel }}]评论：</span>
                  <span class="color-red">{{ replyItem.Content }}</span>
                </p>
              </div>
              <div class="bg-f5f9ff p-v-10 p_both20">
                <div class="between-center">
                  <textarea
                    v-model="item.replyContent"
                    cols="30"
                    placeholder=""
                    rows="1"
                    class="yahei border-e0 radius3 wid_100 default-input input-focus default-textarea p-v-5 p_both10"
                  />
                  <el-button type="text" class="m-l-20" @click="submitReplyTrack(item,index)">提交评论</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="between-center m-v-15">
        <div>
          <el-pagination
            background
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
            @current-change=" getChangePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  GetStudentDataTrackAnalysis,
  getCustomTracks,
  addcustomTracks, 
  replyTracks,
  receiveSmsTrack,
  getTrackList,
  getCustomBuyCouseRecord,
  addCustomBuyCourseRecord,
  customAllowDoExercise, 
  getStudentList,
  addStudent,
  editStudent,
  resetStudentPassword,
  setStudentStatus,
  checkTelephone,
  setStar,
  batchChangeManager,
  getStudentStatustByStudent
} from "@/api/student";
import common from "@/utils/common";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
export default {
  name: "trackList",
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页获取数据的总条数
      rows: 10,
      // 存上传的跟进图片
      trackImgList: [],
      // 该学员所有的跟进记录
      customTrackList: [],
      // 当前回复跟进数据的索引
      currentReplyIndex: null
    };
  },
  mounted() {
    if (this.customTrackList.length == 0) {
      this.getCustomtTracks();
    }
  },

  methods: {
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    // 获取学员的跟进记录
    getCustomtTracks() {
      const offsetRow = (this.nowPage - 1) * this.rows;
      getTrackList(0, {
        limit: this.rows,
        offset: offsetRow
      })
        .then(res => {
          this.allRows = res.title;
          this.customTrackList = res.data ? res.data : [];
          this.customTrackList.forEach(item => {
            if (item.Reply) {
              item.Reply = JSON.parse(item.Reply);
            }
          });
        })
        .catch(err => {});
    },
    // 分页获取数据
    getChangePage(val) {
      this.nowPage = val;
      this.getCustomtTracks();
    },
    // 提交回复评论
    async submitReplyTrack(track, index) { 
      const oldtrack = { ...track };
      if (!track.replyContent) {
        this.$message({
          message: "还没有输入内容哦",
          type: "warning"
        });
      } else {
      
        this.currentReplyIndex = index;
        const res = await replyTracks(track.Id, "", track.replyContent);

        if (res.data) {
          oldtrack.Reply = res.data;
          oldtrack.replyContent = "";
          this.customTrackList.splice(this.currentReplyIndex, 1, oldtrack);
        }
        this.$message({
          message: "操作成功",
          type: "success"
        });
      }
    }
  }
};
</script>
<style scoped>
</style>
