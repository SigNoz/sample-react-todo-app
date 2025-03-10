import { trace } from "@opentelemetry/api";

export function onError(error, info) {
  console.log(error, info);
  const tracer = trace.getTracer("error-tracer");
  const currentSpan = trace.getActiveSpan();

  console.log(currentSpan);

  if (currentSpan) {
    const span = tracer.startSpan("error-handler", {
      parent: currentSpan,
    });

    span.setAttribute("error.type", error.name);
    span.setAttribute("error.message", error.message);
    span.setAttribute("error.stack", error.stack);
    span.setAttribute("react.component.stack", info.componentStack);

    span.setStatus({
      code: 2, // ERROR
      message: error.message,
    });

    span.end();
  }
}
