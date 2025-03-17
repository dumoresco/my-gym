import { PrismaClient } from "@prisma/client";

export class GymClientRepository {
  private prisma = new PrismaClient();

  async findByUserId(userId: string) {
    return await this.prisma.gymClient.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
