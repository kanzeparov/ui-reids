import HDWalletProvider from "@machinomy/hdwallet-provider";
// import * as contracts from "@mpp/contracts";
import { Injectable } from "@nestjs/common";
import { BigNumber } from "bignumber.js";
import * as util from "ethereumjs-util";
import * as moment from "moment";
import Web3 from "web3";
import { LoggerService } from "../common/logger.service";
import { ConfigService } from "../config/config.service";

@Injectable()
export class EthereumService {
  public readonly web3: Web3;
  public readonly provider: HDWalletProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    const mnemonic = configService.mnemonic;
    const infuraUrl = configService.infuraUrl;
    this.provider = HDWalletProvider.http(mnemonic, infuraUrl);
    this.web3 = new Web3(this.provider);
  }

  public async account(): Promise<string> {
    this.logger.log("Getting account", EthereumService.name);
    return this.provider.getAddress(0);
  }

  public async addNotarization(
    digest: Buffer,
    startOfDay: moment.Moment
  ): Promise<string> {
    // this.logger.debug("addNotarization");
    // const timestamp = startOfDay.valueOf() / 1000;
    // const contract = await this.contract();
    // this.logger.debug("addNotarization 2");
    // const sender = await this.account();
    // const tx = await contract.addTimestamp(util.bufferToHex(digest), timestamp, {
    //   from: sender,
    // });
    // return tx.tx;
    return "";
  }

  public async balance(): Promise<BigNumber> {
    const address = await this.account();
    this.logger.log(
      `Getting balance for account ${address}`,
      EthereumService.name
    );
    return new Promise<BigNumber>((resolve, reject) => {
      this.web3.eth.getBalance(address, (err, result) => {
        err ? reject(err) : resolve(result);
      });
    });
  }

  // private async contract(): Promise<contracts.Notary.Contract> {
  //   // return contracts.Notary.contract(this.provider).deployed();
  // }
}
