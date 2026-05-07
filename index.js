import app from './src/app.js'
import connectDB from './src/common/config/db.js'
import ENV from './src/common/config/env.js'

const PORT = ENV.PORT || 3000

const startServer = async () => {
    await connectDB()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer()
