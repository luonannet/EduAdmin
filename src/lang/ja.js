export default {
  route: {
    dashboard: 'トップ',
    system: '系统设置',
    setting: '设置', 
    sendSMS: '发送短信',
    trackList: '跟进记录',
    customManage: '学员管理',
    customList: '全部学员',
    college:"院系方向",
    courseList: '课程产品',
    bookResearch:"教学研发",
    bookList: '教材列表',
    questionsList:"试题管理",
    documentation: 'ドキュメント',
    web: '官网数据',
    platform: '校区管理',
    platformCustom:'本校学员',
    banner: '轮播图',
    docDownload: '资料下载',
    docUpload:"资料发布",
    managerList: '用户列表',
    managerLogs: '用户日志',
    news: '新闻管理',
    active: '活动展示',
    teacher: '优秀老师',
    linker:'友情链接',
    classList: '班级列表',
    honorList: '荣誉资质',
    business: '业务模块',
    contractList: '所有合同',
    personalData:"个人设置",
    bookAdpter: '教材章节',
    componentMixin: 'コンポーネントMixin',
    backToTop: 'BackToTop',
    dragDialog: 'Drag Dialog',
    dragSelect: 'Drag Select',
    dragKanban: 'Drag 看板',
    charts: 'チャート',
    keyboardChart: 'Keyboardチャート',
    lineChart: 'Lineチャート',
    mixChart: 'Mixチャート',
    example: 'Example',
    nested: 'Nested Routes',
     
    theme: 'テーマ変更',
    clipboardDemo: 'Clipboard',
    i18n: '多言語',
    externalLink: '外部リンク',
    profile: 'プロフィール',
    party:"竞赛活动",
    bookAsk:"学员提问",
    template:"官网页面",
    questions:"学员提问",
  },
  navbar: {
    dashboard: 'トップ',
    github: 'GitHub',
    logOut: 'ログアウト',
    profile: 'プロフィール',
    theme: 'テーマ変更',
    size: '画面サイズ'
  },
  login: {
    title: 'ユーザログイン',
    logIn: 'ログイン',
    username: 'ユーザ名',
    password: 'パスワード',
    any: 'password',
    code: '验证码'
  },
  documentation: {
    documentation: 'ドキュメント',
    github: 'Github Link'
  },
  permission: {
    addRole: 'ロール追加',
    editPermission: 'ロール変更',
    roles: 'ロール',
    switchRoles: 'ロール切替',
    tips: 'v-permissionは使えない時があります。例えば: Element-UI の el-tab、 el-table-column 及び他の dom。v-ifを使う必要があります。',
    delete: '削除',
    confirm: '確認',
    cancel: 'キャンセル'
  },
  customList: '学员列表',
  Custom: {
    Title: '学员',
    New: '新增学员',
    Update: '修改学员',
    Disable: '禁用学员'
  },
  components: {
    documentation: 'ドキュメント',
    tinymceTips: 'tinymceは管理画面に重要な機能ですが、その同時に落とし穴がありあす。tinymceを使う道のりが大変でした。Tinymceを使う時に各自のプロジェクト状況で判断が必要です。ドキュメントはこちら',
    dropzoneTips: 'Third partyのパッケージを使わず、独自の実装しています。詳細は @/components/Dropzone',
    stickyTips: 'ページの指定位置へスクロールした場合、表示されます。',
    backToTopTips1: 'トップへスクロールが表示されます。',
    backToTopTips2: 'ボタンのスタイルはカスタマイズできます。例えば、show/hide、height、position。 またはElementのel-tooltipを使って、ツールチップを実装できます。',
    imageUploadTips: 'mockjsは使えないため、カスタマイズしています。公式の最新バージョンを使ってください。'
  },
  table: {
    dynamicTips1: '先頭は固定、最後に追加',
    dynamicTips2: '戦後に追加せず、指定列に追加',
    dragTips1: 'デフォルト順番',
    dragTips2: 'Drag後の順番',
    title: 'タイトル',
    importance: '重要',
    type: 'タイプ',
    remark: '評価',
    search: '検索',
    add: '追加',
    export: 'エクスポート',
    reviewer: 'レビュアー',
    id: '番号',
    date: '日時',
    author: '作成者',
    readings: '閲覧数',
    status: 'ステータス',
    actions: '操作',
    edit: '編集',
    publish: '公開',
    draft: '下書き',
    delete: 'キャンセル',
    cancel: 'キャンセル',
    confirm: '確認'
  },
  example: {
    warning: '新規作成と編集画面は keep-alive を使えないです。keep-alive の include はrouteのキャッシュは使えないです。そのため、component name を使ってキャッシュさせるようにします。このようなキャッシュ機能を作りたい場合，localStorageを使う手があります。もしくは keep-alive の includeを使って、全ページキャッシュする方法はあります。'
  },
  errorLog: {
    tips: '右上のbugアイコンをクリックしてください。',
    description: '管理画面はspaを使う場合が多い、ユーザ体現向上はできますが、想定外エラーが発生する場合があります。Vueはそのエラーハンドリング機能を提供し、エラーレポートができます。',
    documentation: 'ドキュメント'
  },
  excel: {
    export: 'エクスポート',
    selectedExport: 'エクスポート対象を選択してください。',
    placeholder: 'ファイル名を入力してください。'
  },
  zip: {
    export: 'エクスポート',
    placeholder: 'ファイル名を入力してください。'
  },
  pdf: {
    tips: 'window.print() を使ってPDFダウンロードしています。'
  },
  theme: {
    change: 'テーマ切替',
    documentation: 'ドキュメント',
    tips: 'Tips: テーマの切り替え方法はnavbarのtheme-pickと異なります、使い方はドキュメントを確認してください。'
  },
  tagsView: {
    refresh: '更新',
    close: '閉じる',
    closeOthers: 'その他閉じる',
    closeAll: 'すべて閉じる'
  },
  settings: {
    title: 'システムテーマ',
    theme: 'テーマ色',
    tagsView: 'Tags-View 開く',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  }
}
