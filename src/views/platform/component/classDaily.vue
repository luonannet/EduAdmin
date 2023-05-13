
<template>
  <div class="p_both10 p-t-5">
    <div class="flex_dom">
      <div class="mycalendar bg-999">
        <el-calendar id="calendar" v-model="showDate">
          <template slot="dateCell" slot-scope="{date, data}">
            <div
              class="calendar-day"
              :class="{day_selected:calendarSelectData.indexOf(data.day)!=-1,nowday_selected:common.dateFormatStr(showDate)==data.day}"
            >{{ data.day.split('-').slice(2).join('-') }}</div>
          </template>
        </el-calendar>
      </div>
    </div>

    <vxe-table
      ref="timeTable"
      border
      :height="documentHeight"
      :edit-rules="TimeTableRules"
      @edit-disabled="editDisabledRow"
      :data="todayTimeTableList"
      :edit-config="{trigger: 'dblclick', mode: 'row',showIcon:false,activeMethod: activeTeacherRow}"
    >
      <vxe-table-column
        field="StartTime"
        title="计划上课时间"
        :edit-render="{type: 'default'}"
        width="120"
      >
        <template v-slot:edit="{ row }">
          <el-time-select
            placeholder="计划上课时间"
            v-model="row.StartTime"
            :picker-options="{
      start: '08:00',
      step: '00:10',
      end: '22:30'
    }"
          ></el-time-select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="EndTime" title="计划下课时间" :edit-render="{type: 'default'}" width="120">
        <template v-slot:edit="{ row }">
          <el-time-select
            placeholder="计划下课时间"
            v-model=" row.EndTime"
            :picker-options="{
      start: '08:00',
      step: '00:10',
      end: '22:30'
    }"
          ></el-time-select>
        </template>
      </vxe-table-column>
      <vxe-table-column field="CourseNum" title="计划课时" :edit-render="{type: 'default'}" width="120">
        <template v-slot:edit="{ row }">
          <el-input-number v-model="row.CourseNum" :min="0" :step="0.5" placeholder="小时"></el-input-number>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="BookLabel"
        title="上课科目"
        min-width="200"
        :edit-render="{type: 'default'}"
      >
        <template v-slot:edit="{row,rowIndex}">
          <el-select
            v-model="row.BookLabel"
            @change="(val)=>{return changeSubject(val, row,rowIndex)}"
          >
            <el-option
              v-for="(item,index) in classAllBooks"
              :key="index"
              :label="item.label"
              :value="item.bookid"
            ></el-option>
          </el-select>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="TeacherLabel"
        title="授课老师"
        width="90"
        :edit-render="{type: 'default'}"
      >
        <template v-slot:edit="{row,rowIndex}">
          <el-select
            v-model="row.TeacherID"
            @change="(val)=>{return changeTeacher(val, row,rowIndex)}"
          >
            <el-option
              v-for="(item,index) in classAllTeacher"
              :key="index"
              :label="item.Realname"
              :value="item.Id"
            ></el-option>
          </el-select>
        </template>
      </vxe-table-column>

      <vxe-table-column
        field="Address"
        title="授课地址"
        min-width="100"
        :edit-render="{type: 'default'}"
        show-overflow
      >
        <template v-slot:edit="scope">
          <el-input v-model="scope.row.Address" @input="$refs.timeTable.updateStatus(scope)"></el-input>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" min-width="80">
        <template v-slot="{row,rowIndex}">
          <el-button type="warning" v-if="row.Id<0" @click="deleclassDailyData(row,rowIndex)">删除</el-button>

          <el-button
            v-else-if="row.TeacherID != $store.getters.manager.Id"
            type="primary"
            @click="openTimeTagDialog(row,rowIndex)"
          >查看考勤</el-button>
          <el-button v-else type="primary" @click="openTimeTagDialog(row,rowIndex)">考勤</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <div class="between-center m-t-30">
      <el-button v-show="isAllowEdit" @click="insertTableRow(-1)">添加课程</el-button>
      <el-button type="primary" v-show="isAllowEdit" @click="saveTimeTableList">保 存</el-button>
    </div>

    <!-- 模态框 -->
    <div>
      <!-- 考勤记录 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showTimeTagDialog"
        :append-to-body="true"
        width="740px"
        :title="'['+classDailyData.TeacherLabel+'] 老师的考勤'"
      >
        <classCheck
          :classDaily="classDailyData"
          v-if="showTimeTagDialog"
          @subAddClassCheckEvent="closeTimeTagDialog"
        ></classCheck>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getTimeTableByMonth,
  addClassDaily,
  addClassCheck,
  getClassDaily
} from "@/api/class";
import {
  getManagerList,
  getAllTeacher,
  resetPasswordManager
} from "@/api/manager";
import { getAllManagerOfPlatform } from "@/api/platform";
import { getBooksOfCourses } from "@/api/course";
import classCheck from "./classCheck";
import common from "@/utils/common";
export default {
  name: "schoolTimeTable",
  props: {
    // 班级
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  components: {
    classCheck
  },
  data() {
    return {
      common,
      classAllTeacher: [],
      // 已经添加课表的日期
      calendarSelectData: [],
documentHeight:500,
      currentCheckIndex: 0,
      // 课程所有的科目
      classAllBooks: [],
      //  某一月课程表数据
      MonthTimeTableList: {},
      //  某一天课程表数据
      todayTimeTableList: [],
      // 之前月份获取的数据的那年那月的
      nowTimeTableOfDay: "",
      // 课表是否可以进行编辑
      isAllowEdit: true,
      // 显示当前日历所在的月份
      showDate: new Date(),
      // table数据的验证
      TimeTableRules: {
        StartTime: [{ required: true, message: "上课时间不能为空" }],
        EndTime: [{ required: true, message: "下课时间不能为空" }],
        CourseNum: [{ required: true, message: "计划课时不能为空" }],
        BookLabel: [{ required: true, message: "授课科目不能为空" }],
        Address: [{ required: true, message: "授课地址不能为空" }]
      },
      // 控制考勤记录模态框的显隐
      showTimeTagDialog: false,
      // 单条课程表的数据
      classDailyData: {}
    };
  },
  watch: {
    // 监听日历显示日期的变化
    showDate: {
      handler(newValue) {
        let today = new Date().getTime();
        let selectday = new Date(newValue).getTime();
        if (selectday + 86400000 < today) {
          this.isAllowEdit = false;
        } else {
          this.isAllowEdit = true;
        }
        this.getTimeTableSelectDay();
      },
      deep: true, 
    }
  },
  mounted() {},
  methods: {
    // 禁止编辑以前添加的老师
    editDisabledRow({ row, column }) {
      this.$message({
        message: "禁止编辑",
        type: "warning"
      });
    },
    //获取班级的基本信息
     fire() { this.documentHeight = document.body.clientHeight-400;
      this.getTimeTable();
      this.getAllManagerOfPlatform();
      this.getBooksOfCourses();
    },

    // 改变科目的时候
    changeSubject(val, row, rowIndex) {
      this.classAllBooks.forEach(item => {
        if (item.bookid == val) {
          row.BookLabel = item.label;
        }
      });
    },
    // 改变任课老师的时候
    changeTeacher(val, row, rowIndex) {
      this.classAllTeacher.forEach(item => {
        if (item.Id == val) {
          row.TeacherLabel = item.Realname;
        }
      });
    },

    // 获取班级的授课老师
    async getBooksOfCourses() {
      if (this.formItemData.CourseList == "") {
        this.$message({
          message: "请先给这个班级添加课程",
          type: "warning"
        });
        return;
      }
      let res = await getBooksOfCourses(
        "",
        "",
        this.formItemData.CourseList.split(",")
      );
      if (res.data) {
        this.classAllBooks = res.data ? res.data : [];
      }
    },
    // 获取班级的授课老师
    async getAllManagerOfPlatform() {
      let res = await getAllManagerOfPlatform(this.formItemData.PlatformID, {
        onlyLive: true,
        needtotal: false
      });

      if (res.data) {
        this.classAllTeacher = res.data ? res.data : [];
      }
    },
    // 根据月份获取数据
    async getTimeTable() {
      let nowSelectDayObj = this.common.dateFormatStr(this.showDate).split("-");
      let urlParams =
        this.formItemData.Id +
        "/" +
        nowSelectDayObj[0] +
        "/" +
        nowSelectDayObj[1];
      let res = await getTimeTableByMonth(urlParams);
      res.title = res.title ? res.title.split(",") : [];
      this.calendarSelectData = res.title;
      res.data = res.data ? res.data : {};
      this.nowTimeTableOfDay = "";
      this.nowTimeTableOfDay = nowSelectDayObj[0] + "-" + nowSelectDayObj[1];
      this.MonthTimeTableList = res.data;
      this.getTimeTableSelectDay();
    },
    // 点击日历获取数据
    getTimeTableSelectDay() {
      let day = this.common.dateFormatStr(this.showDate);
      let fullDate = day.split("-");
      let yearMonth = fullDate[0] + "-" + fullDate[1];
      if (yearMonth != this.nowTimeTableOfDay) {
        this.getTimeTable();
      } else {
        if (this.MonthTimeTableList[day]) {
          this.todayTimeTableList = this.MonthTimeTableList[day];
        } else {
          this.todayTimeTableList = [];
        }
      }
    },

    // 插入行添加课表
    insertTableRow(row) {
      let newItem = {
        Id: -this.todayTimeTableList.length - 1
      };
      this.todayTimeTableList.push(newItem);
    },
    // id小于0的行可以删除
    deleclassDailyData(row, rowIndex) {
      this.todayTimeTableList.splice(rowIndex, 1);
    },

    // 保存添加或者编辑的课程表
    saveTimeTableList() {
      this.$refs.timeTable.validate(async valid => {
        if (valid) {
          let nowSelectDayObj = this.common
            .dateFormatStr(this.showDate)
            .split("-");
          let urlParams =
            this.formItemData.Id +
            "/" +
            this.common.dateFormatStr(this.showDate);
          let res = await addClassDaily(urlParams, "", this.todayTimeTableList);

          res.title = res.title ? res.title.split(",") : [];
          this.calendarSelectData = res.title;
          res.data = res.data ? res.data : {};
          this.nowTimeTableOfDay = "";
          this.nowTimeTableOfDay =
            nowSelectDayObj[0] + "-" + nowSelectDayObj[1];
          this.MonthTimeTableList = res.data;
          this.getTimeTableSelectDay();
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          return false;
        }
      });
    },

    // 禁止编辑超过当前日期的课表
    editDisabledRow({ row, column }) {
      this.$message({
        message: "已完成的课程不能编辑",
        type: "success"
      });
    },
    // 可以编辑的行数
    activeTeacherRow({ row, rowIndex }) {
      if (this.isAllowEdit) {
        return rowIndex == rowIndex;
      }
    },
    // 点击考勤，打开考勤模态框
    openTimeTagDialog(row, rowIndex) {
      this.currentCheckIndex = rowIndex;
      this.classDailyData = this.todayTimeTableList[this.currentCheckIndex];
      // console.log(    this.currentCheckIndex,"=====", this.classDailyData);
      this.classDailyData.timeTableDate = this.common.dateFormatStr(
        this.showDate
      );
      this.showTimeTagDialog = true;
    },
    // 关闭考勤记录弹窗
    closeTimeTagDialog(dailyData) {
      this.showTimeTagDialog = false;
      this.classDailyData = dailyData;
      this.todayTimeTableList[this.currentCheckIndex] = dailyData;
    }
  }
};
</script> 
<style scoped>
#calendar {
  width: 100%;
}
.day_selected {
  border-radius: 50%;
  background: #2e77f8;
  color: #ffffff;
}
.nowday_selected {
  border-radius: 50%;
  background: #f31810 !important;
  color: #ffffff;
}
.mycalendar >>> .el-calendar-table .el-calendar-day {
  padding: 10px 0px;
  text-align: center;
  line-height: 40px;
  height: 40px;
}
.mycalendar >>> .calendar-day {
  text-align: center;
  width: 22px;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  margin: 0px 5px;
}
.mycalendar >>> .el-calendar__body {
  padding: 10px;
}
.mycalendar >>> .el-button--mini {
  /* padding: 2px; */
}
.mycalendar >>> .current,
.mycalendar >>> .next,
.mycalendar >>> .prev {
  border: none;
  border-bottom: 1px solid #eaeaea;
  height: 40px;
}
</style> 