import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";


export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data
        })

        return checkIn
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const updatedCheckIn = await prisma.checkIn.update({
            where: {
                id: checkIn.id
            },
            data: checkIn
        })

        return updatedCheckIn
    }

    async findById(checkInId: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id: checkInId
            }
        })

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfDay = dayjs(date).startOf('date')
        const endOfDay = dayjs(date).endOf('date')

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfDay.toDate(),
                    lte: endOfDay.toDate()
                }
            }
        })

        return checkIn
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return checkIns
    }

    async countByUserId(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId
            }
        })

        return count
    }
}