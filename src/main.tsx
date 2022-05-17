import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { asyncWithFfcProvider } from 'ffc-react-client-sdk'

// ReactDOM.render(<App />, document.getElementById('root'))

(async () => {
    const FfcProvider = await asyncWithFfcProvider({
        options: {
            anonymous: true,
            api: 'https://api.featureflag.co',
            secret: 'YjIwLTdmOGItNCUyMDIyMDUxNzA3Mjg0M19fMTU3X18xODNfXzM3NV9fZGVmYXVsdF9iYjEzOQ==',
            bootstrap: []
        }
    });

    ReactDOM.render(
        <FfcProvider>
            <App />
        </FfcProvider>, 
        document.getElementById('root'))
})();