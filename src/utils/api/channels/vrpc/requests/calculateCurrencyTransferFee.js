import BigNumber from "bignumber.js";
import VrpcProvider from "../../../../vrpc/vrpcInterface"
import { getCurrency } from "../../verusid/callCreators";
import { coinsToSats } from "../../../../math";

export const calculateCurrencyTransferFee = async (coinObj, currency, exportto, convertto, feecurrency, via) => {
  const systemId = coinObj.system_id;

  if (feecurrency !== systemId) throw new Error("Fee currencies different from system not yet supported.");

  if (exportto == null) {
    return "25000";
  } else {
    const { error, result: destinationSystem } = await getCurrency(coinObj, exportto);

    if (error) throw new Error(error.message);

    const { bestcurrencystate, transactionimportfee } = destinationSystem;
    
    if (bestcurrencystate == null || transactionimportfee == null) {
      throw new Error("Insufficient information to calculate fee.");
    }

    const { currencies } = bestcurrencystate;

    if (!currencies[feecurrency]) throw new Error("Cannot pay fee with " + feecurrency + ".");

    const sendCurrencyResponse = await VrpcProvider.getEndpoint(systemId).sendCurrency("*", [{
      currency,
      amount: 0,
      exportto,
      convertto,
      via,
      address: destinationSystem.currencyid
    }], 1, 0.0001, true);

    if (sendCurrencyResponse.error) throw new Error(sendCurrencyResponse.error.message);

    const feeamount = sendCurrencyResponse.result.outputtotals[feecurrency];

    if (feeamount) return (coinsToSats(BigNumber(feeamount)).toString())
    else throw new Error("Couldn't find fee amount.")
  }
}