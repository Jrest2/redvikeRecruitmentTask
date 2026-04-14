import { prisma } from "../../prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../../generated/prisma/client";

export class UserService {
  constructor() {}
  
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
  
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    return prisma.user.create({ data: user });
  }
}
