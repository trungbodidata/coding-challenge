export interface AppErrorDetail {
  code: string;
  message: string;
  field: string;
}

export default interface AppError {
  error: string;
  message: string;
  errorDetails?: AppErrorDetail[];
}
