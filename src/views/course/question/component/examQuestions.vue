<template>
  <!-- 关联题库弹窗 -->
  <div class>
    <el-table :height="documentHeight"
      ref="refMockExam"
      :data="examQuestionList"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="mockExamQuestionIdSelectedChange"
    >
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column prop="QuestionType" label="题型" width="100">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.QuestionType==1">单选题</el-tag>
          <el-tag type="success" v-show="scope.row.QuestionType==2">多选题</el-tag>
          <el-tag type="warning" v-show="scope.row.QuestionType==3">判断题</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="QuestionContent" label="题干">
        <template slot-scope="scope">
          <div v-html="scope.row.QuestionContent" class="QuestionContentImg"></div>
        </template>
      </el-table-column>
       <el-table-column prop="BookId" label="教材ID" width="60"></el-table-column>
      <el-table-column prop="ZhangId" label="章" width="50"></el-table-column>
      <el-table-column prop="JieId" label="节" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TopicId" label="知识点" width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- <div class="between-center m-t-30">
      <el-pagination
        background
        @current-change="currentPageChangeQuestion"
        :current-page.sync="nowPageQuestions"
        :page-size="rowsQuestions"
        layout="total,prev, pager, next, jumper"
        :total="allRowsQuestions"
      ></el-pagination>
      <div>
        <el-button type="danger" @click="deleSelectQuestions">删除所选</el-button>
        <el-button type="primary" @click="saveExamQuestions">确定</el-button>
      </div>
    </div> -->
  </div>
</template>
<script>
import { getExerciseQuestion } from "@/api/exercise";
export default {
  props: {
    exerciseItem: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  data() {
    return {
      // 科目ID
      //当前编辑题库的组卷数据
      nowExamRow: {},
      //关联的考题的列表数据
      examQuestionList: [],
      //存储当前选中的组卷已经关联的题库ID
      allQuestionsIdSeleted: [],
      // 考题-数据总条数
      allRowsQuestions: 0,
      // 考题-当前页数
      nowPageQuestions: 1,
      // 考题-每页数据的总条
      rowsQuestions: 10,
      //存储当前页所有题的ID
      nowPageQuestionId: [],
      //存储所有的章
      zhangOptions: [],
      //存储所有的节
      jieOptions: [],
      //查询选中的章或节
      selectedZhang: 0,
      selectedJie: 0,
      documentHeight:500,
    };
  },
  watch: {
    exerciseItem(newval) {
      this.fire();
    }
  },
  methods: {
    //   获取组卷的数据
     fire() { this.documentHeight = document.body.clientHeight-400;
      // 初始化数据
      this.getSubjectZhang();
    },
    setExamQuestionList(list) {
      this.examQuestionList = list;
    },
    // 获取科目下所有的章
    async getSubjectZhang() {
      this.examQuestionList = [];
      if (!this.exerciseItem || this.exerciseItem.Id == 0) {
        return;
      }
      let res = await getExerciseQuestion(this.exerciseItem.Id,{simple:false});

      this.examQuestionList = res.data ? res.data.List : [];
    },
    // 选中的章-下拉列表
    zhangSelectedChange(selVa) {
      if (selVa == 0) {
        this.jieOptions = [];
        this.selectedJie = 0;
      }
      this.zhangOptions.forEach((item, index) => {
        if (item.Zhang == selVa) {
          this.jieOptions = item.Children ? item.Children : [];
        }
      });
    },
    // 获取该科目下的考题
    async getSubjectQuestion() {
      this.nowPageQuestionId = [];
      let offsetRow = (this.nowPageQuestions - 1) * this.rowsQuestions;
      let params = {
        bookid: this.subjectId,
        zhang: this.selectedZhang,
        jie: this.selectedJie,
        limit: this.rowsQuestions,
        offset: offsetRow,
        simple: 1
      };
      let res = await getQuestionOfBook(params);
      if (res.code == 200) {
        this.allRowsQuestions = res.title;
        this.examQuestionList = res.data ? res.data : [];
        this.examQuestionList.forEach(questionItem => {
          this.nowPageQuestionId.push(questionItem.Id);
          this.allQuestionsIdSeleted.forEach(checkedId => {
            if (questionItem.Id == checkedId) {
              this.$nextTick(() => {
                this.$refs.refMockExam.toggleRowSelection(questionItem, true);
              });
            }
          });
        });
      }
    },
    // 选中组卷模考已经关联的ID
    mockExamQuestionIdSelectedChange(seletedItem) {
      let nowSeletedQuestionId = [];
      // 遍历当前页已选中的选项
      seletedItem.forEach(item => {
        nowSeletedQuestionId.push(item.Id);
      });
      // 遍历已选中的所有Id
      this.allQuestionsIdSeleted = this.allQuestionsIdSeleted.filter(
        (value, index) => {
          if (!this.nowPageQuestionId.includes(value)) {
            return value;
          }
        }
      );
      this.allQuestionsIdSeleted = this.allQuestionsIdSeleted.concat(
        nowSeletedQuestionId
      );
    },
    deleSelectQuestions(){

    },
    // 保存已经选中的考题
    async saveExamQuestions() {
      let res = await saveExamQuestions(
        this.nowExamRow.Id,
        this.allQuestionsIdSeleted
      );
      if (res.code == 200) {
        this.common.go_alert("保存成功！");
        this.$emit("subClick", res.data);
      }
    },
    //查询数据-章节
    searchQuestionByZhangJie() {
      // 初始化数据分页
      this.allRowsQuestions = 0;
      this.nowPageQuestions = 1;
      this.examQuestionList = [];
      this.getSubjectQuestion();
    },
    // 考题-分页获取数据
    currentPageChangeQuestion(val) {
      this.nowPageQuestions = val;
      this.getSubjectQuestion();
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.refMockExam.doLayout();
    }, 2000);
  }
};
</script>
<style scope >
</style>