import { useMachine } from '@xstate/react'
import { AreaLight, Editor, Keyboard, Model, ThirdPersonCamera, types, World } from 'lingo3d-react'
import { useRef } from 'react'
import './App.css'
import poseMachine from './stateMachines/poseMachine'

function App() {
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

  return (
    <>
      <World
       defaultLight="env.hdr"
       skybox="env.hdr"
       ambientOcclusion
       bloom
       bloomRadius={1}
       bloomStrength={0.3}
       bloomThreshold={0.8}
      >
        <Model src="gallery.glb" scale={20} physics="map" />
        <ThirdPersonCamera mouseControl active>
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
    </>
  )
}

export default App
