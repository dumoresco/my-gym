import { GymClient } from "@prisma/client";
import { GymClientRepository } from "../../repositories/GymClientRepository";

export class ListGymClientsUseCase {
  constructor(private gymClientRepository: GymClientRepository) {}

  async execute(userId: string): Promise<GymClient[]> {
    const gymClients = await this.gymClientRepository.findByUserId(userId);

    if (!gymClients) {
      return [];
    }

    return gymClients;
  }
}
