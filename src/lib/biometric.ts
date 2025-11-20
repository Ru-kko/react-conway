import * as LocalAuthentication from 'expo-local-authentication';

const checkBiometrics = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();

  return compatible && enrolled;
};

const validateBiometric = async () => {
  if (!(await checkBiometrics())) {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Use your biometric to authenticate",
    fallbackLabel: "Use Password",
  });

  return result.success;
};

export { validateBiometric, checkBiometrics };