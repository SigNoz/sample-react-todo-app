import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "sample-react-instrumented-app",
    [SemanticResourceAttributes.SERVICE_VERSION]: "10.0.",
  }),
});
const exporter = new OTLPTraceExporter({
  url: "https://ingest.in.signoz.cloud:443/v1/traces",
  headers: {
    "signoz-access-token": "<SIGNOZ_CLOUD_API_KEY>",
  },
});
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      "@opentelemetry/instrumentation-xml-http-request": {
        propagateTraceHeaderCorsUrls: [
          /.+/g, //Regex to match your backend urls. This should be updated.
        ],
      },
      "@opentelemetry/instrumentation-fetch": {
        propagateTraceHeaderCorsUrls: [
          /.+/g, //Regex to match your backend urls. This should be updated.
        ],
      },
      "@opentelemetry/instrumentation-user-interaction": {
        propagateTraceHeaderCorsUrls: [
          /.+/g, //Regex to match your backend urls. This should be updated.
        ],
      },
    }),
  ],
});
