import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins'
import { SearchGymUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymUseCase(gymsRepository)
    })

    it('should be able to search gyms', async () => {
        await gymsRepository.create({
            title: 'JS Gym',
            description: null,
            phone: null,
            latitude: -20.21439,
            longitude: -43.96847
        })

        await gymsRepository.create({
            title: 'TS Gym',
            description: null,
            phone: null,
            latitude: -20.21439,
            longitude: -43.96847
        })

        const { gyms } = await sut.execute({
            query: 'TS',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'TS Gym' }),
        ])
    })

    it('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JS Gym ${i}`,
                description: null,
                phone: null,
                latitude: -20.21439,
                longitude: -43.96847
            })
        }

        const { gyms } = await sut.execute({
            query: 'JS',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JS Gym 21' }),
            expect.objectContaining({ title: 'JS Gym 22' })
        ])
    })
})