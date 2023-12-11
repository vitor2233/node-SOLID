import { beforeEach, describe, expect, it, test } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {

        const { gym } = await sut.execute({
            title: 'Gym JS',
            description: null,
            phone: null,
            latitude: -20.21439,
            longitude: -43.96847
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})