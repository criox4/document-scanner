import QRCode from 'react-qr-code'
import axios from 'axios'
import { useState, useEffect } from 'react'
import '../styles/App.css'

const App = () => {
	const [accessToken, setAccessToken] = useState(null)

	useEffect(() => {
		const url = `${process.env.REACT_APP_BACKER_URL}/getqr`

		axios
			.get(url)
			.then((resp) => setAccessToken(resp.data.access_token))
			.catch((err) => console.log(err))
	}, [])

	return (
		<div className='main'>
			<h1>Test Page</h1>
			<div className='code_container'>
				<div className='qrcode'>
					<QRCode value={accessToken ? accessToken : 'test-data'} className='qrcode_element'/>
				</div>
			</div>
			<div className='description'>
				Scan the QR code using client app.
			</div>
		</div>
	)
}

export default App
