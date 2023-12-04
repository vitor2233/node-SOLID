import { describe, expect, it, test } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'vitor@email.com'

        const { user } = await registerUseCase.execute({
            name: 'vitor',
            email: email,
            password: '12345'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'vitor',
            email: 'vitor@email.com',
            password: '12345'
        })

        const isPasswordCorrectlyHashed = await compare('12345', user.password_hash)
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'vitor@email.com'

        await registerUseCase.execute({
            name: 'vitor',
            email: email,
            password: '12345'
        })

        await expect(() => registerUseCase.execute({
            name: 'vitor',
            email: email,
            password: '12345'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})