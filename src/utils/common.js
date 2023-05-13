import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import $ from 'jquery'
import { getCosTempKey } from "@/api/cos";
import cosSDK from "cos-js-sdk-v5";
export default {
  go_alert: function (msg) {
    $('body').append(`
    <div class='alert_box' style='position:fixed;z-index:8889;width:100%;height:100%;left:0;top:0px;background: rgba(255, 255, 255, 0)'>
      <div class='content' style='max-width: 70%;text-align:center;position:absolute;font-size:14px;left:50%;top:50%; transform:translateY(-50%) translateX(-50%);-webkit-transform:translateY(-50%) translateX(-50%);background-color:rgba(0,0,0,.5);border-radius:4px'>
        <p style='padding:10px 15px; line-height:1.6; color:#fff;font-size:14px'>${msg}</p>
      <div>
    <div>`)
    setTimeout(function () {
      $('.alert_box').css({ 'opacity': '0', 'width': '0%', 'height': '0' })
      setTimeout(function () { $('.alert_box').remove() }, 2000)
    }, 2000)
  },
  enlargeImg: function (ImgUrl) {
    const imgurl = ImgUrl ? `<img style="max-width:100%;" src="${ImgUrl}"/>` : ''
    const template = `<div class="enlargeImg"
		style="position: fixed;z-index: 1000;
		width: 100%;opacity: 1;height: 100%;left: 0;
		top: 0px;background-color: rgba(68, 68, 68, 0.7)">
   <div style="width:100%;height:100%;overflow-y: auto;display:flex;align-items:center;-webkit-align-items: center;
   justify-content: center;-webkit-justify-content: center;"
   ">
   	${imgurl}
	  </div>
   </div>`
    $('body').append(template)
    $('.enlargeImg').click(function () {
      var that = $(this)
      setTimeout(function () {
        // 隐藏弹框
        that.css({ 'opacity': '0', 'width': '0%', 'height': '0' })
        setTimeout(function () { that.remove() }, 0)
      }, 0)
    })
  },
  loading: function () {
    $('body').append(`<div class='loading_box' style='position:fixed;z-index:1500;width:100%;opacity:1;height:100%;left:0;top:0px;background-color:transparent;'>
    <div class='content' style='max-width: 70%;text-align:center;position:absolute;font-size:14px;left:50%;top:50%; transform:translateY(-50%) translateX(-50%);-webkit-transform:translateY(-50%) translateX(-50%);border-radius:4px'>
    <img style='width: 40px' src='../assets/slice/loading.gif' />
    <div>
    <div>`)
  },
  loadingHide: function () {
    if ($('.loading_box').length) {
      $('.loading_box').remove()
    }
  },
  // 格式化时间 ,displaytime 是否显示具体时间，1为显示，2为显示不显示秒，0为不显示
  dateFormat: function (item, displaytime) {
    if (item) {
      const date = new Date(item * 1000)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      let str = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`
      if (displaytime == 1) {
        str = str + ` ${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`
      } else if (displaytime == 2) {
        str = str + ` ${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}`
      }
      return str
    }
  },
  // 获取当前日期
  // displaytime 是否显示具体时间，1为显示，2为显示不显示秒，0为不显示
  dateFormatStr: function (date, displaytime, lianjiefu) {
    const strDate = new Date(date)
    const year = strDate.getFullYear()
    const month = strDate.getMonth() + 1
    const day = strDate.getDate()
    const hour = strDate.getHours()
    const minute = strDate.getMinutes()
    const second = strDate.getSeconds()
    if (lianjiefu == undefined) {
      lianjiefu = '-'
    }
    let str = `${year}${lianjiefu}${month > 9 ? month : `0${month}`}${lianjiefu}${day > 9 ? day : `0${day}`}`
    if (displaytime == 1) {
      str = str + ` ${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`
    } else if (displaytime == 2) {
      str = str + ` ${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}`
    }
    return str
  },
  // 截取字符串指定长度
  spliceLabel: function (val, leng) {
    return val.length > leng ? val.slice(0, leng) + '...' : val
  },

  // 导出表格-全部导出
  exportExcel(className, title) {
    const xlsxParam = { raw: true }
    const wb = XLSX.utils.table_to_book(document.getElementById(className), xlsxParam)
    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'array'
    })
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        title + '.xlsx'
      )
    } catch (e) {
      if (typeof console !== 'undefined');
    }
    return wbout
  },
  // 列表选中下载 excelData导出的数据,tHeader字段名称,filterVal字段
  downloadExcel(excelData, tHeader, filterVal) {
    require.ensure([], () => {
      const { export_json_to_excel } = require('@/components/excel/export2Excel')
      const data = excelData.map(v => filterVal.map(j => v[j]))
      // 这是表格的名称。合同列表+当前日期，dateFormatStr是一个方法，格式化了日期
      const excelName = '合同列表' + this.dateFormatStr(new Date())
      export_json_to_excel(tHeader, data, excelName) // 导出的表格名称，根据需要自己命名
    })
  },
  // 配置日期选择的快捷键
  datePickerOptions: {
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime())
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '昨天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setDate(start.getDate() - 1)
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setDate(end.getDate() - 1)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime())
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '过去一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '过去一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '过去三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  },
  // 配置日期选择的快捷键
  dateFuturePickerOptions: {
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime())
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '明天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setDate(start.getDate() + 1)
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setDate(end.getDate() + 1)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          start.setTime(start.getTime())
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '未来一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '未来一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '未来三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          end.setHours(0)
          end.setMinutes(0)
          end.setSeconds(0)
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  },


  // 学员推广渠道
  channelList: [

    {
      Label: '主动电访'
    },
    {
      Label: '网上开发'
    },
    {
      Label: '转介绍'
    },
    {
      Label: '地推学员'
    },
    {
      Label: '其他渠道'
    }
  ],

  // 意向学员学员类型
  IntentionalCustomerType: [

    {
      value: 0,
      Label: '全部学员'
    },
    {
      value: 1,
      Label: '普通学员'
    },
    {
      value: 2,
      Label: '有意向'
    },
    {
      value: 3,
      Label: '暂无意向'
    },
    {
      value: 4,
      Label: '彻底抛弃'
    }
  ],
  // 学员签订合同- 优惠类型
  costomPreferentialType: [
    {
      value: 0,
      Label: '优惠券'
    },
    {
      value: 1,
      Label: '活动优惠'
    },
    {
      value: 2,
      Label: '特殊申请优惠'
    }
  ],
  // 学员签订合同- 支付方式
  costomPaymentMethod: [
    {
      value: 0,
      Label: '微信支付'
    },
    {
      value: 1,
      Label: '支付宝支付'
    },
    {
      value: 2,
      Label: '对公转账'
    },
    {
      value: 3,
      Label: 'pos机刷卡'
    }
  ],
  // 管理人员的身份列表
  managerRoleList: [
    {
      value: 1,
      Label: '加盟机构'
    },
    {
      value: 0,
      Label: '管理员'
    },

  ],
  // 授课形式
  teachingForm: [
    {
      value: 1,
      Label: '面授周末班'
    },
    {
      value: 2,
      Label: '面授工作日班'
    },
    {
      value: 3,
      Label: '面授晚班'
    },
    {
      value: 4,
      Label: '在线直播班'
    },
    {
      value: 5,
      Label: '在线录播班'
    },
    {
      value: 6,
      Label: '一对一VIP班'
    },
    {
      value: 7,
      Label: '其他类型'
    }
  ],
  // 授课形式
  docRights: [
    {
      value: 0,
      Label: '公开级别'
    },
    {
      value: 1,
      Label: '内部级别'
    },
    {
      value: 2,
      Label: '隐秘级别'
    },
    {
      value: 3,
      Label: '保密级别'
    },
    {
      value: 4,
      Label: '绝密级别'
    }
  ],
  docRightmarks: {
    0: {
      style: {
        color: "#27C91E"
      },
      label: "公开级别"
    },
    1: {
      style: {
        color: "#A6B750"
      },
      label: "内部级别"
    },
    2: {
      style: {
        color: "#D7CB45"
      },
      label: "隐秘级别"
    },
    3: {
      style: {
        color: "#E88E4D"
      },
      label: "保密级别"
    },
    4: {
      style: {
        color: "#ff0000"
      },
      label: "绝密级别"
    }
  },
  // 资料类型的选项
  docKindList: [
    {
      value: 1,
      Label: "教研资料"
    },
    {
      value: 2,
      Label: "培训资料"
    },
    {
      value: 3,
      Label: "运营资料"
    },
    {
      value: 4,
      Label: "竞赛资料"
    },
    {
      value: 5,
      Label: "广告资料"
    },
    {
      value: 6,
      Label: "宣传资料"
    },
    {
      value: 7,
      Label: "其他资料"
    }
  ],
  AllQuestionTypes: [], // 所有题的类型
  systemForm: { Name: "", Logo: "" },
  // 根据类型变化返回一些数据的Label
  FormatSelect(options, typeId) {

    let title = '未知'
    if (options) {
      options.forEach(item => {
        if (item.Id == typeId) {
          title = item.Label
          return
        } else if (item.value == typeId) {
          title = item.Label
          return
        } else if (item.ID == typeId) {
          title = item.Label
          return
        }
      })
    }
    return title
  },
  FormatUnixTime(input) {
    return input * 1000;
  },
  ToUnixTime(input) {
    return parseInt(input / 1000);
  }
  ,
  // 上传附件之前的验证
  beforeUploadEnclosure(filename) {
    var ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
    let isRightType = false;
    switch (ext) {
      case "jpg":
        isRightType = true;
        break;
      case "jpeg":
        isRightType = true;
        break;
      case "png":
        isRightType = true;
        break;
      case "gif":
        isRightType = true;
        break;
      case "pdf":
        isRightType = true;
        break;
      case "doc":
        isRightType = true;
        break;
      case "docx":
        isRightType = true;
        break;
      case "xls":
        isRightType = true;
        break;
      case "xlsx":
        isRightType = true;
        break;
      case "ppt":
        isRightType = true;
        break;
      case "pptx":
        isRightType = true;
        break;
      case "rar":
        isRightType = true;
        break;
      case "zip":
        isRightType = true;
        break;
      case "txt":
        isRightType = true;
        break;

      default:
        isRightType = false;
        break;
    }
    if (!isRightType) {
      return ("文件仅支持jpg/jpeg/png/gif/pdf/doc/docx/xls/xlsx/ppt/pptx/rar/zip等格式!");
    }
    return isRightType;
  },
  async uploadCosFile(file, kind, filename, progressFunc, finishFun) {
    let res = await getCosTempKey("", {
      kind: kind,
      name: filename
    });
    var cos = new cosSDK({
      getAuthorization: function (options, callback) {
        callback({
          TmpSecretId: res.data.Credentials.TmpSecretId,
          TmpSecretKey: res.data.Credentials.TmpSecretKey,
          XCosSecurityToken: res.data.Credentials.Token,
          ExpiredTime: res.data.ExpiredTime
        });
      }
    });
    cos.putObject(
      {
        Bucket: res.data.Bucket,
        Region: res.data.Region,
        Key: filename,
        StorageClass: "STANDARD",
        Body: file.raw, // 上传文件对象
        onProgress: function (progressData) { progressFunc(progressData) },
      },
      function (err, data) {
        //http://platform-1301573799.cos.ap-chengdu.myqcloud.com/platform-167-logo.png
        finishFun(err, data,res.data.Bucket+".cos."+res.data.Region+".myqcloud.com/"+filename);
      }
    );
  },
}
