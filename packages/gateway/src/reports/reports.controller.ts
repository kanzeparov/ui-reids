import { Controller, Get, Header, Param, Res } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { Response } from "express";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get(":filename")
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  async download(@Param("filename") filename: string, @Res() res: Response) {
    const stream = await this.reportsService.readReport(filename);
    stream.pipe(res);
  }
}
