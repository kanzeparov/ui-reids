import { Injectable } from "@nestjs/common";
import { LoggerService } from "../common/logger.service";
import { ConfigService } from "../config/config.service";
import imaps from "imap-simple";
import fs from "fs";

@Injectable()
export class EmailParseService {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {}

  public async startParsing() {
    this.logger.log("start Parsing");
    const configImap = {
      imap: {
        user: this.configService.MAIL_USER,
        password: this.configService.MAIL_PASSWORD,
        host: this.configService.MAIL_HOST,
        port: 993,
        tls: true,
        authTimeout: 10000
      }
    };

    const connection = await imaps.connect(configImap);
    await connection.openBox("INBOX");

    const delay = 20 * 24 * 3600 * 1000;
    let yesterday: any = new Date();
    yesterday.setTime(Date.now() - delay);
    yesterday = yesterday.toISOString();
    const searchCriteria = ["UNSEEN", ["SINCE", yesterday]];
    const fetchOptions = {
      bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
      struct: true,
      markSeen: true
    };
    const messages = await connection.search(searchCriteria, fetchOptions);

    let attachments: any = [];

    messages.forEach((message: any) => {
      const parts = imaps.getParts(message.attributes.struct);
      attachments = attachments.concat(
        parts
          .filter(function(part) {
            return (
              part.disposition &&
              part.disposition.type.toUpperCase() === "ATTACHMENT"
            );
          })
          .map(part => {
            // retrieve the attachments only of the messages with attachments
            return connection.getPartData(message, part).then(partData => {
              return {
                filename: part.disposition.params.filename,
                data: partData
              };
            });
          })
      );
    });
    const attachmentsData: any = await Promise.all(attachments);
    for (const attachment of attachmentsData) {
      fs.writeFileSync(`./xml/${attachment.filename}`, attachment.data);
      this.logger.log(`saved ${attachment.filename}`);
    }
    connection.end();

    this.logger.log("end Parsing");
  }
}
