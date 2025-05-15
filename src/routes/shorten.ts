import { Hono } from 'hono'
import { AppDataSource } from '../db'
import { Url } from '../entity/Url'

const router = new Hono()


router.post('/urls', async (c) => {
    const { originalUrl } = await c.req.json()

    let shortCode = Math.random().toString(36).substring(2, 8)
    const urlRepo = AppDataSource.getRepository(Url)

    let existing = await urlRepo.findOneBy({ shortCode })
    while (existing) {
        shortCode = Math.random().toString(36).substring(2, 8)
        existing = await urlRepo.findOneBy({ shortCode })
    }

    const url = urlRepo.create({ originalUrl, shortCode })
    await urlRepo.save(url)

    return c.json(url)
})


router.get('/:shortCode', async (c) => {
    const { shortCode } = c.req.param()
    const urlRepo = AppDataSource.getRepository(Url)
    const url = await urlRepo.findOneBy({ shortCode })

    if (!url) return c.text('Not found', 404)

    url.visitCount++
    await urlRepo.save(url)

    return c.redirect(url.originalUrl)
})


router.put('/:shortCode', async (c) => {
    const { shortCode } = c.req.param()
    const { originalUrl } = await c.req.json()
    const urlRepo = AppDataSource.getRepository(Url)
    const url = await urlRepo.findOneBy({ shortCode })

    if (!url) return c.text('Not found', 404)

    url.originalUrl = originalUrl
    await urlRepo.save(url)

    return c.json(url)
})


router.delete('/:shortCode', async (c) => {
    const { shortCode } = c.req.param()
    const urlRepo = AppDataSource.getRepository(Url)
    const url = await urlRepo.findOneBy({ shortCode })

    if (!url) return c.text('Not found', 404)

    await urlRepo.remove(url)

    return c.text('Deleted')
})

export default router
