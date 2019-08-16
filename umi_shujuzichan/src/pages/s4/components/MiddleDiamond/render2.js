import * as THREE from 'three';
import GLTFLoader from 'three/examples/js/loaders/GLTFLoader';
// import OBJLoader from 'three/examples/js/loaders/OBJLoader';
import Orbitcontrols from 'three-orbitcontrols';
import TWEEN from '@tweenjs/tween.js';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three-css2drender'; // 可将div元素放入three中
import {
  lineVertexShader,
  // lineFragmentShader,
  sphereVertexShader,
  sphereFragmentShader,
  ringLightFragmentShader,
  bodyVertexShader, // 主体着色器
  bodyFragmentShader,
  circleVertexShader, // 上方圆形顶点着色器
  flowLineVertexShader, // 管线流动
  flowLineFragmentShader,
  // bloomVertexShader,
  // bloomFragmentShader,
} from './shader';
import zuanshi from './zuanshi2.gltf';
// console.log(new GLTFLoader());

// import zuanshi from './zuanshi.obj';

let scene;
let camera;
let webGLRenderer;
let canvas;
let group;
let bottomSphereG; // 底部大圆集合
let zuanShiG; // 主体及上部圆集合
let chiLun; // 齿轮几何
let orbitControls;
let css2DRenderer;
let clock;
let render1 = null; // 渲染函数
let ringLightCircle; // 大圈环绕光
let bigCircleGeo; // 大圆环
const bottomCs = []; // 底部交互球
let circleShowRingMesh1; // 小球双环
let circleShowRingMesh2;
const textDivs = []; // 弹框
let topCircleGeo; // 小球（上）圆坐标
let zuanShiRotate = true;
let smallTopSpheres; // 上方球体集合
let zuanShiArr = [];
let highShow; // 点击闪光动画
let highUnShow;
let uniforms; // 管线uniform
let FlowLineUniforms; // 流动管线uniforms
let moveStatusBool = false;

export default function zuanShiRender(
  id,
  data1,
  data2,
  option,
  // screenSize = 1,
  leftTop,
  getShowIndex,
  getMoveStatus,
  updateThree,
  initthree = true,
) {
  const {
    width,
    height,
  } = option || {};
  let initThree = initthree; // three初始化渲染开关
  function clearThree(obj) {
    while (obj.children && obj.children.length > 0) {
      clearThree(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
    if (obj.texture) obj.texture.dispose();
  }
  // 创建场景
  function getThree() {
    scene = new THREE.Scene();

    canvas = document.getElementById('zuanshi');
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    camera.position.set(0, 3, 13);

    webGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
    webGLRenderer.setClearColor(0xffffff, 1.0);
    webGLRenderer.setClearAlpha(0.0);
    webGLRenderer.setSize(width, height);
    // webGLRenderer.toneMappingExposure = 2 ** 1;

    group = new THREE.Group();
    group.name = 'g1';
    scene.add(group);
    bottomSphereG = new THREE.Group();
    bottomSphereG.name = 'bottomSphereG';
    scene.add(bottomSphereG);
    zuanShiG = new THREE.Group();
    scene.add(zuanShiG);
    chiLun = new THREE.Group();
    scene.add(chiLun);

    // CSS2DRenderer渲染
    css2DRenderer = new CSS2DRenderer();
    css2DRenderer.setSize(width, height);
    // css2DRenderer.domElement.style.position = 'absolute';
    // css2DRenderer.domElement.style.zIndex = 99;
    // css2DRenderer.domElement.style.top = 0;
    /*
    *******************轨道控制器*********************
    */
    // 定义控制器
    orbitControls = new Orbitcontrols(camera);
    // 右键是否移动
    orbitControls.enablePan = false;
    // 是否可旋转，旋转速度
    orbitControls.enableRotate = true;
    orbitControls.rotateSpeed = 0.25;
    // 是否可以缩放
    orbitControls.enableZoom = false;
    // 使动画循环使用时阻尼或自转,意思是否有惯性
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.2;
    clock = new THREE.Clock();

    // const axesHelper = new THREE.AxesHelper(3);
    // scene.add(axesHelper);
  }
  // 灯光
  function getLight() {
    const spotLight1 = new THREE.SpotLight({
      color: 0xffffff,
      intensity: 2, // 光线强度
    });
    spotLight1.position.set(20, 120, 0);
    // spotLight.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = spotLight1.clone();
    spotLight2.intensity = 0.2;
    spotLight2.position.set(-20, 120, 0);
    scene.add(spotLight2);

    const spotLight3 = spotLight1.clone();
    spotLight3.intensity = 0.2;
    spotLight3.position.set(-50, -50, 120);
    scene.add(spotLight3);
    // 环境光
    const HemisphereLight = new THREE.HemisphereLight(0x000000, 0x89E1FF, 1);
    scene.add(HemisphereLight);
  }
  // ——————————————大环——————————————
  // 环绕光uniform
  const bigCUniforms = {
    time: {
      type: 'f',
      value: 0.0,
    },
  };
  function getBigCircle() {
    bigCircleGeo = new THREE.CircleGeometry(3.5, 64);
    bigCircleGeo.vertices.shift();
    const bigCircleMesh = new THREE.LineLoop(bigCircleGeo, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    bigCircleMesh.rotation.x = -Math.PI / 2;
    bigCircleMesh.position.y = -2;
    group.add(bigCircleMesh);
    // 环绕光
    const ringLightCircleGeo = new THREE.TorusBufferGeometry(3.5, 0.03, 30, 35, 0.2 * Math.PI);
    const ringLightCircleMat = new THREE.ShaderMaterial({
      uniforms: bigCUniforms,
      vertexShader: lineVertexShader,
      fragmentShader: ringLightFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
    ringLightCircle = new THREE.Mesh(ringLightCircleGeo, ringLightCircleMat);
    ringLightCircle.rotation.x = -Math.PI / 2;
    ringLightCircle.position.y = -2;
    group.add(ringLightCircle);

    // 绘制上部小球所需的圆坐标
    topCircleGeo = new THREE.CircleGeometry(2.04, 64);
    topCircleGeo.vertices.shift();
    // const topCircleMesh = new THREE.LineLoop(topCircleGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    // topCircleMesh.rotation.x = -Math.PI / 2;
    // topCircleMesh.position.y = 2.36;
    // group.add(topCircleMesh)
  }

  // ————————————————————————钻石——————————————————————————
  // 钻石渲染
  function getZuanShi() {
    uniforms = {
      time: {
        type: 'f',
        value: 0.0,
      },
    };
    // 主体uniforms
    const bodyUniforms = {
      // 表面基底色
      bodyColor: {
        type: 'c',
        value: new THREE.Color(0x152A65),
      },
      // 光线颜色
      lightColor: {
        type: 'c',
        value: new THREE.Color(0xffffff),
      },
      // 归一化光线向量
      lightDirection: {
        type: 'v3',
        value: new THREE.Vector3(0, 0, -500).normalize(),
      },
      lightDirection2: {
        type: 'v3',
        value: new THREE.Vector3(0, 0, 500).normalize(),
      },
      lightDirection3: {
        type: 'v3',
        value: new THREE.Vector3(1500, 500, 500).normalize(),
      },
      lightDirection4: {
        type: 'v3',
        value: new THREE.Vector3(-1500, -500, 500).normalize(),
      },
      // 高亮
      highC: {
        type: 'f',
        value: 0.0,
      },
    };
    // 上方圆模型uniforms
    const circleUniforms = {
      // 表面基底色
      bodyColor: {
        type: 'c',
        value: new THREE.Color(0x152A65),
      },
      // 光线颜色
      lightColor: {
        type: 'c',
        value: new THREE.Color(0xffffff),
      },
      // 归一化光线向量
      lightDirection: {
        type: 'v3',
        value: new THREE.Vector3(0, 0, -500).normalize(),
      },
      lightDirection2: {
        type: 'v3',
        value: new THREE.Vector3(0, 0, 500).normalize(),
      },
      lightDirection3: {
        type: 'v3',
        value: new THREE.Vector3(1500, 500, 500).normalize(),
      },
      lightDirection4: {
        type: 'v3',
        value: new THREE.Vector3(-1500, -500, 500).normalize(),
      },
      // 高亮
      highC: {
        type: 'f',
        value: 0.0,
      },
    };
    // 点击高亮动画
    highShow = new TWEEN.Tween(bodyUniforms.highC)
      .to({ value: 0.6 }, 250).onUpdate((d) => {
        bodyUniforms.highC.value = d.value;
        circleUniforms.highC.value = d.value;
      });
    highUnShow = new TWEEN.Tween(bodyUniforms.highC)
      .to({ value: 0.0 }, 250).onUpdate((d) => {
        bodyUniforms.highC.value = d.value;
        circleUniforms.highC.value = d.value;
      });
    highShow.chain(highUnShow);
    // 钻石主体材质
    const zuanshiShader = new THREE.ShaderMaterial({
      uniforms: bodyUniforms,
      vertexShader: bodyVertexShader,
      fragmentShader: bodyFragmentShader,
      transparent: true,
      // lights: true,
    });
    // 六面材质
    // const zuanshiMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    // 六面材质
    const zuanshiMat1 = new THREE.MeshBasicMaterial({ color: 0x152A65, transparent: true, opacity: 1, side: THREE.DoubleSide });
    // 三角材质
    const zuanshiMat2 = new THREE.MeshLambertMaterial({ color: 0x1551A0, transparent: true, opacity: 1, side: THREE.DoubleSide });
    // 管线变色材质
    // const zuanshiMat3 = new THREE.ShaderMaterial({
    //   uniforms,
    //   vertexShader: lineVertexShader,
    //   fragmentShader: lineFragmentShader,
    //   transparent: true,
    //   // depthWrite: false,
    // });
    const zuanshiMat3 = new THREE.MeshBasicMaterial({ color: 0x00BBC9, transparent: true, opacity: 1, side: THREE.DoubleSide });
    // 上方圆模型材质
    const zuanshiMat4 = new THREE.ShaderMaterial({
      uniforms: circleUniforms,
      vertexShader: circleVertexShader,
      fragmentShader: bodyFragmentShader,
      transparent: true,
      // lights: true,
    });
    // 齿轮材质
    const zuanshiMat5 = new THREE.MeshPhongMaterial({ color: 0x2EB6FF, transparent: true, opacity: 1, side: THREE.DoubleSide });
    const load = new GLTFLoader();
    load.load(zuanshi, (v) => {
      const zuanShiObj3D = new THREE.Object3D();
      const chilunObj3D = new THREE.Object3D();
      const zuanShiModule = v.scene.children[0].children[0];
      zuanShiModule.position.x = 0.93;
      zuanShiModule.position.y = 0.5;
      zuanShiModule.position.z = -0.06;
      zuanShiModule.rotation.x = -Math.PI / 2;
      zuanShiModule.scale.set(0.00035, 0.00035, 0.00035);
      // zuanShiModule.scale.set(0.9, 0.9, 0.9);
      zuanShiModule.children.forEach((d, i) => {
        const zuanshD = d;
        zuanshD.name = `z${i + 1}`;
      });
      // 六面
      zuanShiModule.children[0].material = zuanshiMat1;
      const zuanShiMesh1 = zuanShiModule.children[0].clone();
      zuanShiMesh1.name = 'zuanshi';
      zuanShiObj3D.add(zuanShiMesh1);
      zuanShiArr.push(zuanShiMesh1);
      // 三角形
      zuanShiModule.children[1].material = zuanshiMat2;
      const zuanShiMesh2 = zuanShiModule.children[1].clone();
      zuanShiMesh2.name = 'zuanshi';
      zuanShiObj3D.add(zuanShiMesh2);
      zuanShiArr.push(zuanShiMesh2);
      // 管线
      zuanShiModule.children[2].material = zuanshiMat3;
      const zuanShiMesh3 = zuanShiModule.children[2].clone();
      zuanShiMesh3.name = 'zuanshi';
      zuanShiObj3D.add(zuanShiMesh3);
      zuanShiArr.push(zuanShiMesh3);
      // zuanShiMesh3.layers.enable(BLOOM_SCENE);
      // 上方管线
      zuanShiModule.children[3].material = zuanshiMat3;
      const zuanShiMesh4 = zuanShiModule.children[3].clone();
      zuanShiMesh4.name = 'zuanshi';
      zuanShiObj3D.add(zuanShiMesh4);
      zuanShiArr.push(zuanShiMesh4);
      // 上方圆模型
      zuanShiModule.children[4].material = zuanshiMat4;
      const zuanShiMesh5 = zuanShiModule.children[4].clone();
      zuanShiMesh5.name = 'zuanshi';
      zuanShiObj3D.add(zuanShiMesh5);
      zuanShiArr.push(zuanShiMesh5);
      // 齿轮
      zuanShiModule.children[5].material = zuanshiMat5;
      const zuanShiMesh6 = zuanShiModule.children[5].clone();
      zuanShiMesh6.name = 'zuanshi';
      chilunObj3D.add(zuanShiMesh6);
      chilunObj3D.position.set(0.93, 0.5, -0.06);
      chilunObj3D.rotation.x = -Math.PI / 2;
      chilunObj3D.scale.set(0.00035, 0.00035, 0.00035);
      chiLun.add(chilunObj3D);
      zuanShiArr.push(zuanShiMesh6);
      // 钻石主体
      zuanShiModule.children[6].material = zuanshiShader;
      const zuanShiMesh7 = zuanShiModule.children[6].clone();
      // zuanShiMesh7.geometry.computeVertexNormals(); // 计算顶点法线
      zuanShiMesh7.name = 'zuanshi';
      zuanShiObj3D.add(zuanShiMesh7);
      zuanShiArr.push(zuanShiMesh7);

      zuanShiObj3D.position.set(0.93, 0.5, -0.06);
      zuanShiObj3D.rotation.x = -Math.PI / 2;
      zuanShiObj3D.scale.set(0.00035, 0.00035, 0.00035);
      zuanShiG.add(zuanShiObj3D);
      // group.add(zuanShiModule)
    })
  }
  // ——————————————————————————流动管线————————————————————————————
  function getFlowLine() {
    FlowLineUniforms = {
      time: {
        type: 'f',
        value: 0.0,
      },
    }
    const FlowLineMat = new THREE.ShaderMaterial({
      uniforms: FlowLineUniforms,
      vertexShader: flowLineVertexShader,
      fragmentShader: flowLineFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const line1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.71, 0.25, 1.355),
      new THREE.Vector3(0.71, 0.45, 1.355),
      new THREE.Vector3(0.71, 0.52, 1.355),
      new THREE.Vector3(0.713, 0.52, 1.358),
      new THREE.Vector3(0.91, 0.5, 1.7),
      new THREE.Vector3(0.93, 0.5, 1.74),
      new THREE.Vector3(1.425, -0.35, 2.59),
      new THREE.Vector3(1.425, -0.40, 2.62),
      new THREE.Vector3(1.435, -0.45, 2.59),
      new THREE.Vector3(1.392, -0.55, 2.54),
      new THREE.Vector3(0.05, -4.48, 0.2),
      new THREE.Vector3(0.05, -4.46, 0.2),
      new THREE.Vector3(-0.01, -4.46, 0.1),
    ]);
    const lineGeo1 = new THREE.TubeBufferGeometry(line1, 128, 0.04, 8, false);
    const lineMesh1 = new THREE.Mesh(lineGeo1, FlowLineMat);
    const lineMesh2 = lineMesh1.clone()
    lineMesh2.position.set(0.05, 0, -0.02)
    const lineMesh3 = lineMesh1.clone()
    lineMesh3.position.set(0.1, 0, -0.04)
    const FlowLineG1 = new THREE.Group();
    FlowLineG1.add(lineMesh1)
    FlowLineG1.add(lineMesh2)
    FlowLineG1.add(lineMesh3)

    const FlowLineG2 = FlowLineG1.clone();
    FlowLineG2.rotation.y = 60 * (Math.PI / 180);

    const FlowLineG3 = FlowLineG1.clone();
    FlowLineG3.rotation.y = 120 * (Math.PI / 180);

    const FlowLineG4 = FlowLineG1.clone();
    FlowLineG4.rotation.y = 180 * (Math.PI / 180);

    const FlowLineG5 = FlowLineG1.clone();
    FlowLineG5.rotation.y = 240 * (Math.PI / 180);

    const FlowLineG6 = FlowLineG1.clone();
    FlowLineG6.rotation.y = 300 * (Math.PI / 180);

    zuanShiG.add(FlowLineG1);
    zuanShiG.add(FlowLineG2);
    zuanShiG.add(FlowLineG3);
    zuanShiG.add(FlowLineG4);
    zuanShiG.add(FlowLineG5);
    zuanShiG.add(FlowLineG6);
  }

  // ————————————————————交互小球（上下）————————————————————————
  // 小球uniforms
  const sphereUniforms = {
    coeficient: {
      type: 'f',
      value: 0.0,
    },
    power: {
      type: 'f',
      value: 2.0,
    },
    glowColor: {
      type: 'c',
      value: new THREE.Color(0x4ED1FD),
    },
    opa: {
      type: 'f',
      value: 0.0,
    },
  };
  const sphereUniforms2 = {
    coeficient: {
      type: 'f',
      value: 0.0,
    },
    power: {
      type: 'f',
      value: 2.0,
    },
    glowColor: {
      type: 'c',
      value: new THREE.Color(0xDFFF15),
    },
    opa: {
      type: 'f',
      value: 0.0,
    },
  };
  // 点击小球mat
  const sphereInMat = new THREE.MeshPhongMaterial({ color: 0x4ED1FD });
  // 未点击小球mat
  const smallSphereMat = new THREE.MeshBasicMaterial({ color: 0x091C31 });
  // 未点击小球外轮廓
  const smallOutSphereMat = new THREE.MeshBasicMaterial({ color: 0x4ED1FD, side: THREE.BackSide });
  // 发光小球mat
  const sphereMat = new THREE.ShaderMaterial({
    uniforms: sphereUniforms,
    vertexShader: sphereVertexShader,
    fragmentShader: sphereFragmentShader,
    blending: THREE.NormalBlending,
    transparent: true,
    depthWrite: false,
  });
  const sphereMat2 = new THREE.ShaderMaterial({
    uniforms: sphereUniforms2,
    vertexShader: sphereVertexShader,
    fragmentShader: sphereFragmentShader,
    blending: THREE.NormalBlending,
    transparent: true,
    depthWrite: false,
  });

  // 弹框属性
  // const textKeys = ['数据量', '表数', '条数', '字段数', '日增量', '部门总数', '来源部门数', '共享部门数'];
  // 绘制弹框函数
  function getTextDiv(d) {
    const textDiv = document.createElement('div');
    // textDiv.style.transition = 'all 0.2s linear';
    textDiv.style.opacity = 0;

    const bgDiv1 = document.createElement('div');
    bgDiv1.className = 'bgDiv11';
    textDiv.appendChild(bgDiv1);

    const bgDiv2 = document.createElement('div');
    bgDiv2.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';
    bgDiv2.className = 'bgDiv22';
    textDiv.appendChild(bgDiv2);

    const bgDiv2LeftText = document.createElement('div');
    bgDiv2LeftText.style.display = 'inline-block';
    bgDiv2.appendChild(bgDiv2LeftText);

    const bgDiv2RightText = document.createElement('div');
    bgDiv2RightText.style.display = 'inline-block';
    bgDiv2.appendChild(bgDiv2RightText);

    if (d.y && d.y.length > 0) {
      d.y.forEach((txt) => {
        const leftText = document.createElement('div');
        leftText.className = 'leftText';
        leftText.innerHTML = txt.name;
        bgDiv2LeftText.appendChild(leftText);

        const rightText = document.createElement('div');
        rightText.className = 'rightText';
        rightText.innerHTML = `${txt.value}${txt.unit}`;
        bgDiv2RightText.appendChild(rightText);
      })
    }

    const bgDiv3 = document.createElement('div');
    bgDiv3.className = 'bgDiv33';
    textDiv.appendChild(bgDiv3);

    const css2DText = new CSS2DObject(textDiv);
    return css2DText;
  }
  function getTextDiv2(d) {
    const textDiv = document.createElement('div');
    // textDiv.style.transition = 'all 0.2s linear';
    textDiv.style.opacity = 0;

    const bgDiv1 = document.createElement('div');
    bgDiv1.className = 'bgDiv111';
    textDiv.appendChild(bgDiv1);

    const bgDiv2 = document.createElement('div');
    bgDiv2.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';
    bgDiv2.className = 'bgDiv222';
    textDiv.appendChild(bgDiv2);

    const bgDiv2LeftText = document.createElement('div');
    bgDiv2LeftText.style.display = 'inline-block';
    bgDiv2.appendChild(bgDiv2LeftText);

    const bgDiv2RightText = document.createElement('div');
    bgDiv2RightText.style.display = 'inline-block';
    bgDiv2.appendChild(bgDiv2RightText);

    if (d.y && d.y.length > 0) {
      d.y.forEach((txt) => {
        const leftText = document.createElement('div');
        leftText.className = 'leftText2';
        leftText.innerHTML = txt.name;
        bgDiv2LeftText.appendChild(leftText);

        const rightText = document.createElement('div');
        rightText.className = 'rightText2';
        rightText.innerHTML = `${txt.value}${txt.unit}`;
        bgDiv2RightText.appendChild(rightText);
      })
    }

    const bgDiv3 = document.createElement('div');
    bgDiv3.className = 'bgDiv333';
    textDiv.appendChild(bgDiv3);

    const css2DText = new CSS2DObject(textDiv);
    return css2DText;
  }

  // 底部文字绘制
  function getCanvasText(cans, ctx, text) {
    ctx.beginPath();
    ctx.clearRect(0, 0, 256, 256); // 清空画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // 背景色
    ctx.fillRect(0, 0, 256, 256) // 画背景
    ctx.fillStyle = 'rgb(255, 255, 255)'; // 文字颜色
    // text
    ctx.font = "bold 18px '微软雅黑'"; // 设置文字样式
    ctx.textAlign = 'center';
    ctx.fillText(text, 256 / 2, 256 / 2)
    const texture = new THREE.Texture(cans);
    texture.needsUpdate = true;
    return texture;
  }
  function getBottomSphere() {
    const smallSpheres = new THREE.Object3D();
    smallTopSpheres = new THREE.Object3D();
    // 交互发光小球源几何
    const sphereGeo = new THREE.SphereBufferGeometry(0.3, 32, 32);
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    // 未点击交互发光小球源几何
    const sphereGeo2 = new THREE.SphereBufferGeometry(0.18, 32, 32);
    const sphereMesh2 = new THREE.Mesh(sphereGeo2, sphereMat);

    // 点击交互小球源几何
    const sphereInGeo = new THREE.SphereBufferGeometry(0.2, 32, 32);
    const sphereInMesh = new THREE.Mesh(sphereInGeo, sphereInMat);

    // 未点击的小球源几何
    const smallSphereGeo = new THREE.SphereBufferGeometry(0.1, 32, 32);
    const smallSphereMesh = new THREE.Mesh(smallSphereGeo, smallSphereMat);

    // 未点击小球外轮廓
    const smallOutSphereMesh = new THREE.Mesh(smallSphereGeo, smallOutSphereMat);
    smallOutSphereMesh.scale.multiplyScalar(1.2);

    // 环绕圈 (点中小球)
    const lineCircle = new THREE.TorusBufferGeometry(0.28, 0.01, 30, 35, 2 * Math.PI);
    const lineCircleMat = new THREE.MeshLambertMaterial({ color: 0xAFEEEE });
    circleShowRingMesh1 = new THREE.Mesh(lineCircle, lineCircleMat);
    const lineCircle2 = lineCircle.clone();
    circleShowRingMesh2 = new THREE.Mesh(lineCircle2, lineCircleMat);

    // 绘制小球（下）和弹框
    if (data2 && data2.length > 0) {
      // 计算底部小球展示数量
      const data2Len = data2.length;

      data2.forEach((d, i) => {
        const circleIndex = Math.floor(30 / (data2Len + 1));
        let vec3; // 圆上一点
        if (data2Len === 3 || data2Len === 6) {
          vec3 = bigCircleGeo.vertices[34 + (circleIndex * (i + 1))];
        } else {
          vec3 = bigCircleGeo.vertices[33 + (circleIndex * (i + 1))];
        }
        if (d.type === 1) {
          sphereInMesh.position.set(vec3.x, vec3.y, vec3.z);
          sphereInMesh.name = `${d.num}BigSphereShow`;
          smallSpheres.add(sphereInMesh);

          sphereMesh.position.set(vec3.x, vec3.y, vec3.z);
          sphereMesh.name = `${d.num}BloomSphereShow`;
          smallSpheres.add(sphereMesh);
          // 双环
          circleShowRingMesh1.position.set(vec3.x, vec3.y, vec3.z);
          circleShowRingMesh2.position.set(vec3.x, vec3.y, vec3.z);
          smallSpheres.add(circleShowRingMesh1);
          smallSpheres.add(circleShowRingMesh2);
          bottomCs.push(sphereInMesh)
          bottomCs.push(sphereMesh)
        } else {
          // 未点击小球
          const smallSphereMeshObj = smallSphereMesh.clone();
          smallSphereMeshObj.position.set(vec3.x, vec3.y, vec3.z);
          smallSphereMeshObj.name = `${d.num}smallSphere`;
          smallSpheres.add(smallSphereMeshObj);
          // 未点击小球外轮廓
          const smallOutSphereMeshObj = smallOutSphereMesh.clone();
          smallOutSphereMeshObj.position.set(vec3.x, vec3.y, vec3.z);
          smallOutSphereMeshObj.name = `${d.num}smallOutLine`;
          smallSpheres.add(smallOutSphereMeshObj);
          // 发光
          const smallSphereMeshObj2 = sphereMesh2.clone();
          smallSphereMeshObj2.position.set(vec3.x, vec3.y, vec3.z);
          smallSphereMeshObj2.name = `${d.num}smallBloom`;
          smallSpheres.add(smallSphereMeshObj2);

          bottomCs.push(smallSphereMeshObj)
          bottomCs.push(smallOutSphereMeshObj)
          bottomCs.push(smallSphereMeshObj2)
        }

        // 弹框
        const css2DText = getTextDiv(d);
        css2DText.position.set(vec3.x - 0.14, vec3.y, vec3.z + 2.2);
        css2DText.name = `${d.num}`;
        smallSpheres.add(css2DText)
        textDivs.push(css2DText);

        // 底部文字
        const canvasText = document.createElement('canvas');
        canvasText.width = 256;
        canvasText.height = 256;
        const ctxs = canvasText.getContext('2d');
        const textMap = getCanvasText(canvasText, ctxs, d.x);
        const spriteMat = new THREE.SpriteMaterial({ map: textMap });
        const spriteMesh = new THREE.Sprite(spriteMat);
        spriteMesh.position.set(vec3.x, vec3.y, vec3.z - 1);
        spriteMesh.scale.set(4, 4, 4);
        smallSpheres.add(spriteMesh);
      })
    }
    // 绘制小球（上）和弹框
    if (data1 && data1.length > 0) {
      // 计算顶部小球展示数量
      const data1Len = data1.length;
      data1.forEach((d, i) => {
        const circleIndex2 = Math.floor(64 / data1Len);
        const vec3 = topCircleGeo.vertices[((circleIndex2 * (i + 1)) - 1)];
        if (d.type === 1) {
          // const sphereInMeshShow = sphereInMesh.clone();
          sphereInMesh.position.set(vec3.x, vec3.y, vec3.z);
          sphereInMesh.name = `${d.num}BigSphereShow`;
          smallTopSpheres.add(sphereInMesh);
          // const sphereMeshShow = sphereMesh.clone();
          sphereMesh.position.set(vec3.x, vec3.y, vec3.z);
          sphereMesh.name = `${d.num}BloomSphereShow`;
          smallTopSpheres.add(sphereMesh);
          // 双环
          circleShowRingMesh1.position.set(vec3.x, vec3.y, vec3.z);
          circleShowRingMesh2.position.set(vec3.x, vec3.y, vec3.z);
          smallTopSpheres.add(circleShowRingMesh1);
          smallTopSpheres.add(circleShowRingMesh2);
          bottomCs.push(sphereInMesh);
          bottomCs.push(sphereMesh);
          zuanShiArr.push(sphereInMesh);
          zuanShiArr.push(sphereMesh);
        } else {
          // 未点击小球
          const smallSphereMeshObj = smallSphereMesh.clone();
          smallSphereMeshObj.position.set(vec3.x, vec3.y, vec3.z);
          smallSphereMeshObj.name = `${d.num}smallSphere`;
          smallTopSpheres.add(smallSphereMeshObj);
          // 未点击小球外轮廓
          const smallOutSphereMeshObj = smallOutSphereMesh.clone();
          smallOutSphereMeshObj.position.set(vec3.x, vec3.y, vec3.z);
          smallOutSphereMeshObj.name = `${d.num}smallOutLine`;
          smallTopSpheres.add(smallOutSphereMeshObj);
          // 发光
          const smallSphereMeshObj2 = sphereMesh2.clone();
          smallSphereMeshObj2.position.set(vec3.x, vec3.y, vec3.z);
          smallSphereMeshObj2.name = `${d.num}smallBloom`;
          smallTopSpheres.add(smallSphereMeshObj2);

          bottomCs.push(smallSphereMeshObj)
          bottomCs.push(smallOutSphereMeshObj)
          bottomCs.push(smallSphereMeshObj2)
          zuanShiArr.push(smallSphereMeshObj)
          zuanShiArr.push(smallOutSphereMeshObj)
          zuanShiArr.push(smallSphereMeshObj2)
        }
        // 弹框
        const css2DText = getTextDiv2(d);
        css2DText.position.set(vec3.x - 0.14, vec3.y, vec3.z + 2.2);
        css2DText.name = `${d.num}`;
        smallTopSpheres.add(css2DText)
        textDivs.push(css2DText);

        // 顶部文字
        const canvasText = document.createElement('canvas');
        canvasText.width = 256;
        canvasText.height = 256;
        const ctxs = canvasText.getContext('2d');
        const textMap = getCanvasText(canvasText, ctxs, d.x);
        const spriteMat = new THREE.SpriteMaterial({ map: textMap, depthWrite: false });
        const spriteMesh = new THREE.Sprite(spriteMat);
        spriteMesh.position.set(vec3.x, vec3.y, vec3.z + 0.5);
        spriteMesh.scale.set(4, 4, 4);
        smallTopSpheres.add(spriteMesh);
      });
    }
    smallSpheres.rotation.x = -Math.PI / 2;
    smallSpheres.position.y = -2;
    smallTopSpheres.rotation.x = -Math.PI / 2;
    smallTopSpheres.position.x = 0.04
    smallTopSpheres.position.y = 2.26;
    smallTopSpheres.position.z = 0.05
    bottomSphereG.add(smallSpheres);
    zuanShiG.add(smallTopSpheres);
  }

  // 渲染
  function init() {
    if (!initThree) {
      getThree();
      getLight();
      getBigCircle();
      getZuanShi();
      getFlowLine();
      initThree = true;
    }
    if (updateThree) {
      clearThree(bottomSphereG);
      clearThree(smallTopSpheres);
      bottomCs.length = 0;
      textDivs.length = 0;
      if (zuanShiArr && zuanShiArr.length > 0) {
        zuanShiArr = zuanShiArr.filter((d) => d.name === 'zuanshi');
      }
    }
    getBottomSphere();
  }
  init();

  // ———————————————————————bloom————————————————————————
  // const bloomLayer = new THREE.Layers();
  // bloomLayer.set(BLOOM_SCENE);

  // const params = {
  //   exposure: 0.1,
  //   bloomStrength: 0.3,
  //   bloomThreshold: 0,
  //   bloomRadius: 0,
  // };
  // const renderScene = new RenderPass(scene, camera);
  // const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
  // bloomPass.threshold = params.bloomThreshold;
  // bloomPass.strength = params.bloomStrength;
  // bloomPass.radius = params.bloomRadius;

  // const bloomComposer = new EffectComposer(webGLRenderer);
  // bloomComposer.renderToScreen = true;
  // bloomComposer.addPass(renderScene);
  // bloomComposer.addPass(bloomPass);

  // const finalPass = new ShaderPass(
  //   new THREE.ShaderMaterial({
  //     uniforms: {
  //       baseTexture: { value: null },
  //       bloomTexture: { value: bloomComposer.renderTarget2.texture },
  //     },
  //     vertexShader: bloomVertexShader,
  //     fragmentShader: bloomFragmentShader,
  //     defines: {},
  //   }), 'baseTexture',
  // );
  // finalPass.needsSwap = true;

  // const finalComposer = new EffectComposer(webGLRenderer);
  // finalComposer.addPass(renderScene);
  // finalComposer.addPass(finalPass);

  // bloomComposer.setSize(width, height);
  // finalComposer.setSize(width, height);
  // ———————————————————————鼠标移入————————————————————————
  const mouseMoveDiv = document.getElementsByClassName('middleDiamond')[0];
  const mouse = new THREE.Vector2();
  let vector;
  let raycaster;
  let intersects;
  let intersects2;
  mouseMoveDiv.onmousemove = (e) => {
    mouse.x = (((e.clientX - (((671 * leftTop.scales) - document.body.scrollLeft) + leftTop.leftScale)) / (canvas.clientWidth * leftTop.scales)) * 2) - 1;
    mouse.y = -(((e.clientY - (((183 * leftTop.scales) - document.body.scrollTop) + leftTop.topScale)) / (canvas.clientHeight * leftTop.scales)) * 2) + 1;
    // 新建一个三维单位向量 假设z方向就是0.5, 根据照相机，把这个向量转换到视点坐标系
    vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    // 在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    // Vector3.sub(v): 从Vector3向量中减去v normalize(): 归一化
    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 0, 300);
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(bottomCs);
    intersects2 = raycaster.intersectObjects(zuanShiArr);
    if (intersects.length > 0) {
      intersects.forEach((d) => {
        const obj = d;
        if (obj.object.name.slice(-4) === 'Show') {
          if (bottomCs && bottomCs.length > 0) {
            bottomCs.filter((v) => v.name.slice(-15) === 'BloomSphereShow')[0].material = sphereMat2;
          }
          if (textDivs && textDivs.length > 0) {
            textDivs.filter((v) => Number(v.name) === parseInt(obj.object.name, 10))[0].element.style.opacity = 1;
          }
          if (!moveStatusBool) {
            getMoveStatus(true);
            moveStatusBool = true;
          }
        }
      });
      mouseMoveDiv.style.cursor = 'pointer';
    } else {
      if (bottomCs && bottomCs.length > 0) {
        bottomCs.filter((v) => v.name.slice(-15) === 'BloomSphereShow')[0].material = sphereMat;
      }
      mouseMoveDiv.style.cursor = 'default';
      if (textDivs && textDivs.length > 0) {
        textDivs.forEach((v) => {
          const value = v;
          value.element.style.opacity = 0;
        });
      }
      if (moveStatusBool) {
        getMoveStatus(false);
        moveStatusBool = false;
      }
    }
    // 钻石部分
    // console.log(intersects2.length)
    if (intersects2.length > 0 || intersects.length > 0) {
      zuanShiRotate = false;
    } else {
      zuanShiRotate = true;
    }
  }
  // ——————————————————————————鼠标点击————————————————————————————
  mouseMoveDiv.onclick = (e) => {
    mouse.x = (((e.clientX - (((671 * leftTop.scales) - document.body.scrollLeft) + leftTop.leftScale)) / (canvas.clientWidth * leftTop.scales)) * 2) - 1;
    mouse.y = -(((e.clientY - (((183 * leftTop.scales) - document.body.scrollTop) + leftTop.topScale)) / (canvas.clientHeight * leftTop.scales)) * 2) + 1;
    // 新建一个三维单位向量 假设z方向就是0.5, 根据照相机，把这个向量转换到视点坐标系
    vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    // 在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    // Vector3.sub(v): 从Vector3向量中减去v normalize(): 归一化
    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 0, 300);
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(bottomCs);
    if (intersects.length > 0) {
      if (intersects[0].object.name.slice(-4) === 'Show') {
        // 再次点击跳转到指定页面
      } else if (intersects[0].object.name.slice(-4) !== 'Show') {
        const num = parseInt(intersects[0].object.name, 10);
        getShowIndex(num);
        highShow.start();
        // highUnShow.start();
      }
    }
  }

  // remove element
  if (id.children && id.children.length > 0) {
    id.removeChild(id.children[0]);
  }
  id.appendChild(css2DRenderer.domElement); // 添加div

  let step = 0;
  function render() {
    step += 0.005;
    uniforms.time.value += 0.05;
    chiLun.rotation.y += 0.002;

    // 管线流动
    FlowLineUniforms.time.value += 0.01;
    // 圆环旋转动画
    if (ringLightCircle) {
      ringLightCircle.rotation.z += 0.02;
    }
    // 球体发光动画
    if (sphereUniforms) {
      sphereUniforms.opa.value += 0.03; // showSphere lighting
      sphereUniforms2.opa.value += 0.03;
    }
    // 钻石主体旋转
    if (zuanShiRotate) {
      zuanShiG.rotation.y += 0.002;
    }
    // 双环动画
    if (circleShowRingMesh1 && circleShowRingMesh2) {
      circleShowRingMesh1.rotation.x = step;
      circleShowRingMesh1.rotation.y = step;
      circleShowRingMesh1.rotation.z = step;
      circleShowRingMesh2.rotation.x = -step;
      circleShowRingMesh2.rotation.y = -step;
      circleShowRingMesh2.rotation.z = -step;
    }
    const delta = clock.getDelta();
    orbitControls.update(delta);
    TWEEN.update();

    render1 = requestAnimationFrame(render);
    css2DRenderer.render(scene, camera);
    webGLRenderer.render(scene, camera);
    // bloomComposer.render();
    // finalComposer.render();
    // composer.render(delta);
  }
  if (render1) {
    cancelAnimationFrame(render1);
    render1 = null;
  }
  render();
}
