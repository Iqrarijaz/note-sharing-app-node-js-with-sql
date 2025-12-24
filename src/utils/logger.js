const DEBUG = process.env.DEBUG === "true";

/**
 * Error logger
 */
export const printError = ({ event, functionName, error }) => {
  if (!DEBUG) return;

  console.error({
    event: event || "*************** Exited function with error ***************",
    functionName,
    error: {
      message: error?.message || "",
      stack: error?.stack || "",
      details: error?.error || ""
    }
  });
};

/**
 * Info logger
 */
export const printLog = (event, functionName, data = null) => {
  if (!DEBUG) return;

  console.info({
    event: `*************** ${event} ***************`,
    functionName,
    data
  });
};
