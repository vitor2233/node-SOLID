import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { makeFetchUserCheckInsUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQuerychema = z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = checkInHistoryQuerychema.parse(request.query)

    const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsUseCase()

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({ userId: request.user.sub, page })

    return reply.status(200).send({ checkIns })
}