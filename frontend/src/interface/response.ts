export interface ServerResponse {
  success: boolean;
  message: string;
  error?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
