import { Query, Resolver } from "@nestjs/graphql";
import { LoggerService } from "../common/logger.service";
import { EthereumService } from "../notary/ethereum.service";

@Resolver()
export class EthereumResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly ethereumService: EthereumService
  ) {}

  @Query("ethereum")
  public async ethereum() {
    this.logger.log("Serving `ethereum` query", EthereumResolver.name);
    const account = await this.ethereumService.account();
    const balance = await this.ethereumService.balance();
    const ethBalance = this.ethereumService.web3
      .fromWei(balance, "ether")
      .toNumber();
    return {
      account,
      balance: ethBalance
    };
  }
}
