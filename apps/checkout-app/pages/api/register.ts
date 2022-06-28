import { getClient } from "@/checkout-app/backend/client";
import { NextApiRequest, NextApiResponse } from "next";

import { saleorDomainHeader } from "../../constants";
import { print } from "graphql/language/printer.js";
import {
  CheckWebhooksDocument,
  CheckWebhooksQuery,
  CheckWebhooksQueryVariables,
  CreateWebhooksDocument,
  CreateWebhooksMutation,
  CreateWebhooksMutationVariables,
  TransactionActionRequestSubscriptionDocument,
} from "@/checkout-app/graphql";
import { getBaseUrl } from "@/checkout-app/backend/utils";
import { SALEOR_WEBHOOK_TRANSACTION_ENDPOINT } from "./webhooks/saleor/transaction-action-request";
import { setAuthToken } from "@/checkout-app/backend/environment";

const handler = (
  request: NextApiRequest,
  response: NextApiResponse
): undefined => {
  console.log(request); // for deployment debug pusposes

  const saleorDomain = request.headers[saleorDomainHeader];
  if (!saleorDomain) {
    response
      .status(400)
      .json({ success: false, message: "Missing saleor domain token." });
    return;
  }

  const authToken = request.body?.auth_token as string;
  if (!authToken) {
    response
      .status(400)
      .json({ success: false, message: "Missing auth token." });
    return;
  }

  setAuthToken(authToken);
  const client = getClient({ appToken: authToken });

  const { data, error } = await client
    .query<CheckWebhooksQuery, CheckWebhooksQueryVariables>(
      CheckWebhooksDocument
    )
    .toPromise();

  if (error) {
    console.error("Error while fetching app's webhooks configuration", error);
    response.status(500).json({
      success: false,
      message: "Error while fetching app's webhooks configuration",
    });
    return;
  }

  const webhooks = data?.app?.webhooks ?? [];
  const webhookUrl = getBaseUrl(request) + SALEOR_WEBHOOK_TRANSACTION_ENDPOINT;
  const existingWebhook = webhooks.find(
    (webhook) => webhook.targetUrl === webhookUrl
  );

  if (webhooks.length === 0 && !existingWebhook) {
    const { error } = await client
      .mutation<CreateWebhooksMutation, CreateWebhooksMutationVariables>(
        CreateWebhooksDocument,
        {
          targetUrl: webhookUrl,
          query: print(TransactionActionRequestSubscriptionDocument),
        }
      )
      .toPromise();
    if (error) {
      console.error("Error while adding app's webhooks", error);
      response
        .status(500)
        .json({ success: false, message: "Error while adding app's webhooks" });
      return;
    }
  } else {
    console.log("Webhook creation skipped - webhook already exists");
  }

  response.status(200).json({ success: true });
};

export default handler;
