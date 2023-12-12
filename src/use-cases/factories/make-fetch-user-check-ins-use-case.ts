import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { GetUserMetricsUseCase } from "../get-user-metrics"
import { FetchUserCheckInsUseCase } from "../fetch-user-check-ins"

export function makeFetchUserCheckInsUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new FetchUserCheckInsUseCase(checkInsRepository)

    return useCase
}