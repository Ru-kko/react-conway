import { create } from "zustand";
import { checkBiometrics, validateBiometric } from "../lib/biometric";
import { AuthServiceIntance, ConwayAppError } from "../service";
import { User } from "../typings";


export interface AuthState {
  user: User | null;
  canUseBiometrics: boolean;
  error: string | null;
}

interface AuthStore extends AuthState {
  load(): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, username: String): Promise<void>;
  signOutUser(): Promise<void>;
  clearError(): void;
}

const getStoredUser = async (): Promise<User | null> => {
  const stored = AuthServiceIntance.hasSession();
  if (!stored) {
    return null;
  }

  const valid = await validateBiometric();

  if (!valid) {
    return null;
  }
  const user = await AuthServiceIntance.getUserSession();
  return user;
}

const useSessionStore = create<AuthStore>((set, get) => ({
  user: null,
  canUseBiometrics: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      const user = await AuthServiceIntance.singIn(email, password);
      set({ user });
    } catch (error: any) {
      if (error instanceof ConwayAppError) {
        set({ error: error.message });
        return;
      }
      set({ error: "An unexpected error occurred. Please try again." });
    }
  },

  signUp: async (email: string, password: string, username: string) => {
    try {
      const user =  await AuthServiceIntance.singUp({ email, username }, password);
      set({ user });
    } catch (error: any) {
      if (error instanceof ConwayAppError) {
        set({ error: error.message });
        return;
      }
      set({ error: "An unexpected error occurred. Please try again." });
    }
  },

  signOutUser: async () => {
    await AuthServiceIntance.logOut();
    set({ user: null });
  },

  load: async () => {
    const canUse = await checkBiometrics();
    set({ canUseBiometrics: canUse });
  },

  validateBiometricSession: async () => {
    if (!get().canUseBiometrics) {
      return;
    }
    const user = await getStoredUser();
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export { useSessionStore };