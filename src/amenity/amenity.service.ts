import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "../prisma/prisma.service";
import { CreateAmenityDto } from "./dto/create-amenity.dto";
import { UpdateAmenityDto } from "./dto/update-amenity.dto";

@Injectable()
export class AmenityService {
  constructor() {}

  async create(createAmenityDto: CreateAmenityDto) {
    return prisma.amenity.create({
      data: createAmenityDto,
      include: {
        reservations: true,
      },
    });
  }

  async findAll() {
    return prisma.amenity.findMany({
      include: {
        reservations: true,
      },
    });
  }

  async findOne(id: string) {
    const amenity = await prisma.amenity.findUnique({
      where: { id },
      include: {
        reservations: true,
      },
    });

    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }

    return amenity;
  }

  async update(id: string, updateAmenityDto: UpdateAmenityDto) {
    await this.findOne(id);

    return prisma.amenity.update({
      where: { id },
      data: updateAmenityDto,
      include: {
        reservations: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return prisma.amenity.delete({
      where: { id },
      include: {
        reservations: true,
      },
    });
  }
}
