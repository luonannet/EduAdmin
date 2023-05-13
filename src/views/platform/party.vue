<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <div class="flex_1">
        <el-table
          ref="refElTabel"
          tooltip-effect="light"
          :data="partyList"
          height="100%"
          border
          style="width: 100%"
        >
          <el-table-column prop="Id" label="ID" width="50"></el-table-column>
          <el-table-column prop="Label" label="活动标题" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                class="color-1f85aa font-w6 cursor"
                @click="openMoreOptationDialog(scope.$index, scope.row)"
              >{{ scope.row.Label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Starttime" label="开始时间" width="130"></el-table-column>
          <el-table-column prop="Endtime" label="结束时间" width="130"></el-table-column>
           <el-table-column prop="Address" label="举办地址" width="230"></el-table-column>
          <el-table-column prop="Createtime" label="发布时间" width="130"></el-table-column>
          <el-table-column prop="Description" label="简介"></el-table-column>
          <el-table-column prop="AuthorLabel" label="发布人" width="100"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" @click="seePartyMember(scope.$index, scope.row)">查看报名名单</el-button>
              <el-button type="danger" @click="deleteNewsRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <el-button type="primary" @click="newsAdd">添加活动</el-button>
        <el-pagination
          background
          @current-change=" currentPageChange"
          :current-page.sync="nowPage"
          :page-size="rows"
          layout="total,prev, pager, next, jumper"
          :total="allRows"
        ></el-pagination>
      </div>
    </div>

    <my-dialog title="竞赛活动详情编辑" :showLeft="false" :visible.sync="newsFormDialog">
      <div slot="right_content">
        <partyFormData
          ref="newsForm"
          :kindList="newsKindOptions"
          :platform="currentPlatform"
          :formItemData="currentItemData"
          @updateRowData="updateNewsList"
        ></partyFormData>
      </div>
    </my-dialog>

    <div>
      <!-- 弹出框 -->
      <my-dialog :visible.sync="moreOperationDialog" :showLeft="false" :title="currentItemData.Label">
        
        <div slot="right_content" class="hgt_full  p-b-20">
              <partyMember :formItemData="currentItemData" ref="partyMember" :currentPlatform="currentPlatform"></partyMember>
          <!-- <el-tabs @tab-click="onChangeTabs">
            <el-tab-pane label="报名名单" name="bbxy" id="bbxy">
            </el-tab-pane>
          </el-tabs> -->
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
import partyFormData from "@/views/platform/web/component/partyFormData";
import partyMember from "@/views/platform/component/partyMember";
import { getPartyList, deleteOne } from "@/api/party";
export default {
  name: "newsList",
  components: {
    myDialog,
    partyFormData,
    partyMember
  },
  data() {
    return {
      common,
      // 竞赛活动类型的选项
      newsKindOptions: [
        {
          value: 1,
          Label: "行业竞赛活动"
        },
        {
          value: 2,
          Label: "我的竞赛活动"
        },
        {
          value: 3,
          Label: "最新活动"
        }
      ],
      // 竞赛活动的数据列表
      partyList: [],
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 30,
      // 显示隐藏模态框
      newsFormDialog: false,
      moreOperationDialog: false,
      // 模态框获得的单条数据
      currentItemData: {},
      // 当前索引
      currentNewsIndex: null,
      currentPlatform: 0,
      documentHeight: 500
    };
  },
  methods: {
    onChangeTabs(item) {
      item.$children[0].fire();
    },

    // 查看报名的名单
    async seePartyMember(index, row) {
      this.moreOperationDialog = true
          this.currentNewsIndex = index;
      this.currentItemData = row;
      this.$refs["partyMember"].fire()
      // let res = await getPartyList(this.currentPlatform, newParams);
      // if (res.code == 200) {
      //   this.partyList = [];
      //   if (res.data) {
      //     this.partyList = res.data;
      //   }
      //   this.allRows = res.title;
      // }
    },
    // 获取竞赛活动的数据列表
    async GetPlatformNews() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let newParams = {
        kind: 3,
        needPublic: false,
        content: 0,
        limit: this.rows,
        offset: offsetRow
      };
         this.partyList = [];
      let res = await getPartyList(this.currentPlatform, newParams);
      if (res.code == 200) {
     
        if (res.data) {
          this.partyList = res.data;
        }
        this.allRows = res.title;
      }
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.GetPlatformNews();
    },
    // 删除竞赛活动数据
    deleteNewsRow: function(index, row) {
      this.$confirm("你确定要删除吗？删了之后找不回来哦", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.currentNewsIndex = index;
          let res = await deleteOne(row.Id);
          if (res.code == 200) {
            this.GetPlatformNews();
          }
        })
        .catch(() => {});
    },
    // 打开编辑弹窗获取用户数据
    openMoreOptationDialog(index, row) {
      this.newsFormDialog = true;
      this.currentNewsIndex = index;
      this.currentItemData = row;
    },
    // 显示列表的时候格式化时间
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue, 2);
    },
    // 点击新增竞赛活动
    newsAdd() {
      this.newsFormDialog = true;
      this.currentItemData = {
        icon: "/upload/icon/defaultnews.png",
        Id: 0,
        Downfile: "",
        Title: "",
        Description: "",
        Content: "没有写任何内容",
        KindId: 1
      };
    },
    // 编辑或者添加之后更新表格数据-竞赛活动列表
    updateNewsList(rowData, isType) {
      // isType编辑还是添加
      if (isType == 1) {
        this.$set(this.partyList, this.currentNewsIndex, rowData);
      } else if (isType == 0) {
        this.partyList.unshift(rowData);
      }
      this.newsFormDialog = false;
    }
  },

  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = parseInt(paths[paths.length - 1]);
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }

    this.GetPlatformNews();
  }
};
</script>
<style scope >
.selectStyle {
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  color: #606266;
  font-size: 14px;
}
.selectStyle::-ms-expand {
  display: none;
}
</style>

