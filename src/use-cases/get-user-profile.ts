import { UsersRepository } from "@/repositories/user-repository";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
    userId: string
}
interface GetUserProfileCaseResponse {
    user: User
}
export class GetUserProfileUseCase {
    constructor(
        private usersRepository: UsersRepository
    ) { }

    async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return { user }

    }
}