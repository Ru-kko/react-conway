import { ConwayAppError } from ".";
import { auth, store } from "../lib/firebase";
import { User } from "../typings";
import { FireAuthenticationService } from "./impl/fireAuth";

export interface AuthenticationService {
  singUp(user: User, password: string): Promise<User>;
  singIn(email: string, password: string): Promise<User>;
  getUserSession(): Promise<User | null>;
  logOut(): Promise<void>;
  hasSession(): Promise<boolean>;
}

export class BadCredentialsError extends ConwayAppError {
  constructor(cause?: Error) {
    super("The provided credentials are invalid.", { cause: cause });
    this.name = "BadCredentialsError";
  }
}

export const AuthServiceIntance: AuthenticationService = new FireAuthenticationService(auth, store);