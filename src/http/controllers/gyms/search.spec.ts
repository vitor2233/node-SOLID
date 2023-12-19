import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'

describe('Search Gyms (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JS Gym',
                description: 'Description',
                phone: '99999999',
                latitude: -20.21439,
                longitude: -43.96847
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TS Gym',
                description: 'Description',
                phone: '99999999',
                latitude: -20.21439,
                longitude: -43.96847
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                query: 'TS'
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'TS Gym'
            })
        ])
    })
})