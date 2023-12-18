import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'

describe('Create check-in (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'JS Gym',
                description: 'Description',
                phone: '99999999',
                latitude: -20.21439,
                longitude: -43.96847
            }
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-in`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -20.21439,
                longitude: -43.96847
            })

        expect(response.statusCode).toEqual(201)
    })
})