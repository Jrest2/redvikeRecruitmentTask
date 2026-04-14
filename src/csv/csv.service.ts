import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class CsvService {
  parse(content: string) {
    const normalizedContent = content.replace(/^\uFEFF/, "");

    if (normalizedContent.trim().length === 0) {
      return [];
    }

    const delimiter = this.detectDelimiter(normalizedContent);

    return this.parseToObjects(normalizedContent, delimiter);
  }

  private detectDelimiter(content: string) {
    let inQuotes = false;
    let semicolonCount = 0;
    let commaCount = 0;

    for (let index = 0; index < content.length; index += 1) {
      const character = content[index];
      const nextCharacter = content[index + 1];

      if (character === '"') {
        if (inQuotes && nextCharacter === '"') {
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (!inQuotes && (character === "\n" || character === "\r")) {
        break;
      }

      if (!inQuotes && character === ";") {
        semicolonCount += 1;
      }

      if (!inQuotes && character === ",") {
        commaCount += 1;
      }
    }

    return semicolonCount > commaCount ? ";" : ",";
  }

  private parseToObjects(content: string, delimiter: "," | ";") {
    const result: Record<string, string>[] = [];
    let headers: string[] | null = null;
    let currentRow: string[] = [];
    let currentCell = "";
    let inQuotes = false;

    const pushCell = () => {
      currentRow.push(currentCell);
      currentCell = "";
    };

    const pushRow = () => {
      if (!currentRow.some((cell) => cell.trim().length > 0)) {
        currentRow = [];
        return;
      }

      if (!headers) {
        headers = currentRow;
        if (headers.length === 0) {
          throw new BadRequestException("CSV headers are required");
        }
        currentRow = [];
        return;
      }

      const entry = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = currentRow[index] ?? "";
        return acc;
      }, {});

      result.push(entry);
      currentRow = [];
    };

    for (let index = 0; index < content.length; index += 1) {
      const character = content[index];
      const nextCharacter = content[index + 1];

      if (character === '"') {
        if (inQuotes && nextCharacter === '"') {
          currentCell += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (character === delimiter && !inQuotes) {
        pushCell();
        continue;
      }

      if ((character === "\n" || character === "\r") && !inQuotes) {
        if (character === "\r" && nextCharacter === "\n") {
          index += 1;
        }
        pushCell();
        pushRow();
        continue;
      }

      currentCell += character;
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      pushCell();
      pushRow();
    }

    if (!headers) {
      throw new BadRequestException("CSV headers are required");
    }

    return result;
  }
}
