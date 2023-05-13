<template>
  <div class="font16 hgt_full m-t-10">
    <!-- <span class="m-b-10">请先在左边创建或选择一个试卷</span> -->
    <div class="flex_column hgt_full">
      <div class="between-center">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item v-if="exerciseItem&&exerciseItem.ClassID>0&&CourseItem.Id==0">
            <el-dropdown @command="selectCourse">
              <span class="el-dropdown-link">
                {{"《"+CourseItem.Label+"》"}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in courseOfClass"
                  :key="item.Id"
                  :command="item"
                >{{item.Label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-dropdown @command="selectBook">
              <span class="el-dropdown-link">
                {{"《"+BookItem.Label+"》"}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in bookOfCourse"
                  :key="item.Id"
                  :command="item"
                >{{ item.Label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="selectZhang">
              <span class="el-dropdown-link">
                {{zhangItem.SN+"("+zhangItem.Label+")"}}
                <i
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{Label:'全部章',SN:'',Value:0}">全部章</el-dropdown-item>
                <el-dropdown-item
                  v-for="item in zhangOfBook"
                  :key="item.Id"
                  :command="item"
                >{{item.SN+"("+item.Label+")"}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="selectJie">
              <span class="el-dropdown-link">
                {{jieItem.SN+"("+jieItem.Label+")"}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{Label:'全部节',SN:'',Value:0}">全部节</el-dropdown-item>
                <el-dropdown-item
                  v-for="item in jieOfBook"
                  :key="item.Id"
                  :command="item"
                >{{item.SN+"("+item.Label+")"}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="selectTopic">
              <span class="el-dropdown-link">
                {{topicItem.SN+"("+topicItem.Label+")"}}
                <i
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{Label:'全部知识点',SN:'',Value:0}">全部知识点</el-dropdown-item>
                <el-dropdown-item
                  v-for="item in topicOfJie"
                  :key="item.Id"
                  :command="item"
                >{{item.SN+"("+item.Label+")"}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="题干">
            <el-input
              class="wid_100"
              v-model="searchQuestionContent"
              placeholder="输入题干内容查重"
              @keyup.native.enter="getQuesListOfBookZhangJie"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getQuesListOfBookZhangJie">点击获取</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="hgt_full">
        <el-table
          :data="thisPageQuestionList"
          border
          tooltip-effect="light"
          style="width: 100%"
          :height="documentHeight"
          :row-style="{height:'40px'}"
          ref="refElTabel"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" v-if="CourseItem.Id>0"></el-table-column>
          <el-table-column prop="Id" label="ID" width="60"></el-table-column>
          <el-table-column prop="QuestionContent" label="题干" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div
                class="color-1f85aa font-w6 cursor"
                v-html="scope.row.QuestionContent"
                @click="openEditQuestionDialog(scope.$index, scope.row)"
              ></div>
            </template>
          </el-table-column>
          <el-table-column prop="QuestionType" label="类型" width="95">
            <template slot-scope="scope">
              <span>{{common.FormatSelect($store.getters.app.questionTypes,scope.row.QuestionType)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ManagerLabel" label="发布人" width="100"></el-table-column>
          <el-table-column prop="ZhangId" width="50" label="章"></el-table-column>
          <el-table-column prop="JieId" width="50" label="节"></el-table-column>
          <el-table-column prop="TopicId" width="80" label="知识点"></el-table-column>
          <el-table-column prop="QuestionScore" width="50" label="分值"></el-table-column>
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
        <div class="between-center m-v-15">
          <el-button v-if=" exerciseItem.Id<0" type="primary" @click="openAddQuestionDialog">新增试题</el-button>
          <el-button v-else type="primary" @click="saveExerciseQuestions">保存关联</el-button>

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
    </div>
    <!-- <span v-else>请先选择左边的试卷</span> -->
    <!-- 弹出框 -->
    <my-dialog :visible.sync="questionRowShow" :showLeft="false" title="题目详情编辑">
      <div slot="right_content">
        <question-row-dialog
          ref="refQusetionDialog"
          :formItemData="currentItemData"
          @subClickEvent="updateQuestionList"
        ></question-row-dialog>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import questionRowDialog from "@/views/course/question/component/questionRowDialog";
import $ImgHttp from "@/api/ImgAPI";
import { bookChapter } from "@/api/book";
import { getCourseBookByCourse } from "@/api/course";
import { getClassCourse } from "@/api/class";
import {
  getQuestionOfBook,
  saveExamQuestions,
  getCourseExercise
} from "@/api/exercise";
import common from "@/utils/common";
export default {
  name: "questionsList",
  components: {
    myDialog,
    questionRowDialog
  },
  props: {
    // classID: {
    //   typ: Number,
    //   default: 0
    // },
    exerciseItem: {
      typ: Object,
      default: function() {
        return { Id: -1 };
      }
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
      rows: 30,
      // 查询-搜索
      CourseItem: {
        Id: 0,
        SN: "",
        Label: "全部课程"
      },
      BookItem: {
        SN: "",
        Label: "全部教材"
      }, //搜索
      zhangItem: {
        SN: "",
        Label: "全部章"
      }, //搜索章
      jieItem: {
        SN: "",
        Label: "全部节"
      }, //搜索节
      topicItem: {
        SN: "",
        Label: "全部知识点"
      },
      //搜索有没有相同的题干了.
      searchQuestionContent: "",
      // 科目名称
      subjectLabel: "",
      // 更多操作弹窗
      questionRowShow: false,
      // 当前索引操作的
      currentQuestionIndex: null,
      allSelectedQuesionIDS: [],
      // 科目的试题列表
      //存储当前页所有题的ID
      thisPageQuestionList: [],
      courseOfClass: [],
      bookOfCourse: [],
      zhangOfBook: [],
      jieOfBook: [],
      topicOfJie: [],
      // 图片地址
      ImgAddr: "",
      currentPlatform: {},
      // 模态框获得的单条数据
      currentItemData: {
        TopicNo: 1,
        Zhang: 1,
        Jie: 1
      },
      //0 代表公共的试题列表。大于零则代表班级自己的和公共的
      currentClassID: 0,
      // 表单验证
      questionFormRules: {
        ZhangId: [{ required: true, message: "请填写章编号", trigger: "blur" }],
        JieId: [{ required: true, message: "请填写节编号", trigger: "blur" }],
        TopicId: [{ required: true, message: "请填写知识点", trigger: "blur" }],
        QuestionScore: [
          { required: true, message: "请填写题的分值", trigger: "blur" }
        ],
        QuestionContent: [
          { required: true, message: "请填写题干内容", trigger: "blur" }
        ]
      },
      documentHeight: 500
    };
  },
  watch: {
    $route(to, from) {
      this.fire();
    },
    exerciseItem(newval) {
      this.fire();
    }
  },
  mounted() {
    this.fire();
  },
  methods: {
    async fire() {
      this.documentHeight = document.body.clientHeight - 400;

      this.thisPageQuestionList = [];
      if (this.$route.query.bookId) {
        this.currentItemData.BookId = parseInt(this.$route.query.bookId);
        this.bookChapter();
        this.getQuesListOfBookZhangJie();
      } else if (this.exerciseItem) {
        if (this.exerciseItem.ClassID > 0) {
          if (this.exerciseItem.Id == 0) {
            return;
          }
          this.allSelectedQuesionIDS = [];
          if (this.exerciseItem.QuestionId != "") {
            let oldQuestionIDs = this.exerciseItem.QuestionId.split(",");
            oldQuestionIDs.forEach(id => {
              this.allSelectedQuesionIDS.push(parseInt(id));
            });
          }
          let res = await getClassCourse(this.exerciseItem.ClassID, {});
          this.courseOfClass = res.data ? res.data : [];
        } else if (this.exerciseItem.CourseID > 0) {
          let courseItem = {};
          courseItem.Id = this.exerciseItem.CourseID;
          await this.selectCourse(courseItem);
          if (this.bookOfCourse.length > 0) {
            this.selectBook(this.bookOfCourse[0]);
          }
        }
      }
    },
    // 复制文本
    copy() {
      let clipboard = new this.clipboard(".tag-read");
      clipboard.on("success", e => {
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 释放内存
        clipboard.destroy();
      });
    },
    handleSelectionChange(thisPageSelectItemS) {
      let thisPageSelectIDS = [];
      // // 遍历当前页已选中的选项
      thisPageSelectItemS.forEach(item => {
        thisPageSelectIDS.push(item.Id);
      });
      let thisIDS = [];
      this.thisPageQuestionList.forEach(item => {
        thisIDS.push(item.Id);
      });

      let allDeleteIds = thisIDS.filter(itemID => {
        if (
          !thisPageSelectIDS.includes(itemID) &&
          this.allSelectedQuesionIDS.includes(itemID)
        ) {
          return itemID;
        }
      });

      // 遍历已选中的所有Id
      let notInIDS = thisPageSelectIDS.filter(value => {
        if (!this.allSelectedQuesionIDS.includes(value)) {
          return value;
        }
      });
      this.allSelectedQuesionIDS = this.allSelectedQuesionIDS.concat(notInIDS);
      this.allSelectedQuesionIDS = this.allSelectedQuesionIDS.filter(itemID => {
        if (!allDeleteIds.includes(itemID)) {
          return itemID;
        }
      });
    },
    // 题库上传图片
    async ImgUploadQuestion(file, fileList) {
      this.isbusy = true;
      let res = await $ImgHttp.UploadImgExercise(
        this.currentItemData.BookId,
        file.raw
      );
      if (res.code == 200) {
        this.ImgAddr = `<img src="${res.data}" />`;
        this.isbusy = false;
        this.common.go_alert("上传成功");
      }
    },

    async selectCourse(item) {
      this.CourseItem.Label = item.Label;
      this.CourseItem.Id = item.Id;
      let res = await getCourseBookByCourse(item.Id, "");
      this.bookOfCourse = res.data;
      this.BookItem = {
        SN: "",
        Label: "全部教材"
      };
      this.zhangItem = {
        SN: "",
        Label: "全部章"
      };
      this.jieItem = {
        SN: "",
        Label: "全部节"
      };
      this.topicItem = {
        SN: "",
        Label: "全部知识点"
      };
      this.zhangOfBook = [];
      this.jieOfBook = [];
      this.topicOfJie = [];
    },
    selectBook(item) {
      this.BookItem.Label = item.Label;
      this.BookItem.Id = item.TBookId;
      this.currentItemData.BookId = this.BookItem.Id;
      this.zhangItem = {
        SN: "",
        Label: "全部章"
      };
      this.jieItem = {
        SN: "",
        Label: "全部节"
      };
      this.topicItem = {
        SN: "",
        Label: "全部知识点"
      };
      this.jieOfBook = [];
      this.topicOfJie = [];
      this.bookChapter();
    },
    selectZhang(item) {
      this.topicOfJie = [];
      this.jieOfBook = item.Children;
      this.zhangItem = item;

      this.jieItem = {
        SN: "",
        Label: "全部节"
      };
      this.topicItem = {
        SN: "",
        Label: "全部知识点"
      };
    },
    selectJie(item) {
      this.topicOfJie = item.Children;
      this.jieItem = item;
      this.topicItem = {
        SN: "",
        Label: "全部知识点"
      };
    },
    selectTopic(item) {
      this.topicItem = item;
    },
    async bookChapter() {
      let res = await bookChapter(this.currentItemData.BookId, "");
      this.zhangOfBook = res.data ? res.data.Children : [];
      this.BookItem.Label = res.title;
      this.BookItem.SN = this.currentItemData.BookId;
    },
    // 获取科目相关的试题列表
    async getQuesListOfBookZhangJie() {
      if (!this.currentItemData.BookId || this.currentItemData.BookId == 0) {
        this.$message({
          message: "请选择课程和教材",
          type: "warning"
        });
        return;
      }
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getQuestionOfBook("", {
        bookid: this.currentItemData.BookId,
        question_content: this.searchQuestionContent,
        zhang: this.zhangItem.Value,
        jie: this.jieItem.Value,
        topic: this.topicItem.Value,
        limit: this.rows,
        offset: offsetRow
      });
      this.thisPageQuestionList = res.data ? res.data : [];
      this.allRows = res.title;

      let thisPageQuestionIDS = [];
      // // 遍历当前页已选中的选项
      this.thisPageQuestionList.forEach(item => {
        thisPageQuestionIDS.push(item.Id);
      });
      this.thisPageQuestionList.filter(questionItem => {
        if (this.allSelectedQuesionIDS.includes(questionItem.Id)) {
          this.$nextTick(() => {
            this.$refs.refElTabel.toggleRowSelection(questionItem, true);
          });
        }
      });
    },
    async saveExerciseQuestions() {
      if (this.exerciseItem.Id == 0) {
        this.$message({
          message: "试卷id不能为0",
          type: "warning"
        });
        return;
      }
      let res = await saveExamQuestions(
        this.exerciseItem.Id,
        "",
        this.allSelectedQuesionIDS
      );
      this.$message({
        message: "【" + this.exerciseItem.Label + "】试卷保存成功",
        type: "success"
      });
    },
    // 打开试题的模态框-新增
    openAddQuestionDialog() {
      this.currentItemData = {};
      this.currentQuestionIndex = -1;
      this.currentItemData.QuestionScore = "";
      this.currentItemData.QuestionContent = "";
      this.currentItemData.QuestionType = 1;
      this.currentItemData.A = "";
      this.currentItemData.B = "";
      this.currentItemData.C = "";
      this.currentItemData.D = "";
      this.currentItemData.F = "";
      this.currentItemData.G = "";
      this.currentItemData.H = "";
      this.currentItemData.I = "";
      this.currentItemData.ZhangId = this.currentItemData.Zhang;
      this.currentItemData.JieId = this.currentItemData.Jie;
      this.currentItemData.TopicId = this.currentItemData.Topic;
      this.questionRowShow = true;
      this.currentItemData.BookId = parseInt(this.$route.query.bookId);
    },
    //  打开试题的模态框-编辑
    openEditQuestionDialog(index, row) {
      this.currentQuestionIndex = index;
      this.currentItemData = { ...row };
      this.questionRowShow = true;
    },
    // 更新数据列表
    updateQuestionList(type, row) {
      if (type == 0) {
        this.thisPageQuestionList.push(row);
        this.questionRowShow = false;
      } else if (type == 1) {
        this.thisPageQuestionList.splice(this.currentQuestionIndex, 1, row);
        this.questionRowShow = false;
      } else if (type == -1) {
        this.questionRowShow = false;
      }
    },
    // // 获取试题类型
    // async questionTypes() {
    //   let res = await getQuestionTypes("");
    //   if (res.code == 200) {
    //     this.$store.getters.app.questionTypes = res.data ? res.data : [];
    //   }
    // },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getQuesListOfBookZhangJie();
    }
  }
};
</script>
<style scope >
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.QuestionContentImg > img {
  height: 120px;
  width: auto;
}
</style>

