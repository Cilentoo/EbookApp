interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: number;
  context?: any;
}

const MAX_LOGS = 100;
let errorLogs: ErrorLog[] = [];

export const logError = (error: Error, context?: any) => {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: Date.now(),
    context
  };

  errorLogs.unshift(errorLog);
  if (errorLogs.length > MAX_LOGS) {
    errorLogs = errorLogs.slice(0, MAX_LOGS);
  }

  console.error('Error logged:', errorLog);
};

export const getErrorLogs = (): ErrorLog[] => {
  return [...errorLogs];
};

export const clearErrorLogs = () => {
  errorLogs = [];
};
