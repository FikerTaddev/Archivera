
export function validateRegister(data: any) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
}

export function validateLogin(data: any) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }
}