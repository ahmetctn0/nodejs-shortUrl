import 'reflect-metadata'
import { createServer } from 'http'
import { serve, ServerType } from '@hono/node-server'
import { Hono } from 'hono'
import { AppDataSource } from './db'
import shortenRouter from './routes/shorten'

const app = new Hono()

AppDataSource.initialize()
    .then(() => {
        console.log(' Database connected')

        app.get('/', (c) => c.text('URL Shortener API is running!'))

        app.route('/api', shortenRouter)

        const handler: ServerType = serve(app)


        const requestListener =
            (handler as any).handle ||
            (handler as any).requestListener ||
            handler

        const server = createServer((req, res) => {
            requestListener(req, res)
        })

        server.listen(3000, () => {
            console.log(' Server started on http://localhost:3000')
        })
    })
    .catch((error) => {
        console.error('Database connection error:', error)
    })
