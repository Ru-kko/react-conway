export class ConwayAppError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ConwayAppError";
  }
}