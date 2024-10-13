import bcrypt from 'bcryptjs';
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  enteredPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
