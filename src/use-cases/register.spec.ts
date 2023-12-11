import { beforeEach, describe, expect, it, test } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async () => {

        const email = 'vitor@email.com'

        const { user } = await sut.execute({
            name: 'vitor',
            email: email,
            password: '12345'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {

        const { user } = await sut.execute({
            name: 'vitor',
            email: 'vitor@email.com',
            password: '12345'
        })

        const isPasswordCorrectlyHashed = await compare('12345', user.password_hash)
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email', async () => {

        const email = 'vitor@email.com'

        await sut.execute({
            name: 'vitor',
            email: email,
            password: '12345'
        })

        await expect(() => sut.execute({
            name: 'vitor',
            email: email,
            password: '12345'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})