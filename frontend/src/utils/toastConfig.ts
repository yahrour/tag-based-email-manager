export const toastErrorStyle = {
  style: {
    background: "#ff6467",
    color: "white",
    borderColor: "transparent",
  },
};

export const toastSuccessStyle = {
  style: {
    backgroundColor: "#00c951",
    color: "white",
    borderColor: "transparent",
  },
};

export function isValidEmail(email: string | undefined) {
  if (!email) {
    return false;
  }
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email.trim());
}
