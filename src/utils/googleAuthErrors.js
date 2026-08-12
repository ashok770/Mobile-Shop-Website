import { GoogleSignInError } from "../services/googleIdentityService";

export const getGoogleAuthErrorMessage = (error) => {
  if (error instanceof GoogleSignInError) {
    switch (error.code) {
      case "missing_client_id":
        return "Google sign-in is not configured yet. Please try again later.";
      case "script_unavailable":
      case "unavailable":
        return "Google sign-in is unavailable right now. Please try again shortly.";
      case "missing_credential":
        return "Google sign-in did not complete. Please try again.";
      default:
        return "Google sign-in failed. Please try again.";
    }
  }

  if (error?.response?.status === 401) {
    return "Google sign-in could not be verified. Please try again.";
  }

  if (error?.response?.status === 409) {
    return (
      error?.response?.data?.message ||
      "This email is already linked to another sign-in method."
    );
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Network error. Please check your connection and try again.";
  }

  return "Something went wrong while signing in with Google. Please try again.";
};
