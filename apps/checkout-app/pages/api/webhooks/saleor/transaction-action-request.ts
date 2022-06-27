import { ADYEN_PAYMENT_PREFIX } from "@/checkout-app/backend/payments/providers/adyen";
import { MOLLIE_PAYMENT_PREFIX } from "@/checkout-app/backend/payments/providers/mollie";
import { getMollieClient } from "@/checkout-app/backend/payments/providers/mollie/utils";
import { TransactionActionPayloadFragment } from "@/checkout-app/graphql";
import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import contentType from "content-type";
import { isValidSaleorRequest } from "@/checkout-app/backend/saleor/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
  const buf = await getRawBody(req, {
    length: req.headers["content-length"],
    limit: "1mb",
  });

  const signature = req.headers["saleor-signature"];

  if (typeof signature !== "string" || signature.length === 0) {
    res.status(401).end("Unathorized");
    console.error("No Saleor signature present in request");
    return;
  }

  if (!(await isValidSaleorRequest(buf, signature))) {
    res.status(401).end("Unauthorized");
    console.error("Invalid Saleor signature", signature);
    return;
  }

  let body: TransactionActionPayloadFragment;

  try {
    body = JSON.parse(buf.toString());
  } catch (e) {
    res.status(400).end("Request data is not valid JSON");
    return;
  }

  const { transaction, action } = body;

  if (action.actionType === "REFUND") {
    if (!transaction?.type || !transaction.reference || !action.amount) {
      throw new Error("");
    }

    const refund: TransactionRefund = {
      id: transaction.reference,
      amount: action.amount,
      currency: transaction.authorizedAmount.currency,
    };

    try {
      if (transaction.type.includes(MOLLIE_PAYMENT_PREFIX)) {
        await handleMolieRefund(refund);
      }
      if (transaction.type.includes(ADYEN_PAYMENT_PREFIX)) {
        await handleAdyenRefund(refund);
      }
    } catch (e) {
      res.status(500).send("Error while processing refund");
      return;
    }
  }

  res.status(200).send("ok");
}

type TransactionRefund = {
  id: string;
  amount: string;
  currency: string;
};

async function handleMolieRefund(refund: TransactionRefund) {
  const mollieClient = await getMollieClient();
  const { id, amount, currency } = refund;

  debugger;
  await mollieClient.payments_refunds.create({
    paymentId: id,
    amount: {
      value: amount,
      currency,
    },
  });
}

async function handleAdyenRefund(refund: TransactionRefund) {
  throw new Error("Not implemented");
}