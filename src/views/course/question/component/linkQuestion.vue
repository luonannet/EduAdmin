<template>
  <div class="font16 hgt_full m-l-10 m-t-20">
    <!-- <span class="m-b-10">试题出处:</span> -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="教材:">{{BookLabel}}</el-form-item>
      <el-form-item label="第">
        <el-input-number
          v-model="currentItemData.Zhang"
          controls-position="right"
          :min="0"
          :max="1000"
          label="输入章"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="章.第">
        <el-input-number
          v-model="currentItemData.Jie"
          controls-position="right"
          :min="0"
          :max="1000"
          label="输入节"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="节.第">
        <el-input-number
          v-model="currentItemData.TopicNo"
          controls-position="right"
          :min="0"
          :max="1000"
          label="输入知识点"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="知识点。题干:">
        <el-input
          class="wid250"
          v-model="searchQuestionContent"
          placeholder="输入题干查找"
          @keyup.native.enter="getQuesListOfBookZhangJie"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getQuesListOfBookZhangJie">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="hgt_full">
      <el-table
        :data="questionsListOfBook"
        border
        tooltip-effect="light"
        style="width: 100%"
      :height="documentHeight"
        ref="refElTabel"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="Id" label="ID" width="60"></el-table-column>
        <el-table-column prop="QuestionContent" label="题干" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-html="scope.row.QuestionContent" class="QuestionContentImg"></div>
          </template>
        </el-table-column>
        <el-table-column prop="QuestionType" label="类型" width="95">
          <template slot-scope="scope">
            <span>{{common.FormatSelect($store.getters.app.questionTypes,scope.row.QuestionType)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ManagerLabel" label="发布人" width="100"></el-table-column>
        <el-table-column prop="QuestionScore" width="50" label="得分"></el-table-column>
        <el-table-column prop="State" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.State==1">上架</el-tag>
            <el-tag v-show="scope.row.State==0" type="info">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="State" label="错误/全部" width="90">
          <template slot-scope="scope">
            <span>{{scope.row.WrongNum}}/{{scope.row.AnswerNum}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="between-center m-t-20">
      <el-button type="primary" @click="linkQuestion">确认关联</el-button>
      <div>
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
  </div>
</template>

<script>
import $ImgHttp from "@/api/ImgAPI";
import { getQuestionOfBook } from "@/api/exercise";
import common from "@/utils/common";
export default {
  props: {
    // 表单数据
    BookChapter: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
    ,
    BookLabel: {
      type: String,
      default: ""
    }
    
  },
  data() {
    return {
      common,
      // 上传图片加载中的状态
      isbusy: false,
      // 选项字母
      words: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 50,
      // 查询-搜索

      //搜索有没有相同的题干了.
      searchQuestionContent: "",
      // 模态框获得的单条数据
      currentItemData: {},
      // 科目名称 
      // 科目的试题列表
      questionsListOfBook: [],
      multipleSelection: [],
      documentHeight:500,
    };
  },
  watch: {
    BookChapter(newval) {
      this.fire();
    }
  },
  mounted() {
    this.fire();
  },
  methods: {
     fire() { this.documentHeight = document.body.clientHeight-400;
      this.currentItemData = this.BookChapter; 
      this.questionsListOfBook = [];
      // this.currentPageChange(1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    linkQuestion() {
      let questionIDS = [];
      this.multipleSelection.forEach(item => {
        questionIDS.push(item.Id);
      });
      this.BookChapter.Questions = questionIDS;
      this.BookChapter.Description =
        "包含(" + questionIDS.length + ")道随堂练习题";
      this.$emit("linkedQuestion");
      this.$message({
        message: "操作成功",
        type: "success"
      });
    },

    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getQuesListOfBookZhangJie();
    },
    // 获取科目相关的试题列表
    async getQuesListOfBookZhangJie() {
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getQuestionOfBook("", {
        bookid: this.currentItemData.BookId,
        question_content: this.searchQuestionContent,
        zhang: this.currentItemData.Zhang,
        jie: this.currentItemData.Jie,
        topic: this.currentItemData.TopicNo,
        limit: this.rows,
        offset: offsetRow
      });
      this.questionsListOfBook = res.data ? res.data : [];
      this.BookChapter.Questions = this.BookChapter.Questions
        ? this.BookChapter.Questions
        : [];
      this.$nextTick(() => {
        this.questionsListOfBook.forEach(question => {
          this.BookChapter.Questions.forEach(selectItem => {
            if (question.Id == selectItem) {
              this.$refs.refElTabel.toggleRowSelection(question, true);
            }
          });
        });
      });

      this.allRows = res.title; 
    }
  }
};
</script>
<style scope>
.optionAnswer >>> .el-checkbox:last-of-type {
  margin-right: 5px;
}
.optionAnswer >>> .el-radio {
  margin-right: 5px;
}
</style>

