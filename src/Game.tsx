import { useMachine } from '@xstate/react'
import {
  Find,
  HTML,
  Keyboard,
  Model,
  Reticle,
  ThirdPersonCamera,
  types,
  useSpring,
  useWindowSize,
  World,
  Cube,
} from 'lingo3d-react'
import { useRef, useState } from 'react'
import './App.css'
import poseMachine from './stateMachines/poseMachine'
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


  const [mouseOver, setMouseOver] = useState(true)

  const camX = mouseOver ? 25 : 0
  const camY = mouseOver ? 50 : 50
  const camZ = mouseOver ? 50 : 200

  const xSpring = useSpring({ to: camX, bounce: 0 })
  const ySpring = useSpring({ to: camY, bounce: 0 })
  const zSpring = useSpring({ to: camZ, bounce: 0 })

  const windowSize = useWindowSize()
  const fov = windowSize.width < windowSize.height ? 100 : 75

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
          <Find
            name={'a6_CRN.a6_0'}
            outline={mouseOver}
            onMouseOver={() => {
              setMouseOver(true)
            }}
            onMouseOut={() => {
              setMouseOver(false)
            }}
          >
            {
              (mouseOver === true) && (
                <HTML>
                  <div style={{ padding: "10px", color: "white", transform: "translateY(-5em) translateX(-8em)" }}>
                    <h2 style={{ width: "260px" }}>
                      罗兰·英格斯·怀德（Laura Elizabeth Ingalls Wilder，1867～1957）出生于威斯康新州的大森林。童年时的生活足迹几乎遍及美国西部，15岁时就为拓荒者…
                    </h2>
                  </div>
                </HTML>)
            }
          </Find>
        </Model>
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
            scale={0.8}
            x={243.19}
            y={-910.47}
            z={-577.26}
            pbr
          />
        </ThirdPersonCamera>

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
