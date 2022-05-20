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


const abTestUseFlag = (userName, variant, timestamp, variantIndex) => {
  var myHeaders = new Headers();
  myHeaders.append("envsecret", "YjIwLTdmOGItNCUyMDIyMDUxNzA3Mjg0M19fMTU3X18xODNfXzM3NV9fZGVmYXVsdF9iYjEzOQ==");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify([
    {
      "user": {
        "userName": userName,
        "email": userName + "@abtest.ffc",
        "keyId": userName
      },
      "userVariations": [
        {
          "featureFlagKeyName": "小姐姐与门谁跟重要",
          "sendToExperiment": true,
          "timestamp": timestamp,
          "variation": {
            "localId": variantIndex,
            "variationValue": variant
          }
        }
      ],
      "metrics": []
    }
  ]);

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.featureflag.co/api/public/track", requestOptions)
    .then(response => response.text())
    .then(result => console.log('post result:', result))
    .catch(error => console.log('error', error));

}


const abTestSendMetric = (userName) => {
  var myHeaders = new Headers();
  myHeaders.append("envsecret", "YjIwLTdmOGItNCUyMDIyMDUxNzA3Mjg0M19fMTU3X18xODNfXzM3NV9fZGVmYXVsdF9iYjEzOQ==");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify([
    {
      "user": {
        "userName": userName,
        "email": userName + "@abtest.ffc",
        "keyId": userName
      },
      "userVariations": [],
      "metrics": [
        {
          "route": "/nft-gallery/",
          "numericValue": 1,
          "appType": "javascript",
          "eventName": "进入新天地",
          "type": "CustomEvent"
        }
      ]
    }
  ]);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.featureflag.co/api/public/track", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

}

const Game = async ({ flags }) => {
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

  const showPresentationOfEachPanel = flags['一层墙壁画'] === "新版";

  const aCRNs = ["a1_CRN.a1_0", "a2_CRN.a2_0", "a3_CRN.a3_0", "a4_CRN.a4_0", "a5_CRN.a5_0", "a6_CRN.a6_0",
    "b7_CRN.b7_0", "b8_CRN.b8_0", "b9_CRN.b9_0", "b10_CRN.b10_0", "b11_CRN.b11_0", "b12_CRN.b12_0"]

   const sleep = () => {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  {
    for (let i = 17947; i < 18198; i++) {
      let userName = `abtest-user-0000-${i}`;
      if (i % 2 === 1) {
        abTestUseFlag(userName,
          "只有传送门", Date.now(), 1);
      }
      else {
        abTestUseFlag(userName,
          "有门和小姐姐", Date.now(), 2);
      }
      await sleep();
      console.log(Date.now);
      console.log(userName);
    }

    for (let i = 17947; i < 18158; i++) {
      let userName = `abtest-user-0000-${i}`;
      if (i % 2 === 1) {
        if (i % 7 == 0 ) {
          abTestSendMetric(userName);
        }
      }
      else {
          abTestSendMetric(userName);
      }
      await sleep();
      console.log(Date.now);
      console.log(userName);
    }
  }

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
        {/* <Model src="gallery.glb" scale={20} physics="map" >
          {
            aCRNs.map((value, index) => {
              let returnHtml = (showPresentationOfEachPanel === true) ?
                (<HTML key={value}>
                  <div style={{ padding: "10px", color: "white", transform: "translateY(-5em) translateX(-8em)" }}>
                    <h2 style={{ marginBottom: "20px" }}>
                      画编号: {value}-F2100{index}
                    </h2>
                    <h2 style={{ width: "260px" }}>
                      罗兰·英格斯·怀德（Laura Elizabeth Ingalls Wilder，1867～1957）出生于威斯康新州的大森林。童年时的生活足迹几乎遍及美国西部，15岁时就为拓荒者…
                    </h2>
                  </div>
                </HTML>) : null

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
                scale={0.8}
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
          flags['粉衣小姐姐'] === "true" &&
          <Model
            src="Anime_character.fbx"
            physics="map"
            scale={1}
            rotationX={-180.00}
            rotationY={240.00}
            rotationZ={-180.00}
            x={98.72}
            y={-408.38}
            z={-680.47}
            pbr
          />
        }
        {
          flags['女仆小姐姐'] === "true" &&
          <Model
            src="nvpu.fbx"
            physics="character"
            scale={1}
            rotationY={-25.00}
            x={-101.52}
            y={-410.48}
            z={-807.63}
            pbr
          />
        }
        {
          flags['星际之门'] === "true" &&
          <Model
            src="星际门.fbx"
            physics="map-debug"
            scale={1.5}
            x={51.52}
            y={-389.11}
            z={-809.04}
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
        /> */}
      </World>
      <Reticle color="white" variant={7} />
      {/* <Editor/> */}
    </>
  )
}



export default withFfcConsumer()(Game);
// export default App
