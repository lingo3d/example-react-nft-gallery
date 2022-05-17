import { useMachine } from '@xstate/react'
import {
  Find,
  HTML,
  Keyboard,
  Model,
  Reticle,
  ThirdPersonCamera,
  FirstPersonCamera,
  types,
  usePreload,
  Editor,
  useSpring,
  useWindowSize,
  World,
  Cube,
  Sphere
} from 'lingo3d-react'
import { useRef, useState } from 'react'
import './App.css'
import poseMachine from './stateMachines/poseMachine'
import AnimText from "@lincode/react-anim-text"
import { withFfcConsumer } from 'ffc-react-client-sdk';

const Game = ({ flags }) => {
  const botRef = useRef<types.Model>(null)

  const [pose, sendPose] = useMachine(poseMachine, {
    actions: {
      enterJumping: () => {
        const bot = botRef.current
        if (bot === null) return

        bot.velocity.y = 10

        bot.onLoop = () => {
          if (bot.velocity.y === 0) {
            bot.onLoop = undefined
            sendPose("LANDED")
          }
        }
      }
    }
  })


  const [mouseOver, setMouseOver] = useState([true, true, true, true, true, true])

  const camX = mouseOver ? 25 : 0
  const camY = mouseOver ? 50 : 50
  const camZ = mouseOver ? 50 : 200

  const xSpring = useSpring({ to: camX, bounce: 0 })
  const ySpring = useSpring({ to: camY, bounce: 0 })
  const zSpring = useSpring({ to: camZ, bounce: 0 })

  const windowSize = useWindowSize()
  const fov = windowSize.width < windowSize.height ? 100 : 75

  const showPresentationOfEachPanel = flags['一层墙壁画'] === "true";
  console.log(showPresentationOfEachPanel);

  const aCRNs = ["a1_CRN.a1_0", "a2_CRN.a2_0", "a3_CRN.a3_0", "a4_CRN.a4_0", "a5_CRN.a5_0", "a6_CRN.a6_0",
    "b7_CRN.b7_0", "b8_CRN.b8_0", "b9_CRN.b9_0", "b10_CRN.b10_0", "b11_CRN.b11_0", "b12_CRN.b12_0"]
  return (
    <>
      <World
        defaultLight="env.hdr"
        skybox="env.hdr"
        ambientOcclusion
        bloom
        bloomStrength={0.3}
        bloomRadius={1}
        bloomThreshold={0.8}
        outlineHiddenColor="red"
        outlinePulse={1000}
        outlinePattern="pattern.jpeg"
        repulsion={1}
      >
        <Model src="gallery.glb" scale={20} physics="map" >
          {
            aCRNs.map((value, index) => {
              let returnHtml = (<HTML key={value}>
                <div style={{ padding: "10px", color: "white", backgroundColor: 'black', transform: "translateY(-2em) translateX(0em)" }}>
                  <h2>
                    画名称: {value}
                  </h2>
                  <h2>
                    画顺序: {index}
                  </h2>
                  {/* <AnimText key={"animText-name-" + value} style={{ fontWeight: "bold", fontSize: 20 }} duration={1000}>
                    画名称: {value}
                  </AnimText>
                  <AnimText key={"animText-index-" + value} duration={1000}>
                    画顺序: {index}
                  </AnimText> */}
                </div>
              </HTML>)
              if (showPresentationOfEachPanel === true) {
                returnHtml = (<HTML key={value}>
                  <div style={{ color: "white", transform: "translateY(-12em) translateX(3em)" }}>
                    <iframe src='https://lingo3d.com/' width={600} height={400}>

                    </iframe>
                  </div>
                </HTML>)
              }

              return (
                <Find
                  name={value}
                  outline={mouseOver[index]}
                  onMouseOver={() => {
                    let mos = [false, false, false, false, false, false];
                    mos[index] = true
                    setMouseOver(mos)
                  }}
                  onMouseOut={() => {
                    let mos = [false, false, false, false, false, false];
                    mos[index] = false
                    setMouseOver(mos)
                  }}
                >
                  {
                    (mouseOver[index] === true) && (
                      returnHtml
                    )
                  }
                </Find>
              );
            })
          }
        </Model>
        {
          flags['人称视角'] === "第三人称视角" ?
            <ThirdPersonCamera
              mouseControl
              active
              innerY={ySpring}
              innerZ={zSpring}
              innerX={xSpring}
              fov={fov}
            >
              <Model
                src="bot.fbx"
                ref={botRef}
                physics="character"
                animations={{
                  idle: "idle.fbx",
                  running: "running.fbx",
                  jumping: "falling.fbx"
                }}
                animation={pose.value as any}
                width={50}
                depth={50}
                x={243.19}
                y={-910.47}
                z={-577.26}
                pbr
              />
            </ThirdPersonCamera>
            :
            <FirstPersonCamera
              mouseControl
              active
              fov={fov}
            >
              <Model
                src="bot.fbx"
                ref={botRef}
                physics="character"
                animations={{
                  idle: "idle.fbx",
                  running: "running.fbx",
                  jumping: "falling.fbx"
                }}
                animation={pose.value as any}
                width={50}
                depth={50}
                x={243.19}
                y={-910.47}
                z={-597.26}
                pbr
              />
            </FirstPersonCamera>
        }
        {
          flags['秘境---灵魂萃洗---淬体境'] !== "不展示" &&
          <Cube rotationX={45}
            rotationY={30}
            rotationZ={60}
            scale={2}
            x={-700}
            y={-1000}
            z={-200}
            physics="map" />
        }
        {
          flags['秘境---暗黑朋克屋'] === "true" &&
          <Model
            src="room1.fbx"
            physics="map"
            scale={2}
            rotationY={0}
            x={600}
            y={-370}
            z={350}
            pbr
          />
        }
        <Keyboard
          onKeyPress={key => {
            if (key === "w") {
              sendPose("KEY_W_DOWN")
              botRef.current?.moveForward(-10)
            }
            else if (key === "Space")
              sendPose("KEY_SPACE_DOWN")
          }}
          onKeyUp={key => {
            if (key === "w")
              sendPose("KEY_W_UP")
          }}
        />
      </World>
      <Reticle color="white" variant={7} />
    </>
  )
}



export default withFfcConsumer()(Game);
// export default App
