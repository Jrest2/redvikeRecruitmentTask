import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AmenityService } from "./amenity.service";
import { CreateAmenityDto } from "./dto/create-amenity.dto";
import { UpdateAmenityDto } from "./dto/update-amenity.dto";

@ApiTags("amenity")
@ApiBearerAuth()
@Controller("amenity")
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @ApiOperation({ summary: "Create amenity" })
  @ApiResponse({ status: 201, description: "Amenity created successfully" })
  async create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenityService.create(createAmenityDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all amenities" })
  @ApiResponse({ status: 200, description: "Amenities fetched successfully" })
  async findAll() {
    return this.amenityService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get amenity by id" })
  @ApiResponse({ status: 200, description: "Amenity fetched successfully" })
  async findOne(@Param("id") id: string) {
    return this.amenityService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update amenity by id" })
  @ApiResponse({ status: 200, description: "Amenity updated successfully" })
  async update(
    @Param("id") id: string,
    @Body() updateAmenityDto: UpdateAmenityDto,
  ) {
    return this.amenityService.update(id, updateAmenityDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete amenity by id" })
  @ApiResponse({ status: 200, description: "Amenity deleted successfully" })
  async remove(@Param("id") id: string) {
    return this.amenityService.remove(id);
  }
}
