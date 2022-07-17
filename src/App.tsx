import {
  Dummy,
  Find,
  HTML,
  Joystick,
  keyboard,
  Model,
  Reticle,
  ThirdPersonCamera,
  types,
  usePreload,
  useSpring,
  useWindowSize,
  World,
} from "lingo3d-react";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import AnimText from "@lincode/react-anim-text";

const Game = () => {
  // camera XYZ depends on whether user is looking at designated artwork
  // 相机的XYZ取决于用户是否瞄准指定的艺术品
  const [mouseOver, setMouseOver] = useState(false);
  const camX = mouseOver ? 50 : 0;
  const camY = mouseOver ? 100 : 100;
  const camZ = mouseOver ? 100 : 300;

  // Camera spring animation
  // 相机的弹簧动画
  const xSpring = useSpring({ to: camX, bounce: 0 });
  const ySpring = useSpring({ to: camY, bounce: 0 });
  const zSpring = useSpring({ to: camZ, bounce: 0 });

  // adjust camera FOV based on window size
  // 根据窗口大小调整相机的FOV
  const windowSize = useWindowSize();
  const fov = windowSize.width < windowSize.height ? 100 : 90;

  const dummyRef = useRef<types.Dummy>(null);

  // keyboard WASD controls
  // 键盘WASD控制
  useEffect(() => {
    keyboard.onKeyPress = (_, keys) => {
      const dummy = dummyRef.current;
      if (!dummy) return;

      if (keys.has("w")) dummy.strideForward = -5;
      else if (keys.has("s")) dummy.strideForward = 5;
      else dummy.strideForward = 0;

      if (keys.has("a")) dummy.strideRight = 5;
      else if (keys.has("d")) dummy.strideRight = -5;
      else dummy.strideRight = 0;
    };
  }, []);

  return (
    <World
      defaultLight="env.hdr"
      skybox="env.hdr"
      bloom
      bloomStrength={0.3}
      bloomRadius={1}
      bloomThreshold={0.8}
      outlineHiddenColor="red"
      outlinePulse={1000}
      outlinePattern="pattern.jpeg"
      repulsion={1}
    >
      {/* gallery model */}
      {/* 艺术馆模型 */}
      <Model src="gallery.glb" scale={20} physics="map">
        {/* find the artwork of name "a6_CRN.a6_0" */}
        {/* 找到名称为 "a6_CRN.a6_0" 的艺术品 */}
        <Find
          name="a6_CRN.a6_0"
          // when mouse is over artwork, set mouseOver state, which will trigger camera spring animation and artwork outline
          // 当鼠标移到艺术品上，改变mouseOver状态，触发相机弹簧动画和艺术品轮廓
          outline={mouseOver}
          onMouseOver={() => setMouseOver(true)}
          onMouseOut={() => setMouseOver(false)}
        >
          {/* when mouse is over artwork, show artwork description */}
          {/* 当鼠标移到艺术品上，显示艺术品描述文字 */}
          {mouseOver && (
            <HTML>
              <div style={{ color: "white" }}>
                <AnimText
                  style={{ fontWeight: "bold", fontSize: 20 }}
                  duration={1000}
                >
                  Artwork Title
                </AnimText>
                <AnimText duration={1000}>Bird Watch</AnimText>
              </div>
            </HTML>
          )}
        </Find>
      </Model>

      {/* Dummy character, and the camera that tracks it */}
      {/* 角色模型，以及追踪它的相机 */}
      <ThirdPersonCamera
        mouseControl
        active
        innerY={ySpring}
        innerZ={zSpring}
        innerX={xSpring}
        fov={fov}
        lockTargetRotation="dynamic-lock"
      >
        <Dummy
          ref={dummyRef}
          physics="character"
          x={243.19}
          y={-910.47}
          z={-577.26}
          roughnessFactor={0}
          metalnessFactor={0.3}
          strideMove
        />
      </ThirdPersonCamera>

      {/* crosshair */}
      {/* 准星 */}
      <Reticle />

      {/* virtual joystick */}
      {/* 虚拟摇杆 */}
      <Joystick
        onMove={(e) => {
          const dummy = dummyRef.current;
          if (!dummy) return;

          dummy.strideForward = -e.y * 5;
          dummy.strideRight = -e.x * 5;
        }}
        onMoveEnd={() => {
          const dummy = dummyRef.current;
          if (!dummy) return;

          dummy.strideForward = 0;
          dummy.strideRight = 0;
        }}
      />
    </World>
  );
};

// loading screen
// 加载界面
const App = () => {
  const progress = usePreload(
    ["env.hdr", "gallery.glb", "pattern.jpeg"],
    "32.7mb"
  );

  if (progress < 100)
    return (
      <div className="w-full h-full absolute bg-black left-0 top-0 flex justify-center items-center text-white">
        loading {Math.floor(progress)}%
      </div>
    );

  return <Game />;
};

export default App;
