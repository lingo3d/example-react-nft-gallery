import {
  usePreload
} from 'lingo3d-react'
import './App.css'
import { withFfcConsumer } from 'ffc-react-client-sdk';
import Game from './Game';

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


export default withFfcConsumer()(App);
// export default App
