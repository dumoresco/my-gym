import { GymClient } from "@prisma/client";
import { prismaClient } from "../../libs/prismaClient";
import { validate as validateUUID } from "uuid";

import { UserNotFound } from "../../errors/UserNotFound";
import { InvalidFormatUUID } from "../../errors/InvalidFormatUUID";
import { GymClientRepository } from "../../repositories/GymClientRepository";
interface IInputGetGymMetricsUseCase {
  userId: string;
  month: number;
  year: number;
}

interface IOutputGetGymMetricsUseCase {
  activeClients: number;
  inactiveClients: number;
  monthlyRevenue: number;
  defaultedClients: number;
}

export class GetGymMetricsUseCase {
  constructor(private gymClientRepository: GymClientRepository) {}

  async execute({
    userId,
    month,
    year,
  }: IInputGetGymMetricsUseCase): Promise<IOutputGetGymMetricsUseCase> {
    const isValidUUID = validateUUID(userId);

    if (!isValidUUID) {
      throw new InvalidFormatUUID();
    }

    const userExists = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new UserNotFound();
    }

    const gymClients = await this.gymClientRepository.findByUserId(userId);

    const activeClients = gymClients.filter(
      (client) => client.status === "ACTIVE"
    );

    const inactiveClients = gymClients.filter(
      (client) => client.status === "INACTIVE" || client.status === "SUSPENDED"
    ).length;

    const monthlyRevenue = await this.calculateMonthlyRevenue(
      activeClients,
      month,
      year
    );

    const inadimplentes = await this.calculateInadimplentes(
      activeClients,
      month,
      year
    );

    return {
      activeClients: activeClients.length,
      inactiveClients,
      monthlyRevenue: monthlyRevenue,
      defaultedClients: inadimplentes,
    };
  }

  private async calculateMonthlyRevenue(
    activeClients: GymClient[],
    month: number,
    year: number
  ): Promise<number> {
    let revenue = 0;

    for (const client of activeClients) {
      const lastPaymentDate = client.subscriptionLastPayment;
      console.log("lastPaymentDate", lastPaymentDate);
      if (lastPaymentDate) {
        const paymentDate = new Date(lastPaymentDate);

        if (
          paymentDate.getMonth() + 1 == month &&
          paymentDate.getFullYear() == year
        ) {
          const subscription = await prismaClient.subscription.findUnique({
            where: { id: client.subscriptionId },
          });

          if (subscription) {
            revenue += subscription.price;
          }
        }
      }
    }

    return revenue;
  }

  private async calculateInadimplentes(
    activeClients: GymClient[],
    month: number,
    year: number
  ): Promise<number> {
    let inadimplentes = 0;

    for (const client of activeClients) {
      const lastPaymentDate = client.subscriptionLastPayment;
      const paymentStatus = client.paymentStatus;
      if (
        !lastPaymentDate ||
        ((new Date(lastPaymentDate).getMonth() + 1 !== month ||
          new Date(lastPaymentDate).getFullYear() !== year) &&
          (paymentStatus === "PENDING" || paymentStatus === "UNPAID"))
      ) {
        inadimplentes++;
      }
    }

    return inadimplentes;
  }
}
