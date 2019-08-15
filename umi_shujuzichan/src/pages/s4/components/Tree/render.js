/* eslint-disable */
import d3 from 'd3';
import textures from 'textures';

function render(eleContainer, leftDepts, rightDepts, rightApps, leftData = {}, rightData = {}, options) {
  const {
    width = 1860,
      height = 950,
      itemMargin = 10, // 产业之间间隙
      borderLineWidth = 1 // 产业和部门边线宽
  } = {};
  const topScale = options.topScale || 0
  const leftScale = options.leftScale || 0

  // 颜色----------------------------------------------------------------------
  const colorMain10 = "rgba(0, 185, 248, 1)";
  const colorMain8 = "rgba(0, 185, 248, .8)";
  const colorMain6 = "rgba(0, 185, 248, .6)";
  const colorMain5 = "rgba(0, 185, 248, .5)";
  const colorMain4 = "rgba(0, 185, 248, .4)";
  const colorMain2 = "rgba(0, 185, 248, .2)";
  const colorMain1 = "rgba(0, 185, 248, .1)";
  const colorTexture = "rgba(255, 255, 255, .1)";
  const colorRed1 = "rgba(208, 2, 27, 1)";
  const colorBg = "rgba(47, 80, 210, .2)";
  const colorText1 = "rgba(220, 244, 253, 1)";
  const colorText2 = "rgba(255, 255, 255, .6)";
  const colorHighLight = "#DCFB50";
  const colorBorder = 'rgba(0, 35, 81, 1)'
  // 链接状态颜色 0:规划未接入 1:已接入 2:异常 3:没规划没接入
  const colorStatusStroke = {
    0: colorMain8,
    1: colorMain10,
    2: colorRed1,
    3: colorMain8
  };
  const colorStatusFill = {
    0: "transparent",
    1: colorMain10,
    2: "transparent",
    3: "transparent"
  };
  const colorStatusLine = {
    0: colorMain2,
    1: colorMain10,
    2: colorRed1,
    3: "none"
  };
  const colorStatusFillHover = {
    0: "transparent",
    1: colorHighLight,
    2: "transparent",
    3: "transparent"
  };
  // 背景多边形路径------------------------------------------------------------
  // 背景标题矩形--------------------
  const points1 = [
    [27.4410839, 24.2174047],
    [31.181038, 24.2174047],
    [31.181038, 10.6431737],
    [43.8525308, 0],
    [2.68885445e-12, 0],
    [0, 97.9569892],
    [43.9638459, 97.9569892],
    [31.181038, 87.2023335],
    [31.181038, 73.6416591],
    [27.4410839, 73.6416591]
  ];
  // 按钮多边形-----------------------
  let pointsBtn = [
    [66.82, 130.15],
    [79.36, 139.35],
    [79.36, 190.37], // 开始拉伸
    [66.82, 198.45]
  ];
  // 按钮三角--------------------
  let pointsBtnTriangle = [
    [69.1, 164.44],
    [77.28, 156.25],
    [77.28, 172.63]
  ];
  // 部门背景多边形------------------------
  let points2 = [
    [83.56, 136.79],
    [66.92, 124.52],
    [66.92, 115.13],
    [83.56, 100.31],
    [216.35, 100.31],
    [233.06, 117.11],
    [233.06, 125.13],
    [216.35, 136.79],
    [216.35, 191.61], // 需要拉长部分
    [233.06, 203.87],
    [233.06, 213.27],
    [216.35, 228.08],
    [83.56, 228.08],
    [66.92, 213.27],
    [66.92, 203.87],
    [83.56, 191.61]
  ];
  // 来源分析和共享分析按钮
  const pathAnalyzeBtn =
    "M608.380241,717.566337 C589.456575,672.479475 579,622.960866 579,570.999992 C579,519.422995 589.302644,470.252308 607.962217,425.433649 L668.771242,425.433656 L668.771242,717.566329 L608.380238,717.566329 Z";

  // 全局公共部分=============================================================
  d3.select(eleContainer)
    .select("svg")
    .remove();
  const svg = d3
    .select(eleContainer)
    .append("svg")
    .attr({
      width: width,
      height: height
    });
  // 流入背景纹理-------------------------
  const texture1 = textures
    .lines()
    .orientation("6/8")
    .size(22)
    .strokeWidth(9)
    .stroke(colorTexture)
    .background(colorMain6);
  svg.call(texture1);
  // 流出背景纹理-----
  const texture2 = textures //纹理
    .lines()
    .size(22)
    .strokeWidth(9)
    .stroke(colorTexture)
    .background(colorMain6);
  svg.call(texture2);
  // 分析按钮渐变色----------------
  const defs = svg.append("defs");
  const linearGradient = [{
      offset: "0%",
      color: "#233070",
      opacity: 1
    },
    {
      offset: "100%",
      color: "#051741",
      opacity: 1
    }
  ];
  defs
    .append("linearGradient")
    .attr({
      id: "linearGradientBtn",
      x1: "100%",
      y1: 0,
      x2: 0,
      y2: 0
    })
    .selectAll("stop")
    .data(linearGradient)
    .enter()
    .append("stop")
    .attr({
      offset: d => d.offset,
      "stop-color": d => d.color,
      "stop-opacity": d => d.opacity
    });
  const countnums =
    (function () {
      var trim = function (strings) {
        return (strings || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, ""); //+表示匹配一次或多次，|表示或者，\s和\u00A0匹配空白字符，/^以……开头，$以……结尾，/g全局匹配,/i忽略大小写
      }
      return function (_str) {
        _str = trim(_str); //去除字符串的左右两边空格
        var strlength = _str.length;
        if (!strlength) { //如果字符串长度为零，返回零
          return 0;
        }
        var chinese = _str.match(/[\u4e00-\u9fa5]/g); //匹配中文，match返回包含中文的数组
        return strlength + (chinese ? chinese.length : 0); //计算字符个数
      }
    })()
  // 数据处理=============================================================
  // 常量------------------------------------------------------------
  const diagonal = d3.svg.diagonal().projection(d => [d.y, d.x]);
  const subItemHeight = 23; // 每个部门高度
  const itemTopMin = 3; // 第一个部门最小上边距
  // 流入------------------------------------
  // 流出------------------------------------
  const rightItemNum = Math.floor((height - itemTopMin * 2) / subItemHeight); // 流出部分 一页展示部门/应用个数
  const rightDeptTotalPage = Math.ceil(rightDepts.length / rightItemNum);
  const rightAppTotalPage = Math.ceil(rightApps.length / rightItemNum);
  const shareInfoTotal = rightData.data // 共享分析总的tooltip信息
  const sourceInfoTotal = leftData.data // 共享分析总的tooltip信息
  // 部门分布&应用分布
  const btnTriggerData = [{
      name: "部门分布",
      id: 0
    },
    {
      name: "应用分布",
      id: 1
    }
  ];
  const btnTriggerWidth = 23;
  const btnTriggerHeight = 120;
  // 公共部分------------------------------------------------------------
  const flowoutWidth = 240;
  const centerFlowout = [width - flowoutWidth / 2, height / 2]; // 旋转中心点
  const groupFlowoutOrigin = svg.append("g").attr({
    class: "groupFlowout"
  });
  const groupFlowoutTrans = svg.append("g").attr({
    class: "groupFlowout",
    transform: `translate(${width - flowoutWidth - 30}, -100)`
  });
  const groupFlowout = svg.append("g").attr({
    class: "groupFlowout",
    transform: `translate(${width - flowoutWidth}, 0)`
  });
  let groupRightListData;
  let groupSourceBtn // 来源分析按钮

  // leftDepts流入相关变量------------------------------------------------------------
  let industryLen // 流入产业个数
  let itemHeight // 流入每个产业的高度
  let deptItemNum // 流入每个产业/每页 展示部门个数 
  let groupLeftStaticData // 流入结构最外层包裹
  let groupIndustryTrans
  let pointsIndustry = []; // 产业背景矩形
  let pointsIndustryBtn = []; // 产业按钮多边形
  let pointsIndustryBtnTriangle = []; // 产业按钮三角
  let pointsDepartment = []; // flowin部门背景多边形
  let scalelenIndustry // 产业背景多边形中间可伸缩长度
  let scalelenIndustryBtn // 产业按钮中间可伸缩长度
  let scalelenDepartment // 部门背景可伸缩长度 流入
  let groupLeftDeptTextGroup // 流入部门文字和背景和连线等 最外层包裹
  let industryBtnLeftGroup // 流入左边按钮
  let industryBtnRightGroup // 流入右边按钮
  let groupLeftDeptItem // 流入绑定数据
  // rightDepts/rightApps流出相关变量------------------------------------------------------------
  let rightDeptCurrentPage = 1;
  let rightAppCurrentPage = 1;
  let currentPageFlowout
  let rightList // 流出部门或者应用名字列表
  let totalPageFlowout // 流出部门或者应用的总条数
  let currentFlowoutItemTop; // 当前页的上边距
  let currentFlowoutItemNum // 当前页面实际个数
  let itemTopFlowout // 当前页面上边距
  let typeIdName // 部门分布时为‘deptId’， 应用分布时为‘appId’
  let typeName // 部门分布时为‘depts’， 应用分布时为‘apps’
  let idArr // RightStatusDataByDeptsAppsObject对象会改变顺序，得到arr的时候要恢复顺序，存储id顺序
  let groupShareBtn // 共享分析按钮
  // 可伸缩长度------------
  let scalelenFlowoutLayout // 流出 充满高度
  let scalelenDepartmentFlowout // 部门背景可伸缩长度 流出
  let scalelenFlowoutBtn // 流出 按钮可伸缩
  let pointsLayout = []; // 流出分布背景矩形
  let pointsBtnFlowout = []; // 流出按钮多边形
  let pointsFlowoutBtnTriangle = []; // 流出按钮三角
  let pointsDepartmentFlowout = []; // flowout部门背景多边形
  let groupBtnLeftGroup // 流出左边按钮
  let groupBtnRightGroup // 流出右边按钮

  // leftData流入状态相关------------------------------------------------------------
  let indexIndustry
  let leftStatusPathGroup
  let sourceHoverInfo // 流入来源分析按钮hover信息
  let leftStatusData // 流入状态数据
  let statusGroup // 流入部门状态圈 包裹层
  // 流出状态相关变量------------------------------------------------------------
  let triggerType = 0; // 默认选中部门分布 应用分布为1
  let rightStatusApps = rightData.apps; // 右边应用分布应用状态
  let shareAnalyzeInfo = rightData.data; // 共享分析tooltip
  let rightStatusDepts = rightData.depts; // 右边部门分布部门状态
  let RightStatusData // 流出状态
  let RightStatusDataByDeptsAppsObject // object流出状态按照部门分类，每个部门可能有两个共享的数据
  let RightStatusDataByDeptsAppsArr // arr流出【每个部门的两个或一个数据】作为数组一项
  let currentRightStatusDataByDeptsAppsArr // 为了计算当前页面实际个数
  let rightStatusPathGroup

  // 分布和共享按钮相关变量------------------------------------------------------------
  let btnTriggerGroup
  let btnTrigger // 部门分布和应用分布
  let shareInfo = rightData.share; // 服务共享和数据共享
  let shareBtnItem // 共享按钮绑定事件
  if (shareInfo && shareInfo.length) {
    shareInfo.map((t, i) => {
      if (i === 0) {
        t.target = {
          y: 1315 * options.scales + leftScale,
          x: 400 * options.scales + topScale
        };
        t.endAngle = Math.PI * 0.37,
          t.startAngle = Math.PI * 0.498
      } else if (i === 1) {
        t.target = {
          y: 1315 * options.scales + leftScale,
          x: 550 * options.scales + topScale
        };
        t.endAngle = Math.PI * 0.502,
          t.startAngle = Math.PI * 0.624
      }
    })
  }
  // 来源分析按钮----------------
  groupLeftStaticData = svg // 流入右边背景框，要放在状态线下面
    .append("g")
    .attr({
      class: "groupLeftStaticData"
    })
  svg.append("g").attr({ //  放在来源分析按钮前面，避免重新渲染时挡住‘来源分析’按钮
    class: "flowinStatus"
  });
  renderSourceBtn()
  renderShareBtn() // 共享按钮

  // leftDepts相关渲染=============================================================
  
  if (leftDepts && leftDepts.length) {
    renderLeftStatic()
  }

  function renderLeftStatic() {
    industryLen = leftDepts.length;
    itemHeight = (height + itemMargin - 2) / industryLen - itemMargin;
    deptItemNum = Math.floor(itemHeight / (subItemHeight + itemTopMin * 2));
    // 可伸缩长度------------------------------------------------------------
    scalelenIndustry = itemHeight - 96.66666666666667; // 产业背景多边形中间可伸缩长度
    scalelenIndustryBtn = itemHeight - 68.3 - 2 * 29.73; // 产业按钮中间可伸缩长度
    scalelenDepartment = itemHeight - 127.77; // 部门背景可伸缩长度 流入
    points1.map((t, i) => {
      if (i > 4) {
        pointsIndustry.push([t[0], t[1] + scalelenIndustry]);
      } else {
        pointsIndustry.push(t);
      }
    });
    pointsBtn.map((t, i) => {
      if (i > 1) {
        pointsIndustryBtn.push([t[0], t[1] + scalelenIndustryBtn]);
      } else {
        pointsIndustryBtn.push(t);
      }
    });
    pointsBtnTriangle.map((t, i) => {
      pointsIndustryBtnTriangle.push([t[0], t[1] + scalelenIndustryBtn / 2]);
    });
    points2.forEach((t, i) => {
      if (i > 7) {
        pointsDepartment.push([t[0], t[1] + scalelenDepartment]);
      } else {
        pointsDepartment.push(t);
      }
    });
    // 数据处理------------------------------------------------------------
    handleLeftDepts();
    // 流入静态 布局=============================================================
    const groupLeftStaticDataItem = groupLeftStaticData.selectAll(".groupLeftStaticDataItem")
      .data(leftDepts)
      .enter()
      .append("g")
      .attr({
        class: "groupLeftStaticDataItem"
      });
    // 流入静态公共------------------------------------------------------------
    const groupIndustry = groupLeftStaticDataItem.append("g").attr({
      class: "groupIndustry"
    });
    groupIndustryTrans = groupLeftStaticDataItem.append("g").attr({
      class: "groupIndustry",
      transform: "translate(-30, -100)"
    });
    // 流入状态数据接入--------------------------------------------------------------------
    // 流入背景多边形----------------------------
    // 产业左边
    groupIndustry
      .append("polygon")
      .attr({
        class: "industryBgLeft",
        points: pointsIndustry,
        fill: colorMain6,
        transform: (d, i) => {
          // console.log(d) // 每项数据
          return "translate(0," + (itemHeight + itemMargin) * i + ")";
        }
      })
      .style({
        fill: texture1.url() // 一级部门背景纹理
      });
    // 产业右边
    groupIndustry.append("polygon").attr({
      class: "industryBgRight",
      points: pointsIndustry,
      fill: colorBg,
      "stroke-width": 1,
      stroke: colorMain5,
      transform: (d, i) => {
        return `rotate(180, 21.9262654 ${48.9784946 +
        scalelenIndustry / 2}) translate(-195,-${(itemHeight + itemMargin) *
        i})`;
      }
    });
    // 产业文字----------
    groupIndustry
      .append("text")
      .attr({
        class: d => `industryText${d.industryId}`,
        fill: colorText1,
        "font-size": 18, // fontSize不生效的
        "stroke-width": 20,
        "font-weight": "bolder",
        "text-anchor": "middle",
        "writing-mode": "vertical-lr", // d3文字竖排
        textLength: 90, // d3文字间距 'word-spacing': 100, // 该方法文字间距不生效
        dx: 14,
        dy: (d, i) => (itemHeight + itemMargin) * i + itemHeight / 2 // itemHeiht为每个item的高度，15为两个item的间距，dy为文字中心的y坐标
      })
      .text(d => d.industryName);
    // 流入部门------------------------------------------------------------
    // 部门相关逻辑
    const groupLeftDeptTrans = groupLeftStaticDataItem.append("g").attr({
      class: "groupLeftDeptTrans",
      transform: "translate(-30, -100)"
    });
    const groupLeftDept = groupLeftStaticDataItem.append("g").attr({
      class: "groupDepartment"
    });
    // 部门背景 静态，但是需要在文字背面
    groupLeftDeptTrans.append("polygon").attr({
      class: "polygon2",
      points: pointsDepartment,
      fill: colorBg,
      "stroke-width": 1,
      z: 40,
      stroke: colorMain5,
      transform: (d, i) => "translate(0," + (itemHeight + itemMargin) * i + ")"
    });
    // 流入按钮渲染------------------------------------------------------------
    renderFlowinBtnGroup();
    // 流入部门文字和背景和连线等------------------------------------------------------------
    groupLeftDeptTextGroup = groupLeftDept.append("g").attr({
      class: (d, i) => {
        return `textBgGroup${i} groupLeftTextGroup`;
      },
      transform: (d, i) => {
        return "translate(0, " + (itemHeight + itemMargin) * i + ")";
        // itemHeiht为每个item的高度，15为两个item的间距，dy为文字中心的y坐标
      }
    });
    renderGroupLeftDeptItem();
    bindFlowinTextEvent()

  }
  // rightList相关渲染=============================================================
  if (rightDepts && rightDepts.length && rightApps && rightApps.length) {
    renderRightStatic()
  }

  function renderRightStatic() {
    // 可伸缩长度 一次确定后不改------------------------------------------------------------
    scalelenFlowoutLayout = height - 96.6666666666666 - 2; // 流出 充满高度
    scalelenDepartmentFlowout = height - 127.77 - 2; // 部门背景可伸缩长度 流出
    scalelenFlowoutBtn = height - 68.3 - 2 * 29.73; // 流出 按钮可伸缩
    points1.map((t, i) => {
      if (i > 4) {
        pointsLayout.push([t[0], t[1] + scalelenFlowoutLayout]);
      } else {
        pointsLayout.push(t);
      }
    });
    pointsBtn.map((t, i) => {
      if (i > 1) {
        pointsBtnFlowout.push([t[0], t[1] + scalelenFlowoutBtn]);
      } else {
        pointsBtnFlowout.push(t);
      }
    });
    pointsBtnTriangle.map((t, i) => {
      pointsFlowoutBtnTriangle.push([t[0], t[1] + scalelenFlowoutBtn / 2]);
    });
    points2.forEach((t, i) => {
      if (i > 7) {
        pointsDepartmentFlowout.push([t[0], t[1] + scalelenDepartmentFlowout]);
      } else {
        pointsDepartmentFlowout.push(t);
      }
    });
    // 确定当前页面
    getCurrentRightStatic()
    getRightListData();
    // 背景------------------------------------------------------------
    // 右边
    groupFlowout
      .append("polygon")
      .attr({
        class: "flowoutLayoutBgRight",
        points: pointsLayout,
        fill: colorMain6,
        transform: `rotate(180, ${flowoutWidth / 2} ${centerFlowout[1]})`
      })
      .style({
        fill: texture2.url()
      });
    // 左边
    groupFlowout.append("polygon").attr({
      class: "flowoutLayoutBgLeft",
      points: pointsLayout,
      fill: colorBg,
      "stroke-width": 1,
      stroke: colorMain5
    });
    // 部门背景
    groupFlowoutTrans.append("polygon").attr({
      class: "departmentFlowoutBg",
      points: pointsDepartmentFlowout,
      fill: colorBg,
      "stroke-width": 1,
      stroke: colorMain5
    });
    // 流出按钮------------------------------------------------------------
    renderFlowoutBtnGroup();
    // 右边静态部门分布 部门列表------------------------------------------------------------
    renderListFlowout();
    renderLayoutBtn() // 分布按钮
  }

  // leftStatus相关渲染=============================================================
  console.log(7777, leftData);
  
  if (leftData && JSON.stringify(leftData) !== '{}') {
    renderLeftStatus()
  }

  function renderLeftStatus() {
    sourceHoverInfo = leftData.data // 流入来源分析按钮hover信息
    leftStatusData = leftData.industry // 流入状态数据
    handleLeftStatus()
    renderFlowinStatus()

  }
  // rightStatus相关渲染=============================================================
  if (rightData && JSON.stringify(rightData) !== '{}') {
    renderRightStatus()
  }

  function renderRightStatus() {
    // 流出状态数据接入--------------------------------------------------------------------
    svg.append('g') // 为了让后面渲染的线不遮盖共享按钮
      .attr({
        class: 'flowout'
      })
    getCurrentRightStatus()
    renderFlowoutStatus()
    renderShareItemBtn()
    bindShareBtnEvent()
  }

  // 事件绑定=====================================================================================
  // 流入部门文字事件-----------------------
  function bindFlowinTextEvent() {
    groupLeftDeptItem
      .on("mouseover", e => {
        const flowin = {
          leftId: e.deptId
        }
        triggerLeftMouseover(flowin, null, true);
      })
      .on("mouseout", e => {
        const flowin = {
          leftId: e.deptId
        };
        triggerLeftMouseout(flowin, null, true);
      });
  }
  // 流入翻页按钮事件----------------------------
  function bindLeftPageBtnEvent() {
    // 流入左边按钮事件
    industryBtnLeftGroup.on("click", e => {
      if (e.currentPage === 1) {
        return;
      }
      const industryId = e.industryId;
      handleLeftDeptsItem(industryId, "subtract");
      changeFlowinBtnGroup();
      reRender()
    });
    // 右边按钮事件
    industryBtnRightGroup.on("click", e => {
      if (e.currentPage === e.totalPage) {
        return;
      }
      const industryId = e.industryId;
      handleLeftDeptsItem(industryId, "add");
      changeFlowinBtnGroup();
      reRender()
    });

    function reRender() {
      changeGroupLeftDeptItem(); // 渲染文字和背景
      // 渲染状态
      renderFlowinStatus()
    }

    function changeFlowinBtnGroup() {
      d3.selectAll(`.industryBtnLeftGroup`).remove();
      d3.selectAll(`.industryBtnRightGroup`).remove();
      renderFlowinBtnGroup();
    }

    function changeGroupLeftDeptItem() {
      d3.selectAll(`.groupLeftDept`).remove();
      renderGroupLeftDeptItem(); // 渲染流入
      bindFlowinTextEvent() // 绑定流入文字hover事件
    }
  }
  // 流出翻页按钮事件
  function bindRightPageBtnEvent() {
    // // 流出左边按钮事件
    groupBtnLeftGroup.on("click", e => {
      if (currentPageFlowout === 1) {
        return;
      }
      handleFlowoutBtn("subtract");
      changeFlowoutBtnGroup();
      getRightListData(); // 更新数据
      changeListFlowout(); // 渲染文字
      // 更新状态和连接线
      renderFlowoutStatus()
    });
    // // 流出右边按钮事件
    groupBtnRightGroup.on("click", e => {
      if (currentPageFlowout === totalPageFlowout) {
        return;
      }
      handleFlowoutBtn("add");
      changeFlowoutBtnGroup();
      getRightListData(); // 更新数据
      changeListFlowout(); // 渲染文字
      // 更新状态和连接线
      renderFlowoutStatus()
    });
  }
  // 分布按钮切换
  function bindLayoutBtnEvent() {
    btnTriggerGroup.on("click", (d, i) => {
      triggerType = d.id;
      currentPageFlowout = [rightDeptCurrentPage, rightAppCurrentPage][
        triggerType
      ];
      renderBtnTrigger();
      rightList = [rightDepts, rightApps][triggerType];
      // 流出数据切换
      getCurrentRightStatic()
      getCurrentRightStatus()
      getRightListData();
      changeFlowoutBtnGroup();
      changeListFlowout();
      // 流出状态渲染
      renderFlowoutStatus()
    });
  }
  // 流入状态圈和线事件
  function bindLeftStatusHoverEvent() {
    statusGroup
      .on("mouseover", e => {
        const flowin = {
          leftId: e.deptId,
          leftAccessStatus: e.accessStatus
        };
        const flowout = e.flowOut ? e.flowOut[typeName] : []
        triggerLeftMouseover(flowin, flowout)
      })
      .on("mouseout", e => {
        const flowin = {
          leftId: e.deptId,
          leftAccessStatus: e.accessStatus
        };
        const flowout = e.flowOut ? e.flowOut[typeName] : []
        triggerLeftMouseout(flowin, flowout)
      });
  }
  // 流入hover事件处理--------------------------------------------------------------------
  function triggerLeftMouseover(flowin, flowout, showLink) {
    // 流入--------------------------
    let {
      leftId,
      leftAccessStatus
    } = flowin; // leftAccessStatus可能没值
    if (showLink) {
      d3.selectAll(`.textBg${leftId}`)
        .attr({
          fill: colorMain2
        });
    }
    d3.selectAll(`.textDeptLeft${leftId}`)
      .attr({
        fill: colorHighLight
      });
    d3.selectAll(`.leftStatusCircle${leftId}`)
      .attr({
        stroke: colorHighLight,
        fill: d => {
          if (!flowout && d.flowOut) {
            flowout = d.flowOut[typeName];
          }
          if (!leftAccessStatus) {
            leftAccessStatus = d.accessStatus
          }
          return colorStatusFillHover[leftAccessStatus]
        }
      })
    d3.selectAll(`.leftPath${leftId}`)
      .attr({
        stroke: d => leftAccessStatus === 3 ? 'none' : colorHighLight
      })
    // 流入线上文字
    d3.selectAll(`.scrollItemLeft${leftId}`)
      .style({
        opacity: 1
      })
    // 流出-------------------------
    let shareTypeNum = [] // 存放有哪些共享，以让这些共享按钮高亮
    if (flowout && flowout.length) {
      const flowoutById = {}; // 将流出一个部门对应两个共享的线安排在一起，展示两者的共同数据
      flowout.map(t => {
        const shareType = t.shareType
        const typeId = t[typeIdName];
        const accessStatus = t.accessStatus;
        d3.selectAll(`.rightPathDeptid${typeId}.rightPathSharetype${shareType}`)
          .attr({
            stroke: colorHighLight
          })
        d3.selectAll(`.rightStatusCircleDptid${typeId}`)
          .attr({
            stroke: colorHighLight,
            fill: colorStatusFillHover[accessStatus]
          })
        d3.selectAll(`.textFlowout${typeId}`)
          .attr({
            fill: colorHighLight
          })
        // 将流出一个部门对应两个共享的线安排在一起，展示两者的共同数据
        const id = typeId
        if (flowoutById[id]) {
          flowoutById[id].push(t)
        } else {
          flowoutById[id] = [t]
        }
      })
      // 流出线上字
      for (const key in flowoutById) {
        const item = flowoutById[key]
        if (item && item.length) {
          item.map(ttt => {
            shareTypeNum.push(ttt.shareType)
          })
          if (item.length > 1) {
            d3.selectAll(`.scrollItemRightAll${item[0][typeIdName]}`)
              .style({
                opacity: 1
              })
          } else {
            d3.selectAll(`.scrollRight${shareTypeNum[0]}`)
              .selectAll(`.scrollItemRight${item[0][typeIdName]}`)
              .style({
                opacity: 1
              })
          }
        }
      }
    }
    // 分析按钮 来源分析/共享分析/数据分享/服务共享-------------------------
    if (leftAccessStatus && leftAccessStatus !== 3) {
      d3.selectAll(`.sourceText`)
        .attr({
          fill: colorHighLight
        })
    }
    shareTypeNum = [...new Set(shareTypeNum)]
    if (shareTypeNum && shareTypeNum.length) {
      d3.selectAll(`.shareText`)
        .attr({
          fill: colorHighLight
        })
      shareTypeNum.map(t => {
        d3.selectAll(`.shareBtnText${t}`)
          .attr({
            fill: colorHighLight
          })
        d3.selectAll(`.sharePathBorder${t}`)
          .attr({
            stroke: colorHighLight
          })
      })
    }
  }

  function triggerLeftMouseout(flowin, flowout, showLink) {
    // 流入--------------------------
    let {
      leftId,
      leftAccessStatus
    } = flowin;
    if (showLink) {
      d3.selectAll(`.textBg${leftId}`).attr({
        fill: 'transparent'
      });
    }
    d3.selectAll(`.textDeptLeft${leftId}`).attr({
      fill: colorText2
    });
    d3.selectAll(`.leftStatusCircle${leftId}`).attr({
      stroke: d => colorStatusStroke[d.accessStatus],
      fill: d => {
        if (!flowout && d.flowOut) {
          flowout = d.flowOut[typeName];
        }
        if (!leftAccessStatus) {
          leftAccessStatus = d.accessStatus
        }
        return colorStatusFill[d.accessStatus];
      }
    });
    d3.selectAll(`.leftPath${leftId}`).attr({
      stroke: d => colorStatusLine[d.accessStatus]
    });
    // 流入线上文字
    d3.selectAll(`.scrollItemLeft${leftId}`).style({
      opacity: 0
    });
    // 流出-------------------------
    let shareTypeNum = [] // 存放有哪些共享，以让这些共享按钮高亮
    if (flowout && flowout.length) {
      const flowoutById = {}; // 将流出一个部门对应两个共享的线安排在一起，展示两者的共同数据
      flowout.map(t => {
        const shareType = t.shareType;
        const typeId = t[typeIdName];
        const accessStatus = t.accessStatus;
        d3.selectAll(`.rightPathDeptid${typeId}.rightPathSharetype${shareType}`)
          .attr({
            stroke: colorStatusStroke[accessStatus]
          });
        d3.selectAll(`.rightStatusCircleDptid${typeId}`)
          .attr({
            stroke: colorStatusStroke[accessStatus],
            fill: colorStatusFill[accessStatus]
          });
        d3.selectAll(`.textFlowout${typeId}`)
          .attr({
            fill: colorText2
          });
        // 将流出一个部门对应两个共享的线安排在一起，展示两者的共同数据
        const id = typeId;
        if (flowoutById[id]) {
          flowoutById[id].push(t);
        } else {
          flowoutById[id] = [t];
        }
      });
      // 流出线上字
      for (const key in flowoutById) {
        const item = flowoutById[key];
        if (item && item.length) {
          item.map(ttt => {
            shareTypeNum.push(ttt.shareType)
          })
          if (item.length > 1) {
            d3.selectAll(`.scrollItemRightAll${item[0][typeIdName]}`).style({
              opacity: 0
            });
          } else {
            d3.selectAll(`.scrollRight${shareTypeNum[0]}`)
              .selectAll(`.scrollItemRight${item[0][typeIdName]}`)
              .style({
                opacity: 0
              });
          }
        }
      }
    }
    // 分析按钮 来源分析/共享分析/数据分享/服务共享-------------------------
    if (leftAccessStatus && leftAccessStatus !== 3) {
      d3.selectAll(`.sourceText`)
        .attr({
          fill: colorText1
        })
    }
    shareTypeNum = [...new Set(shareTypeNum)]
    if (shareTypeNum && shareTypeNum.length) {
      d3.selectAll(`.shareText`)
        .attr({
          fill: colorText1
        })
      shareTypeNum.map(t => {
        d3.selectAll(`.shareBtnText${t}`)
          .attr({
            fill: colorMain10
          })
        d3.selectAll(`.sharePathBorder${t}`)
          .attr({
            stroke: colorMain10
          })
      })
    }
  }
  // 流出hover事件处理--------------------------------------------------------------------
  function triggerRightMouseover(flowout, isSingle) {
    let flowin
    // 流出--------------------------
    let {
      rightId,
      rightAccessStatus,
      shareType
    } = flowout; // leftAccessStatus可能没值
    let shareTypeNum = [] // 存放有哪些共享，以让这些共享按钮高亮
    d3.selectAll(`.textFlowout${rightId}`)
      .attr({
        fill: colorHighLight
      });
    if (isSingle) {
      d3.selectAll(`.rightPathDeptid${rightId}.rightPathSharetype${shareType}`)
        .attr({
          stroke: d => {
            if (!flowin) {
              flowin = d.flowIn
            }
            shareTypeNum.push(d.shareType)
            return rightAccessStatus === 3 ? 'none' : colorHighLight
          }
        })
      d3.selectAll(`.rightStatusCircleDptid${rightId}`)
        .attr({
          stroke: colorHighLight,
          fill: colorStatusFillHover[rightAccessStatus]
        })
      // 流出线上文字
      d3.selectAll(`.scrollRight${shareType}`)
        .selectAll(`.scrollItemRight${rightId}`)
        .style({
          opacity: 1
        });
    } else {
      d3.selectAll(`.rightStatusCircleDptid${rightId}`)
        .attr({
          stroke: colorHighLight,
          fill: d => {
            if (!flowin) {
              // 获取总的flowIn值
              const data = []
              d.map(t => {
                if (t.flowIn) {
                  data.push(...t.flowIn)
                }
                shareTypeNum.push(t.shareType)
              })
              const uniqueData = []
              data.map(t => {
                const item = uniqueData.find(tt => tt.deptId === t.deptId)
                if (!item) {
                  uniqueData.push(t)
                }
              })
              flowin = uniqueData
            }
            if (!rightAccessStatus) {
              rightAccessStatus = d[0].accessStatus
            }
            return colorStatusFillHover[rightAccessStatus]
          }
        })
      d3.selectAll(`.rightPathDeptid${rightId}`)
        .attr({
          stroke: rightAccessStatus === 3 ? 'none' : colorHighLight
        })
      // 流出线上文字
      d3.selectAll(`.scrollItemRightAll${rightId}`)
        .style({
          opacity: 1
        })
    }

    // 流入-------------------------
    if (flowin && flowin.length) {
      flowin.map(t => {
        const leftId = t.deptId
        const leftAccessStatus = t.accessStatus
        d3.selectAll(`.textDeptLeft${leftId}`).attr({
          fill: colorHighLight
        });
        d3.selectAll(`.leftStatusCircle${leftId}`).attr({
          stroke: colorHighLight,
          fill: colorStatusFillHover[leftAccessStatus]
        });
        d3.selectAll(`.leftPath${leftId}`).attr({
          stroke: leftAccessStatus === 3 ? 'none' : colorHighLight
        });
        // 流入线上文字
        d3.selectAll(`.scrollItemLeft${leftId}`).style({
          opacity: 1
        });
        // 分析按钮 来源分析
        if (leftAccessStatus && leftAccessStatus !== 3) {
          d3.selectAll(`.sourceText`)
            .attr({
              fill: colorHighLight
            })
        }
      })
    }
    // 分析按钮 共享分析/数据分享/服务共享-------------------------
    if (shareTypeNum && shareTypeNum.length) {
      d3.selectAll(`.shareText`)
        .attr({
          fill: colorHighLight
        })
      shareTypeNum.map(t => {
        d3.selectAll(`.shareBtnText${t}`)
          .attr({
            fill: colorHighLight
          })
        d3.selectAll(`.sharePathBorder${t}`)
          .attr({
            stroke: colorHighLight
          })
      })
    }
  }

  function triggerRightMouseout(flowout, isSingle) {
    let flowin
    // 流出--------------------------
    let {
      rightId,
      rightAccessStatus,
      shareType
    } = flowout; // leftAccessStatus可能没值
    let shareTypeNum = [] // 存放有哪些共享，以让这些共享按钮高亮
    d3.selectAll(`.textFlowout${rightId}`)
      .attr({
        fill: colorText2
      });
    if (isSingle) {
      d3.selectAll(`.rightPathDeptid${rightId}.rightPathSharetype${shareType}`)
        .attr({
          stroke: d => {
            if (!flowin) {
              flowin = d.flowIn
            }
            shareTypeNum.push(d.shareType)
            return colorStatusLine[rightAccessStatus]
          }
        })
      d3.selectAll(`.rightStatusCircleDptid${rightId}`)
        .attr({
          stroke: colorStatusStroke[rightAccessStatus],
          fill: colorStatusFill[rightAccessStatus]
        })
      // 流出线上文字
      d3.selectAll(`.scrollRight${shareType}`)
        .selectAll(`.scrollItemRight${rightId}`)
        .style({
          opacity: 0
        })
    } else {
      d3.selectAll(`.rightStatusCircleDptid${rightId}`)
        .attr({
          stroke: d => colorStatusStroke[d[0].accessStatus],
          fill: d => {
            if (!flowin) {
              // 获取总的flowIn值
              const data = []
              d.map(t => {
                if (t.flowIn) {
                  data.push(...t.flowIn)
                }
                shareTypeNum.push(t.shareType)
              })
              const uniqueData = []
              data.map(t => {
                const item = uniqueData.find(tt => tt.deptId === t.deptId)
                if (!item) {
                  uniqueData.push(t)
                }
              })
              flowin = uniqueData
            }
            if (!rightAccessStatus) {
              rightAccessStatus = d[0].accessStatus
            }
            return colorStatusFill[rightAccessStatus]
          }
        })
      d3.selectAll(`.rightPathDeptid${rightId}`)
        .attr({
          stroke: colorStatusLine[rightAccessStatus]
        })
      // 流出线上文字
      d3.selectAll(`.scrollItemRightAll${rightId}`)
        .style({
          opacity: 0
        })
    }
    // 流入-------------------------
    if (flowin && flowin.length) {
      flowin.map(t => {
        const leftId = t.deptId
        const leftAccessStatus = t.accessStatus
        d3.selectAll(`.textDeptLeft${leftId}`).attr({
          fill: colorText2
        });
        d3.selectAll(`.leftStatusCircle${leftId}`).attr({
          stroke: colorStatusStroke[leftAccessStatus],
          fill: colorStatusFill[leftAccessStatus]
        });
        d3.selectAll(`.leftPath${leftId}`).attr({
          stroke: colorStatusLine[leftAccessStatus]
        });
        // 流入线上文字
        d3.selectAll(`.scrollItemLeft${leftId}`).style({
          opacity: 0
        });
        // 分析按钮 来源分析
        if (leftAccessStatus && leftAccessStatus !== 3) {
          d3.selectAll(`.sourceText`)
            .attr({
              fill: colorText1
            })
        }
      })
    }
    // 分析按钮 共享分析/数据分享/服务共享-------------------------
    if (shareTypeNum && shareTypeNum.length) {
      d3.selectAll(`.shareText`)
        .attr({
          fill: colorText1
        })
      shareTypeNum.map(t => {
        d3.selectAll(`.shareBtnText${t}`)
          .attr({
            fill: colorMain10
          })
        d3.selectAll(`.sharePathBorder${t}`)
          .attr({
            stroke: colorMain10
          })
      })
    }

  }
  // 共享按钮hover事件
  function bindShareBtnEvent() {
    shareBtnItem
      .on('mouseover', e => {
        createTooltip(e.data)
        d3.selectAll(`.sharePathBorder${e.shareType}`)
          .attr({
            stroke: colorHighLight,
          })
        d3.selectAll(`.shareBtnText${e.shareType}`).attr({
          fill: colorHighLight
        });
        d3.selectAll(`.rightPathSharetype${e.shareType}`)
          .each(d => {
            const flowout = {
              rightId: d[typeIdName],
              rightAccessStatus: d.accessStatus,
              shareType: d.shareType
            };
            triggerRightMouseover(flowout, true);
          })
      })
      .on('mouseout', e => {
        removeTooltip()
        d3.selectAll(`.shareBtnText${e.shareType}`).attr({
          fill: colorMain10
        });
        d3.selectAll(`.sharePathBorder${e.shareType}`)
          .attr({
            stroke: colorMain10,
          })
        d3.selectAll(`.rightPathSharetype${e.shareType}`)
          .each(d => {
            const flowout = {
              rightId: d[typeIdName],
              rightAccessStatus: d.accessStatus,
              shareType: d.shareType
            };
            triggerRightMouseout(flowout, true);
          })
      })
    groupSourceBtn
      .on("mouseover", () => {
        createTooltip(sourceInfoTotal)
        d3.selectAll(".sourceText").attr({
          fill: colorHighLight
        });
      })
      .on("mouseout", () => {
        removeTooltip()
        d3.selectAll(".sourceText").attr({
          fill: colorText1
        });
      });
    groupShareBtn
      .on("mouseover", (e) => {
        d3.selectAll(".shareText").attr({
          fill: colorHighLight
        });
        createTooltip(shareInfoTotal)
      })
      .on("mouseout", () => {
        d3.selectAll(".shareText").attr({
          fill: colorText1
        });
        removeTooltip()
      });
  }

  // 渲染方法==================================================================================
  // 流入静态相关 ---------------------------------------------------------------------
  // 共享按钮
  function renderShareItemBtn() {
    // 共享按钮=============================================================
    // 按钮------------------------------------------------------------
    const shareBtnGroupItem = svg.append("g").attr({
      class: "shareBtnGroup"
    });
    const arcPath = d3.svg
      .arc()
      .innerRadius(385)
      .outerRadius(422);
    const arcPathText = d3.svg
      .arc()
      .innerRadius(403)
    shareBtnItem = shareBtnGroupItem
      .selectAll(".shareBtn")
      .data(shareInfo)
      .enter()
      .append("g")
      .attr({
        class: d => {
          return `shareBtnItem`
        },
        cursor: 'pointer',
        transform: `translate(${width / 2}, ${height / 2})`
      })
    shareBtnItem.append("path")
      .attr({
        class: d => `sharePathBorder${d.shareType}`,
        d: d => arcPath(d),
        stroke: colorMain10,
        fill: colorBorder,
        "stroke-width": 1
      });
    shareBtnItem.append("path").attr({
      id: d => `textpath${d.shareType}`,
      d: d => {
        const path = arcPathText(d)
        return 'M' + path.substring(5, path.length - 1)
      },
      stroke: 'none',
      fill: 'none',
      "stroke-width": 1
    });
    const shareText = shareBtnItem
      .append("text")
      .attr({
        class: d => `shareBtnText${d.shareType}`,
        fill: colorMain10,
        y: 40,
        'font-size': 20,
        "writing-mode": "vertical-lr",
      })
      .append('textPath')
      .attr({
        'xlink:href': d => `#textpath${d.shareType}`
      })
      .text(d => d.shareName)
  }
  // 流入按钮
  function renderFlowinBtnGroup() {
    // 流入左边按钮------------
    industryBtnLeftGroup = groupIndustryTrans.append("g").attr({
      class: "industryBtnLeftGroup"
    });
    // 流入右边按钮-------------
    industryBtnRightGroup = groupIndustryTrans.append("g").attr({
      class: "industryBtnRightGroup"
    });
    // 左边按钮
    industryBtnLeftGroup.append("polygon").attr({
      class: (d, i) => `industryBtnLeft${i} industryBtnLeft`,
      points: pointsIndustryBtn,
      fill: (d, i) => {
        if (d.currentPage === 1) {
          return colorMain2;
        } else {
          return colorMain4;
        }
      },
      cursor: d => (d.currentPage === 1 ? "arrow" : "pointer"),
      stroke: "none",
      transform: (d, i) => "translate(0," + (itemHeight + itemMargin) * i + ")"
    });
    // 左边三角形
    industryBtnLeftGroup.append("polygon").attr({
      class: (d, i) => `industryBtnTriangleLeft${i} industryBtnTriangleLeft`,
      points: pointsIndustryBtnTriangle,
      cursor: d => (d.currentPage === 1 ? "arrow" : "pointer"),
      fill: (d, i) => {
        if (d.currentPage === 1) {
          return colorMain4;
        } else {
          return colorMain10;
        }
      },
      transform: (d, i) => {
        return `translate(-0.5, ${(itemHeight + itemMargin) * i})`;
      }
    });
    // 流入右边按钮
    industryBtnRightGroup.append("polygon").attr({
      class: (d, i) => `industryBtnRight${i} industryBtnRight`,
      points: pointsIndustryBtn,
      fill: (d, i) => {
        if (d.currentPage === d.totalPage) {
          return colorMain2;
        } else {
          return colorMain4;
        }
      },
      stroke: "none",
      cursor: d => {
        return d.currentPage === d.totalPage ? "arrow" : "pointer"
      },
      transform: (d, i) =>
        `rotate(180, 72 ${164.44 +
          scalelenIndustryBtn / 2}) translate(-156 ,-${(itemHeight +
          itemMargin) *
          i})`
    });
    // 右边三角形
    industryBtnRightGroup.append("polygon").attr({
      class: (d, i) => `industryBtnTriangleRight${i} industryBtnTriangleRight`,
      points: pointsIndustryBtnTriangle,
      cursor: d => (d.currentPage === d.totalPage ? "arrow" : "pointer"),
      fill: (d, i) => {
        if (d.currentPage === d.totalPage) {
          return colorMain4;
        } else {
          return colorMain10;
        }
      },
      transform: (d, i) =>
        `rotate(180, 73.09 ${164.44 +
          scalelenIndustryBtn / 2}) translate(-154.5,-${(itemHeight +
          itemMargin) *
          i})`
    });
    bindLeftPageBtnEvent() // 绑定翻页按钮事件
  }
  // 流入部门文字渲染
  function renderGroupLeftDeptItem() {
    // 流入部门数据写入-----------------------
    groupLeftDeptItem = groupLeftDeptTextGroup
      .selectAll(".groupLeftDept")
      .data(d => {
        return d.depts.slice(
          (d.currentPage - 1) * deptItemNum,
          d.currentPage * deptItemNum
        );
      })
      .enter()
      .append("g")
      .attr({
        class: "groupLeftDept"
      });
    // 流入部门文字背景-----------------------
    groupLeftDeptItem.append("rect").attr({
      class: (d, i) => {
        return `textBg${d.deptId}`;
      },
      // fill: "yellow",
      // opacity: 0.2,
      fill: "transparent",
      y: (d, i) => d.itemTop + subItemHeight * i,
      x: 60,
      width: 120,
      height: d => subItemHeight,
      cursor: "pointer"
    });
    // 流入部门文字-----------------------
    groupLeftDeptItem
      .append("text")
      .attr({
        class: (d, i) => {
          return `textDeptLeft${d.deptId}`;
        },
        "font-size": 16,
        fill: "red",
        fill: colorText2,
        y: (d, i) => {
          return subItemHeight * (i + 0.75) + d.itemTop;
        },
        x: 120,
        "text-anchor": "middle",
        cursor: "pointer"
      })
      .text((d, i) => {
        return d.deptName;
      });
    groupLeftDeptItem.on('click', e => {
      const id = e.deptId
      const name = e.deptName
      window.location.href = `/s2?id=${id}&name=${name}`
    })
  }
  // 流出静态相关---------------------------------------------------------------------
  function renderFlowoutBtnGroup() {
    // 流出左边按钮------------
    groupBtnLeftGroup = groupFlowoutTrans.append("g").attr({
      class: "groupBtnLeftGroup"
    });
    // 流出右边按钮-------------
    groupBtnRightGroup = groupFlowoutTrans.append("g").attr({
      class: "groupBtnRightGroup"
    });
    // 左边按钮
    groupBtnLeftGroup.append("polygon").attr({
      class: (d, i) => `btnLeftFlowout${i} btnLeftFlowout`,
      points: pointsBtnFlowout,
      fill: (d, i) => {
        if (currentPageFlowout === 1) {
          return colorMain2;
        } else {
          return colorMain4;
        }
      },
      cursor: d => (currentPageFlowout === 1 ? "arrow" : "pointer"),
      stroke: "none"
    });
    // 左边三角形
    groupBtnLeftGroup.append("polygon").attr({
      class: (d, i) => `btnLeftTriangleFlowout${i} btnLeftTriangleFlowout`,
      points: pointsFlowoutBtnTriangle,
      cursor: d => (currentPageFlowout === 1 ? "arrow" : "pointer"),
      fill: (d, i) => {
        if (currentPageFlowout === 1) {
          return colorMain4;
        } else {
          return colorMain10;
        }
      }
    });
    // 流出右边按钮
    groupBtnRightGroup.append("polygon").attr({
      class: (d, i) => `btnRightFlowout${i} btnRightFlowout`,
      points: pointsBtnFlowout,
      fill: (d, i) => {
        if (currentPageFlowout === totalPageFlowout) {
          return colorMain2;
        } else {
          return colorMain4;
        }
      },
      stroke: "none",
      cursor: d =>
        currentPageFlowout === totalPageFlowout ? "arrow" : "pointer",
      transform: (d, i) =>
        `rotate(180, 72 ${164.44 + scalelenFlowoutBtn / 2}) translate(-156 ,0)`
    });
    // 流出右边三角形
    groupBtnRightGroup.append("polygon").attr({
      class: (d, i) => `btnRightTriangleFlowout${i} btnRightTriangleFlowout`,
      points: pointsFlowoutBtnTriangle,
      cursor: d =>
        currentPageFlowout === totalPageFlowout ? "arrow" : "pointer",
      fill: (d, i) => {
        if (currentPageFlowout === totalPageFlowout) {
          return colorMain4;
        } else {
          return colorMain10;
        }
      },
      transform: (d, i) =>
        `rotate(180, 73.09 ${164.44 +
          scalelenFlowoutBtn / 2}) translate(-154.5,0)`
    });
    bindRightPageBtnEvent()
  }

  function renderListFlowout() {
    groupRightListData
      .append("text")
      .attr({
        class: (d, i) => {
          const name = [];
          return `textFlowout textFlowout${d[typeIdName]}`;
        },
        y: currentFlowoutItemTop,
        "font-size": 16,
        fill: colorText2,
        dy: (d, i) => subItemHeight * (i + 0.8),
        x: 120,
        "text-anchor": "middle",
        cursor: "pointer"
      })
      .text((d, i) => {
        return d.deptName || d.appName;
      })
      .on('mouseover', e => {
        const flowout = {
          rightId: e[typeIdName]
        }
        triggerRightMouseover(flowout);

      })
      .on('mouseout', e => {
        const flowout = {
          rightId: e[typeIdName]
        };
        triggerRightMouseout(flowout);
      })

  }
  // 部门分布&应用分布---------------------------------------------------------------------
  function renderLayoutBtn() {
    btnTrigger = groupFlowout
      .selectAll(".btnTrigger")
      .data(btnTriggerData)
      .enter();
    renderBtnTrigger();
  }

  function renderBtnTrigger() {
    d3.selectAll(".btnTriggerGroup").remove();
    btnTriggerGroup = btnTrigger.append("g").attr({
      class: "btnTriggerGroup"
    });
    btnTriggerGroup.append("rect").attr({
      class: "typeRect",
      fill: (d, i) => (i === triggerType ? colorMain10 : "transparent"),
      "stroke-width": 1,
      stroke: (d, i) => (i === triggerType ? "transparent" : colorMain10),
      width: btnTriggerWidth,
      height: btnTriggerHeight,
      x: flowoutWidth - btnTriggerWidth - 2,
      y: height / 2 - (btnTriggerHeight * btnTriggerData.length) / 2,
      transform: (d, i) => `translate(0, ${(btnTriggerHeight + 5) * i})`,
      cursor: "pointer"
    });
    btnTriggerGroup
      .append("text")
      .attr({
        class: "typeText",
        fill: (d, i) => (i === triggerType ? colorText1 : colorText2),
        "font-size": 18, // fontSize不生效的
        "stroke-width": 20,
        "font-weight": "bolder",
        "text-anchor": "middle",
        "writing-mode": "vertical-lr", // d3文字竖排
        x: flowoutWidth - btnTriggerWidth / 2 - 1,
        y: (height - (btnTriggerHeight + 5) * btnTriggerData.length) / 2,
        textLength: 90, // d3文字间距 'word-spacing': 100, // 该方法文字间距不生效
        transform: (d, i) =>
          `translate(0, ${(btnTriggerHeight + 5) * (i + 0.5)})`,
        cursor: "pointer"
      })
      .text(d => d.name);
    bindLayoutBtnEvent()
  }

  // 流入状态圈和流入状态线渲染----------------------------------------------------------------------
  function renderFlowinStatus() {
    indexIndustry = 0;
    leftStatusPathGroup = {};
    d3.selectAll('.groupLeftStatusData').remove()
    const groupLeftStatusData = d3.selectAll('.flowinStatus')
      .append("g").attr({
        class: "groupLeftStatusData"
      });

    const groupLeftStatusDataItem = groupLeftStatusData
      .selectAll(".groupLeftStatusDataItem")
      .data(leftStatusData)
      .enter()
      .append("g")
      .attr({
        class: "groupLeftStatusDataItem"
      });
    // 流入部门状态圈---------------
    statusGroup = groupLeftStatusDataItem
      .selectAll("statusGroup")
      .data(d => {
        return d.depts.slice(
          (d.currentPage - 1) * deptItemNum,
          d.currentPage * deptItemNum
        );
      })
      .enter()
      .append("g")
      .attr({
        class: (d, i) => {
          return `statusGroup statusGroup${d.deptId}`;
        }
      });
    statusGroup
      .append("circle")
      .attr({
        class: d => `leftStatusCircle leftStatusCircle${d.deptId}`,
        cx: 225,
        cy: (d, i) => {
          return d.itemTop + 2 * 2 + 15.32 / 2 + subItemHeight * i;
        },
        r: 15.32 / 2,
        fill: d => {
          return colorStatusFill[d.accessStatus];
        },
        stroke: d => {
          return colorStatusStroke[d.accessStatus];
        },
        cursor: "pointer",
        "stroke-width": 2,
        transform: (d, i) => {
          if (i === 0) {
            indexIndustry++;
          }
          return `translate(0, ${(itemHeight + itemMargin) *
            (indexIndustry - 1)})`;
        }
      })
      .each(d => {
        const path = getStatusPath(d.deptId);
        leftStatusPathGroup[d.deptId] = path;
      });
    // 渲染流入线
    statusGroup.append("path").attr({
      class: (d, i) => {
        return `leftPath leftPath${d.deptId}`;
      },
      d: d => leftStatusPathGroup[d.deptId],
      stroke: (d, i) => colorStatusLine[d.accessStatus],
      fill: "none",
      "stroke-width": 2,
      cursor: d => {
        return d.accessStatus === 3 ? "" : "pointer";
      },
      transform: `scale(${1 / options.scales}) translate(${-leftScale}, ${-topScale})`
    });
    // 渲染流入线上文字
    d3.selectAll('.textScrollBlockLeft').remove()
    statusGroup
      .append("g")
      .call(d => {
        d.each((t, i) => {
          const id = t.deptId
          const path = leftStatusPathGroup[id]
          const indexL = path.indexOf('L')
          const position = path.substring(1, indexL).split(',')
          const x = (position[0] - leftScale) / options.scales + 10 * options.scales - 0
          const y = (position[1] - topScale) / options.scales - 4 * options.scales - 0
          const group =
            d3.select('svg')
            .append('g')
            .attr({
              class: 'scrollLeft'
            })
          svg.append('defs')
            .append('clipPath')
            .attr({
              id: `se-transition${id}`,
            })
            .append('rect')
            .attr({
              x: x,
              y: y - 17,
              width: 160 / options.scales,
              class: `rectText${id}`,
              height: 20,
              fill: 'red'
            })
          let len
          const groupTextDom = group
            .append('g')
            .attr({
              'clip-path': `url(#se-transition${id})`
            })

          const TextDom1 = groupTextDom.append('text')
            .attr({
              class: `scrollItem scrollItemLeft scrollItemLeft${id}`,
              dx: 0,
              // dx: -x * 0.5,
              dy: 0,
              'font-size': 14,
              // fill: 'red',
              fill: colorHighLight,
            })
            .style({
              opacity: 0
            })
            .text(() => {
              if (!t.data) {
                return
              }
              let textData = []
              t.data.map((tt, ii) => {
                textData.push(`${tt.value}${tt.unit}${tt.name}`)
              })
              len = countnums(textData.join('/'))
              return textData.join('/')
            })
          if (len) {
            if (len * 8 > (160 / options.scales)) {
              const TextDom2 = groupTextDom.append('text')
                .attr({
                  class: `scrollItem scrollItemLeft scrollItemLeft${id}`,
                  dy: -20,
                  dx: 0,
                  // dx: 0.5 * x,
                  'font-size': 14,
                  fill: colorHighLight,
                })
                .style({
                  opacity: 0
                })
                .text(() => {
                  if (!t.data) {
                    return
                  }
                  let textData = []
                  t.data.map((tt, ii) => {
                    textData.push(`${tt.value}${tt.unit}${tt.name}`)
                  })
                  len = countnums(textData.join('/'))
                  return textData.join('/')
                })
              const transformPath1 = `M${x - 0 + 180},${y}L${x - len * 8},${y}L${x - len * 8},${y - 20}L${x - 0 + 180},${y - 20}L${x - 0 + 180},${y}Z`
              // const transformPath1 = `M${x - 0 + 180},${y}L${1.5 * x - len * 8},${y}L${1.5 * x - len * 8},${y - 20}L${1.5 * x - 0 + 180},${y - 20}L${1.5 * x - 0 + 180},${y}Z`
              // const transformPath2 = `M${x - len * 8},${y}L${x - len * 8},${y}L${x + 180},${y}L${x - 180}, ${y + 20}L${x - 180}, ${y + 20}L${x - len * 8}, ${y + 20}Z`
              // const transformPath2 = `M${x - len * 8},${y}L${x - len * 8},${y}L${0.5 * x},${y}L${0.5 * x }, ${y + 20}L${0.5 * x}, ${y + 20}L${x - len * 8}, ${y + 20}Z`
              // const transformPath2 = `M${x - len * 8},${y}L${x - len * 8},${y}L${0.5 * x + 180},${y}L${0.5 * x + 180}, ${y + 20}L${0.5 * x + 180}, ${y + 20}L${x - len * 8}, ${y + 20}Z`
              const transformPath2 = `M${x - len * 8},${y + 20}L${x - len * 8},${y}L${x + 180}, ${y}L${x + 180}, ${y + 20}Z`
              TextDom1
                .append('animateMotion')
                .attr({
                  attributeName: 'transform',
                  path: transformPath1,
                  dur: `${0.3 * len}s`,
                  rotate: '180deg',
                  repeatCount: 'indefinite',
                });
              TextDom2
                .append('animateMotion')
                .attr({
                  attributeName: 'transform',
                  path: transformPath2,
                  dur: `${0.3 * len}s`,
                  repeatCount: 'indefinite',
                });
            } else {
              TextDom1
                .attr({
                  dx: x,
                  dy: y
                });
            }
          }
        })
      })

    bindLeftStatusHoverEvent()
  }

  // 流出状态相关----------------------------------------------------------------------
  function renderFlowoutStatus() {
    d3.selectAll('.groupRightStatusData').remove()
    const groupRightStatusData = d3
      .select('.flowout')
      .append("g").attr({
        class: "groupRightStatusData"
      });
    const groupRightStatusDataItem = groupRightStatusData
      .selectAll(".groupRightStatusDataItem")
      .data(RightStatusDataByDeptsAppsArr.slice((currentPageFlowout - 1) * rightItemNum, currentPageFlowout * rightItemNum))
      .enter()
      .append("g")
      .attr({
        class: `groupRightStatusDataItem`
      });
    // 流出状态圈--------------------------------------------------------------------
    rightStatusPathGroup = [];
    const circleRight = groupRightStatusDataItem
      .append("circle")
      .attr({
        class: d => {
          return `rightStatusCircle rightStatusCircleDptid${d[0][typeIdName]}`
        },
        cx: 13,
        cy: (d, i) => {
          return currentFlowoutItemTop + subItemHeight * i + 15.32 / 2 + 2 * 2;
        },
        r: 15.32 / 2,
        fill: d => {
          return colorStatusFill[d[0].accessStatus];
        },
        stroke: d => {
          return colorStatusStroke[d[0].accessStatus];
        },
        cursor: "pointer",
        "stroke-width": 2,
        transform: `translate(${width - flowoutWidth}, 0)`
      })
      .each(d => {
        getRightStatusPath(d[0][typeIdName])
      })
    circleRight
      .on('mouseover', e => {
        const flowout = {
          rightId: e[0][typeIdName],
          rightAccessStatus: e[0].accessStatus
        }
        triggerRightMouseover(flowout)
      })
      .on('mouseout', e => {
        const flowout = {
          rightId: e[0][typeIdName],
          rightAccessStatus: e[0].accessStatus
        }
        triggerRightMouseout(flowout)
      })
    // 流出线
    const groupPathRight = groupRightStatusData
      .selectAll(".path")
      .data(rightStatusPathGroup)
      .enter()
      .append("path")
      .attr({
        class: (d, i) =>
          `rightPath rightPathDeptid${d[typeIdName]} rightPathSharetype${
            d.shareType
          }`,
        d: d => {
          return d.path;
        },
        fill: "none",
        stroke: d => {
          return colorStatusLine[d.accessStatus];
        },
        cursor: "pointer",
        "stroke-width": 2,
        transform: `scale(${1 / options.scales}) translate(${-leftScale}, ${-topScale})`
      })
      .on("mouseover", e => {
        const flowout = {
          rightId: e[typeIdName],
          rightAccessStatus: e.accessStatus,
          shareType: e.shareType
        };
        triggerRightMouseover(flowout, true);
      })
      .on("mouseout", e => {
        const flowout = {
          rightId: e[typeIdName],
          rightAccessStatus: e.accessStatus,
          shareType: e.shareType
        };
        triggerRightMouseout(flowout, true);
      });
    // 渲染流出线上文字 单条线，只有服务共享或者数据共享------------------------------------------
    d3.selectAll(`.scrollRight`).remove()
    shareInfo.map(t => {
      // if (t.shareType === 'data') {
      //   return
      // }
      d3.select('svg')
        .append('g')
        .attr({
          class: `scrollRight scrollRight${t.shareType}`
        })
    })
    rightStatusPathGroup.map(t => {
      const path = t.path
      const indexL = path.indexOf('L')
      const position = path.substring(1, indexL).split(',')
      // const x = (position[0] - 160) * options.scales - leftScale
      // const y = (position[1] - 26) * options.scales - topScale
      const x = (position[0] - leftScale) / options.scales - 170 / options.scales
      const y = (position[1] - topScale) / options.scales - 2 * options.scales
      // const x = (position[0] - leftScale) / options.scales + 160 * options.scales
      // const y = (position[1] - topScale) / options.scales - 26 * options.scales
      // const x = (position[0] - leftScale) / options.scales - 160 * options.scales
      // const y = (position[1] - topScale) / options.scales - 26 * options.scales
      const shareType = t.shareType
      const id = t[typeIdName]
      // if (shareType === 'data') {
      //   return
      // }
      const group = d3.selectAll(`.scrollRight${shareType}`)
      group.append('defs')
        .append('clipPath')
        .attr({
          id: `se-transitionRight${shareType}${id}`,
        })
        .append('rect')
        .attr({
          x: x,
          y: y - 16,
          width: 170 / options.scales,
          class: `rectTextRight${shareType}${id}`,
          height: 20,
          fill: 'red'
        })
      let len
      const groupTextDom = group
        .append('g')
        .attr({
          'clip-path': `url(#se-transitionRight${shareType}${id})`
        })
      const TextDom1 = groupTextDom.append('text')
        .attr({
          class: `scrollItem scrollItemRight scrollItemRight${id}`,
          dx: 0,
          // dx: -x * 0.5,
          dy: 0,
          'font-size': 14,
          // fill: 'red',
          fill: colorHighLight,
        })
        .style({
          opacity: 0
        })
        .text(() => {
          if (!t.data) {
            return
          }
          let textData = []
          t.data.map((tt, ii) => {
            textData.push(`${tt.value}${tt.unit}${tt.name}`)
          })
          len = countnums(textData.join('/'))
          textData = textData.join('/')
          return textData
        })
      if (len) {
        if (len * 8 > (170 / options.scales)) {
          const TextDom2 = groupTextDom.append('text')
            .attr({
              class: `scrollItem scrollItemRight scrollItemRight${id}`,
              dx: 0,
              // dx: -x * 0.5,
              dy: -20,
              'font-size': 14,
              // fill: 'red',
              fill: colorHighLight,
            })
            .style({
              opacity: 0
            })
            .text(() => {
              if (!t.data) {
                return
              }
              let textData = []
              t.data.map((tt, ii) => {
                textData.push(`${tt.value}${tt.unit}${tt.name}`)
              })
              len = countnums(textData.join('/'))
              textData = textData.join('/')
              return textData
            })
          const transformPath1 = `M${x + 180 / options.scales},${y}L${x - len * 8},${y}L${x - len * 8},${y - 20}L${x + 180 / options.scales},${y - 20}L${x + 180 / options.scales},${y}Z`
          const transformPath2 = `M${x - len * 8},${y + 20}L${x - len * 8},${y}L${x + 180 / options.scales}, ${y}L${x + 180 / options.scales}, ${y + 20}Z`
          TextDom1
            .append('animateMotion')
            .attr({
              attributeName: 'transform',
              path: transformPath1,
              dur: `${0.3 * len}s`,
              rotate: '180deg',
              repeatCount: 'indefinite',
            });
          TextDom2
            .append('animateMotion')
            .attr({
              attributeName: 'transform',
              path: transformPath2,
              dur: `${0.3 * len}s`,
              repeatCount: 'indefinite',
            });
        } else {
          TextDom1
            .attr({
              dx: x,
              // dx: -x * 0.5,
              dy: y,
            });
        }
      }
    })
    // 渲染流出线上文字 按照部门合并------------------------------------------
    d3.selectAll(`.scrollRightAll`).remove()
    renderFlowoutPathTextAll()

    function renderFlowoutPathTextAll() {
      RightStatusDataByDeptsAppsArr.map(t => {
        const pathData = rightStatusPathGroup.find(tt => tt[typeIdName] === t[0][typeIdName])
        if (pathData) {
          const path = pathData.path
          const position = path.substring(1, path.indexOf('L')).split(',')
          // const x = (position[0] - leftScale) / options.scales - 160 * options.scales
          // const y = (position[1] - topScale) / options.scales - 26 * options.scales
          const x = (position[0] - leftScale) / options.scales - 170 / options.scales
          const y = (position[1] - topScale) / options.scales - 2 * options.scales
          // const x = (position[0] - leftScale) / options.scales - 160 * options.scales
          // const y = (position[1] - topScale) / options.scales - 26 * options.scales
          const id = t[0][typeIdName]
          const group =
            d3.select('svg')
            .append('g')
            .attr({
              class: `scrollRight scrollRightAll`
            })
          svg.append('defs')
            .append('clipPath')
            .attr({
              id: `se-transitionRightAll${id}`,
            })
            .append('rect')
            .attr({
              x: x,
              y: y - 16,
              width: 170 / options.scales,
              class: `rectTextRightAll${id}`,
              height: 20,
              fill: 'red'
            })
          let len
          const groupTextDom = group
            .append('g')
            .attr({
              'clip-path': `url(#se-transitionRightAll${id})`
            })
          const TextDom1 = groupTextDom.append('text')
            .attr({
              class: `scrollItem scrollItemRightAll scrollItemRightAll${id}`,
              dx: 0,
              // dx: -x * 0.5,
              dy: 0,
              'font-size': 14,
              // fill: 'red',
              fill: colorHighLight,
            })
            .style({
              opacity: 0
            })
            .text(() => {
              if (!t || !t.length) {
                return
              }
              let textData
              const data = []
              t.map(tt => {
                tt.data && tt.data.length && tt.data.map(ttt => {
                  data.push(`${ttt.value}${ttt.unit}${ttt.name}`)
                })
              })
              textData = data.join('/')
              len = countnums(textData)
              return textData
            })
          if (len) {
            if (len * 8 > (170 / options.scales)) {
              const TextDom2 = groupTextDom.append('text')
                .attr({
                  class: `scrollItem scrollItemRightAll scrollItemRightAll${id}`,
                  dx: 0,
                  // dx: -x * 0.5,
                  dy: -20,
                  'font-size': 14,
                  fill: colorHighLight,
                })
                .style({
                  opacity: 0
                })
                .text(() => {
                  if (!t || !t.length) {
                    return
                  }
                  let textData
                  const data = []
                  t.map(tt => {
                    tt.data && tt.data.length && tt.data.map(ttt => {
                      data.push(`${ttt.value}${ttt.unit}${ttt.name}`)
                    })
                  })
                  textData = data.join('/')
                  len = countnums(textData)
                  return textData
                })
              const transformPath1 = `M${x+ 180 / options.scales},${y}L${x - len * 8},${y}L${x - len * 8},${y - 20}L${x + 180 / options.scales},${y - 20}L${x + 180 / options.scales},${y}Z`
              const transformPath2 = `M${x - len * 8},${y + 20}L${x - len * 8},${y}L${x + 180 / options.scales}, ${y}L${x + 180 / options.scales}, ${y + 20}Z`
              TextDom1
                .append('animateMotion')
                .attr({
                  attributeName: 'transform',
                  path: transformPath1,
                  dur: `${0.3 * len}s`,
                  rotate: '180deg',
                  repeatCount: 'indefinite',
                });
              TextDom2
                .append('animateMotion')
                .attr({
                  attributeName: 'transform',
                  path: transformPath2,
                  dur: `${0.3 * len}s`,
                  repeatCount: 'indefinite',
                });
            } else {
              TextDom1
                .attr({
                  dx: x,
                  dy: y,
                });
            }
          }
        }
      })

    }
  }
  // 几个大按钮----------------------------------------------------------------------
  // 来源分析按钮
  function renderSourceBtn() {
    groupSourceBtn = svg.append("g")
      .attr({
        class: "groupd",
        cursor: "pointer"
      });
    groupSourceBtn.append("path").attr({
      class: "sourceAnalyzeBtn",
      d: pathAnalyzeBtn,
      fill: "url('#linearGradientBtn')",
      transform: `translate(-28, -95)`
    });
    groupSourceBtn
      .append("text")
      .attr({
        class: "sourceText",
        fill: colorText1,
        "font-size": 32, // fontSize不生效的
        "stroke-width": 20,
        "font-weight": "bolder",
        "text-anchor": "middle",
        "writing-mode": "vertical-lr", // d3文字竖排
        dx: 605,
        dy: 475,
        textLength: 170 // d3文字间距 'word-spacing': 100, // 该方法文字间距不生效
      })
      .text("来源分析");
    groupSourceBtn
      .on('click', e => {
        location.href = '/s1'
      })
  }
  // 共享分析按钮----------------
  function renderShareBtn() {
    groupShareBtn = svg.append("g")
      .attr({
        cursor: "pointer"
      });
    groupShareBtn.append("path").attr({
      class: "shareAnalyzeBtn",
      d: pathAnalyzeBtn,
      fill: "url('#linearGradientBtn')",
      transform: `rotate(180, ${width / 2 + 13} ${height / 2 + 48})`
    });
    groupShareBtn
      .append("text")
      .attr({
        class: "shareText",
        fill: colorText1,
        "font-size": 32, // fontSize不生效的
        "stroke-width": 20,
        "font-weight": "bolder",
        "text-anchor": "middle",
        "writing-mode": "vertical-lr", // d3文字竖排
        dx: 335 + width / 2,
        dy: 475,
        textLength: 170 // d3文字间距 'word-spacing': 100, // 该方法文字间距不生效
      })
      .text("共享分析");
  }

  // 通用方法==================================================================================
  function changeFlowoutBtnGroup() {
    d3.selectAll(`.groupBtnLeftGroup`).remove();
    d3.selectAll(`.groupBtnRightGroup`).remove();
    renderFlowoutBtnGroup();
  }

  function changeListFlowout() {
    d3.selectAll(`.textFlowout`).remove();
    renderListFlowout();
  }
  // 处理左边产业和部门静态数据
  function handleLeftDepts() {
    leftDepts.map((t, i) => {
      t.currentPage = t.currentPage || 1;
      t.totalPage = t.totalPage || Math.ceil(t.depts.length / deptItemNum);
      t.depts.map(tt => {
        tt.itemTop = (itemHeight - subItemHeight * deptItemNum) / 2;
      });
    });
  }
  // 流入切换分布按钮后重设当前页面 静态页面
  function getCurrentRightStatic() {
    rightList = [rightDepts, rightApps][triggerType];
    totalPageFlowout = [rightDeptTotalPage, rightAppTotalPage][triggerType];
    RightStatusData = [rightStatusDepts, rightStatusApps][triggerType];
    currentPageFlowout = [rightDeptCurrentPage, rightAppCurrentPage][
      triggerType
    ];
    RightStatusDataByDeptsAppsObject = {} // 用对象会改变顺序
    RightStatusDataByDeptsAppsArr = []
    typeIdName = ['deptId', 'appId'][triggerType]
    typeName = ["depts", "apps"][triggerType];
    idArr = []
    itemTopFlowout = (height - currentFlowoutItemNum * subItemHeight) / 2;
  }
  // 流入切换分布按钮后重设当前页面 动态页面
  function getCurrentRightStatus() {
    RightStatusData.map(t => {
      if (RightStatusDataByDeptsAppsObject[t[typeIdName]]) {
        RightStatusDataByDeptsAppsObject[t[typeIdName]].push(t);
      } else {
        RightStatusDataByDeptsAppsObject[t[typeIdName]] = [t];
        idArr.push(t[typeIdName])
      }
    })
    // 以上对象会改变顺序，得到arr的时候恢复顺序
    idArr.map(t => {
      RightStatusDataByDeptsAppsArr.push(RightStatusDataByDeptsAppsObject[t])
    })
    currentRightStatusDataByDeptsAppsArr = RightStatusData.slice(
      (currentPageFlowout - 1) * rightItemNum,
      currentPageFlowout * rightItemNum
    );
    currentFlowoutItemNum = currentRightStatusDataByDeptsAppsArr.length;

  }
  // 流出处理数据
  function getRightListData() {
    const data = rightList.slice(
      (currentPageFlowout - 1) * rightItemNum,
      currentPageFlowout * rightItemNum
    );
    currentFlowoutItemTop = (height - data.length * subItemHeight) / 2;
    groupRightListData = groupFlowout
      .append("g")
      .attr({
        class: "groupRightListData"
      })
      .selectAll(".groupRightListDataItem")
      .data(data)
      .enter()
      .append("g")
      .attr({
        class: "groupRightListDataItem"
      });
  }
  // 流入状态相关----------------------------------------------------------------------
  function handleLeftStatus() {
    leftStatusData.map((t, i) => {
      t.currentPage = t.currentPage || 1;
      t.totalPage = t.totalPage || Math.ceil(t.depts.length / deptItemNum);
      t.depts.map(tt => {
        tt.itemTop = (itemHeight - subItemHeight * deptItemNum) / 2;
      });
    });
  }
  // 生成左边连接线
  function getStatusPath(id) {
    const dom = [...document.querySelectorAll(`.leftStatusCircle${id}`)][0];
    const x = dom.getBoundingClientRect().x - 16 * options.scales;
    const y = dom.getBoundingClientRect().y - 93 * options.scales;
    const target = {
      y: 630 * options.scales + leftScale,
      x: 482 * options.scales + topScale
    };
    const item = `M${x},${y}L${x + 130},${y}${diagonal({
      source: {
        x: y,
        y: x + 170
      },
      target
    }).replace("M", "L")}`;
    return item;
  }
  // 生成右边连线
  function getRightStatusPath(id) {
    const dom = [
      ...document.querySelectorAll(`.rightStatusCircleDptid${id}`)
    ][0];
    const x = dom.getBoundingClientRect().x - 30 * options.scales;
    const y = dom.getBoundingClientRect().y - 93 * options.scales;
    let item;
    RightStatusDataByDeptsAppsObject[id].map((t, i) => {
      const shareInfoTarget = shareInfo.find((d) => d.shareType === t.shareType)
      if (shareInfoTarget) {
        const target = shareInfoTarget.target;
        item = `M${x},${y + i}L${x - 130},${y + i}${diagonal({
          source: {
            x: y + i,
            y: x - 160
          },
          target
        }).replace("M", "L")}`;
        rightStatusPathGroup.push({
          ...t,
          path: item
        });
      }
    })
    return item;
  }
  // tooltip-------------------------------------------------------------------
  function createTooltip(analyzeData) { // data为展示内容数组
    d3.selectAll('.tooltip')
      .selectAll(".leftText")
      .selectAll(".analyzeItem")
      .data(analyzeData)
      .enter()
      .append("div")
      .attr({
        class: "analyzeItem"
      })
      .text(d => d.name);
    d3.selectAll('.tooltip')
      .selectAll(".rightText")
      .selectAll(".analyzeItem")
      .data(analyzeData)
      .enter()
      .append("div")
      .attr({
        class: "analyzeItem"
      })
      .text(d => d.value + d.unit);
    d3.selectAll(".tooltip").style({
      left: d3.event.offsetX + "px",
      top: d3.event.offsetY + "px",
      opacity: 1,
      transform: "translate(-50%, -110%)"
    });
  }

  function removeTooltip() {
    d3.selectAll('.analyzeItem').remove()
    d3.selectAll(".tooltip").style({
      left: height / 2 + "px",
      top: 0 + "px",
      opacity: 0
    });
  }

  function handleLeftDeptsItem(industryId, type) {
    // 部门名字列表
    const index = leftDepts.findIndex(t => t.industryId === industryId);
    const data = leftDepts[index]; // 部门名字数据
    // 状态列表
    const indexStatus = leftStatusData.findIndex(t => t.industryId === industryId);
    const dataStatus = leftStatusData[indexStatus];
    let currentPage = data.currentPage;
    if (type === "add") {
      currentPage = data.currentPage + 1;
    } else if (type === "subtract") {
      currentPage = data.currentPage - 1;
    }
    data.currentPage = currentPage;
    dataStatus.currentPage = currentPage
    data.depts.map(tt => {
      tt.itemTop = (itemHeight - subItemHeight * deptItemNum) / 2;
    });
  }

  function handleFlowoutBtn(type) {
    if (type === "add") {
      if (triggerType === 0) {
        rightDeptCurrentPage++;
      } else if (triggerType === 1) {
        rightAppCurrentPage++;
      }
    } else if (type === "subtract") {
      if (triggerType === 0) {
        rightDeptCurrentPage--;
      } else if (triggerType === 1) {
        rightAppCurrentPage--;
      }
    }
    currentPageFlowout = [rightDeptCurrentPage, rightAppCurrentPage][
      triggerType
    ];
  }

}

export default render;
