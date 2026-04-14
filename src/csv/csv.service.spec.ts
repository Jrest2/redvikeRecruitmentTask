import { CsvService } from "./csv.service";

describe("CsvService", () => {
  let service: CsvService;

  beforeEach(() => {
    service = new CsvService();
  });

  it("parses csv rows using the first row as headers", () => {
    const result = service.parse("name,age\nAlice,30\nBob,25");

    expect(result).toEqual([
      { name: "Alice", age: "30" },
      { name: "Bob", age: "25" },
    ]);
  });

  it("supports quoted values and escaped quotes", () => {
    const result = service.parse('name,notes\n"Alice","Hello, ""world"""');

    expect(result).toEqual([{ name: "Alice", notes: 'Hello, "world"' }]);
  });

  it("supports semicolon-delimited csv files", () => {
    const result = service.parse("id;name\n1;Mitel Networks Corporation\n2;Coherent, Inc.");

    expect(result).toEqual([
      { id: "1", name: "Mitel Networks Corporation" },
      { id: "2", name: "Coherent, Inc." },
    ]);
  });
});
