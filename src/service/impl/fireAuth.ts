import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, Firestore, getDoc, setDoc } from "firebase/firestore";
import { User } from "../../typings";
import { AuthenticationService, BadCredentialsError, ConwayAppError } from "..";
import { FirebaseError } from "firebase/app";

const UsersCollection = "users";

const RegisterErors: Record<string, string> = {
  'auth/invalid-password': 'The password is invalid or too weak.',
  'auth/email-already-exists': 'The email address is already in use by another account.',
  'auth/invalid-email': 'The email address is not valid.',
}

export class FireAuthenticationService implements AuthenticationService {
  constructor(private auth: Auth, private fireStore: Firestore) {}

  async singIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      
      const docRef = doc(this.fireStore, UsersCollection, firebaseUser.uid);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        throw new BadCredentialsError();
      }
      
      const data = snap.data();
      return {
        email: data.email,
        username: data.username,
      };
    } catch (error: FirebaseError | any) {
      if (error instanceof ConwayAppError) {
        throw error;
      }

      if (error.code === 'auth/invalid-credential') {
        throw new BadCredentialsError();
      }

      console.error("Error during sign in:", error);
      throw new ConwayAppError("An unexpected error occurred during sign in.", error);
    }
  }

  async singUp(user: User, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        password
      );
      const persisted = userCredential.user;
  
      await setDoc(doc(this.fireStore, UsersCollection, persisted.uid), {
        username: user.username,
        email: user.email,
      });
      return user;
    } catch (error: FirebaseError | any) {
      if (error instanceof ConwayAppError) {
        throw error;
      }
      
      const message = RegisterErors[error.code] || "An unexpected error occurred during registration.";
      console.error("Error during user registration:", error);
      throw new ConwayAppError(message, error);
    }
  }

  async getUserSession(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (firebaseUser) => {
        if (!firebaseUser) {
          resolve(null);
          return;
        }

        const docRef = doc(this.fireStore, UsersCollection, firebaseUser.uid);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          resolve(null);
          return;
        }

        const data = snap.data();
        resolve({
          email: data.email,
          username: data.username,
        });
      });
    });
  }

  async logOut(): Promise<void> {
    await signOut(this.auth);
  }

  hasSession(): Promise<boolean> {
    return Promise.resolve(this.auth.currentUser !== null);
  }
}
