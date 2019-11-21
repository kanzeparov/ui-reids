import "dotenv/config";
import "source-map-support/register";
import yargs from "yargs";
import createLogger from "./log";
import axios from "axios";

const log = createLogger("bin");

const graphqlURL = `http://localhost:${process.env.HTTP_PORT}/graphql`;

yargs
  .command(
    "test",
    "test command",
    {
      // title: {
      //   describe: 'Title of TODO',
      //   demand: true,
      //   alias: 't'
      // }
    },
    () => {
      log.debugJSON("test", {
        ok: true
      });
    }
  )
  .command("checkMeter", "check meter data", {}, async () => {
    await axios.post(graphqlURL, {
      query: `
      mutation {
        checkMeter
      }
      `
    });
    log.debug("task starting");
  })
  .command("notarizationStart", "notarizationStart", {}, async () => {
    await axios.post(graphqlURL, {
      query: `
      query {
        test {
          notarizationStart
        }
      }
      `
    });
    log.debug("task starting");
  })
  .command("notarizationCheck", "notarizationCheck", {}, async () => {
    await axios.post(graphqlURL, {
      query: `
      query {
        test {
          notarizationCheck
        }
      }
      `
    });
    log.debug("task starting");
  })
  .command("checkLastHour", "checkLastHour", {}, async () => {
    await axios.post(graphqlURL, {
      query: `
      mutation {
        checkLastHour
      }
      `
    });
    log.debug("task starting");
  })
  .help()
  .demandCommand()
  .parse();
