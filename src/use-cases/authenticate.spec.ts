import { beforeEach, describe, expect, it, test } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        const email = 'vitor@email.com'

        await usersRepository.create({
            name: 'vitor',
            email: email,
            password_hash: await hash('12345', 6)
        })

        const { user } = await sut.execute({
            email: email,
            password: '12345'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(sut.execute({
            email: 'vitor@email.com',
            password: '12345'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'vitor',
            email: 'vitor@email.com',
            password_hash: await hash('12345', 6)
        })

        await expect(sut.execute({
            email: 'vitor@email.com',
            password: '123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})