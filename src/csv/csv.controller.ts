import {
  BadRequestException,
  Controller,
  FileValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CsvService } from "./csv.service";

class CsvFileValidator extends FileValidator {
  buildErrorMessage(): string {
    return "Only CSV files are allowed";
  }

  isValid(
    file?:
      | { mimetype?: string; originalname?: string }
      | { mimetype?: string; originalname?: string }[]
      | Record<string, { mimetype?: string; originalname?: string }[]>,
  ): boolean {
    if (!file || Array.isArray(file)) {
      return false;
    }

    if ("mimetype" in file || "originalname" in file) {
      const mimeType =
        typeof file.mimetype === "string" ? file.mimetype.toLowerCase() : "";
      const fileName =
        typeof file.originalname === "string"
          ? file.originalname.toLowerCase()
          : "";

      return (
        ["text/csv", "application/csv", "text/plain"].includes(mimeType) &&
        fileName.endsWith(".csv")
      );
    }

    return false;
  }
}

@ApiTags("csv")
@ApiBearerAuth()
@Controller("csv")
@UseGuards(JwtAuthGuard)
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post("parse")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({ summary: "Parse CSV file to JSON" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
      required: ["file"],
    },
  })
  @ApiResponse({ status: 201, description: "CSV parsed successfully" })
  async parse(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 20 * 1024 * 1024,
            message: "File size must not exceed 20 MB",
          }),
          new CsvFileValidator({}),
        ],
      }),
    )
    file?: { buffer: Buffer; mimetype?: string; originalname?: string },
  ) {
    if (!file) {
      throw new BadRequestException("CSV file is required");
    }

    return this.csvService.parse(file.buffer.toString("utf-8"));
  }
}
