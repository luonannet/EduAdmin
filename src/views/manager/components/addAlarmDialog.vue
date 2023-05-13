<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowAlarmDialog" 
    width="440px"
    :title="formTitle"
  >
    <div class="alarmFormCss pad20 ">
      <el-form
        ref="refAlarmForm"
        :model="alarmFormData"
        :rules="alarmFormRules" 
        size="small"
        label-width="80px"
      >
        <el-form-item label="标题" prop="Title">
          <el-input v-model="alarmFormData.Title" />
        </el-form-item>
        <el-form-item label="提醒时间" prop="ExeTime">
          <el-date-picker
            v-model="alarmFormData.ExeTime"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="请选择提醒日期"
          />
        </el-form-item>
        <el-form-item label="提醒内容" prop="Content">
          <el-input
            v-model="alarmFormData.Content"
            type="textarea"
            :rows="3"
            placeholder="请输入提醒内容"
          />
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowAlarmDialog=false">取 消</el-button>
          <el-button type="primary" class="m-l-40" @click="saveAlarmFormData">确 认</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { addAlarm } from "@/api/alarm";

export default {
  data() {
    return {
      // 跟进提醒的表单数据
      alarmFormData: {
        Content: "",
        ExeTime: null,
        Title: ""
      },
      alarmTargetID:0,//接受者.0 表示发给自己
      formTitle: "发送提醒",
      // 控制提醒表单的显隐
      isShowAlarmDialog: false,
      // 表单验证
      alarmFormRules: {
        Title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        ExeTime: [
          { required: true, message: "提醒时间不能为空", trigger: "blur" }
        ],
        Content: [
          { required: true, message: "提醒内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    // 获取学员的基本信息
    setTarget(targetid,formTitle,title) {
      this.alarmTargetID = targetid;
      this.formTitle= formTitle;
      this.alarmFormData = {
        Content: "",
        ExeTime: null,
        Title: title
      };
     
      this.isShowAlarmDialog = true;
    },
    // 保存添加的提醒
    saveAlarmFormData() {
      // 验证表单数据
      this.$refs.refAlarmForm.validate(async valid => {
        if (valid) {
          if (this.alarmFormData.ExeTime) {
            this.alarmFormData.ExeTime = parseInt(
              this.alarmFormData.ExeTime.getTime() / 1000
            );
          }
          const res = await addAlarm(this.alarmTargetID, "", this.alarmFormData);

          res.title = res.title ? res.title : 0;
          this.$store.dispatch("Alarm", res.title);
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.isShowAlarmDialog = false;
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.alarmFormCss >>> .el-select {
  width: 100%;
}
.alarmFormCss >>> .el-date-editor {
  width: 100%;
}
</style>
