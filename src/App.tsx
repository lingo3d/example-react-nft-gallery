import { useMachine } from '@xstate/react'
import { Find, HTML, Keyboard, Model, Reticle, ThirdPersonCamera, types, usePreload, useSpring, useWindowSize, World } from 'lingo3d-react'
import { useRef, useState } from 'react'
import './App.css'
import poseMachine from './stateMachines/poseMachine'
import AnimText from "@lincode/react-anim-text"

const Game = () => {
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

  const [mouseOver, setMouseOver] = useState(false)

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
        <Model src="gallery.glb" scale={20} physics="map">
          <Find
           name="a6_CRN.a6_0"
           outline={mouseOver}
           onMouseOver={() => setMouseOver(true)}
           onMouseOut={() => setMouseOver(false)}
          >
            {mouseOver && (
              <HTML>
                <div style={{ color: "white" }}>
                  <AnimText style={{ fontWeight: "bold", fontSize: 20 }} duration={1000}>
                    Artwork Title
                  </AnimText>
                  <AnimText duration={1000}>
                    Bird Watch
                  </AnimText>
                </div>
              </HTML>
            )}
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

const App = () => {
  const progress = usePreload(
    ["bot.fbx", "env.hdr", "falling.fbx", "gallery.glb", "idle.fbx", "pattern.jpeg", "running.fbx"],
    "63.2mb"
  )

  if (progress < 100)
    return (
      <div className="w-full h-full absolute bg-black left-0 top-0 flex justify-center items-center text-white">
        loading {Math.floor(progress)}%
      </div>
    )
  
  return (
    <Game />
  )
}

export default App
