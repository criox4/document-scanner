require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userdb = [
	{
		user: 'test-user',
		password: 'test-password',
	},
]

const app = express()

app.use(express.json())

app.post('/register', async (req, res) => {
	// registration logic
	try {
		const { usr, pwd } = req.body
		const exists = userdb.find({ user: usr }) && true

		if (exists) {
			res.status(400).send({
				message: 'User already exists, please login.',
			})
		}
		const encryptedPass = await bcrypt.hash(pwd, 10)

		const newUser = {
			user: usr,
			password: encryptedPass,
		}

		userdb.push(newUser)

		const token = jwt.sign({ usr }, process.env.TOKEN_SECRET, {
			expiresIn: '7d',
		})

		newUser.token = token

		res.status(201).json(newUser)
	} catch (err) {
		console.error(err)
	}
})

app.post('/login', async (req, res) => {
	// login logic
	try {
		const { usr, pwd } = req.body

		if (!(usr && pwd)) {
			res.status(400).send({ message: 'Input field(s) empty.' })
		}

		const user = userdb.find({ user: usr })

		if (user && (await bcrypt.compare(pwd, user.password))) {
			const token = jwt.sign({ usr }, process.env.TOKEN_SECRET, {
				expiresIn: '7d',
			})

			user.token = token

			res.status(201).json(user)
		}

		res.status(400).send({ message: 'Invalid Credentials.' })
	} catch (err) {
		console.error(err)
	}
})

const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token === null) res.status(403).send({ message: 'User not logged in.' })

	try {
		const user = jwt.verify(token, process.env.TOKEN_SECRET)
		req.user = user
	} catch (err) {
		res.status(401).send('Token expired or invalid.')
	}

	next()
}

app.get('/getqr', verifyToken, () => {})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`)
})
