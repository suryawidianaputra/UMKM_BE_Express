export const withoutpassword = (data) => {
  if (!data) return null;

  const { password, ...userWithoutPassword } = data;
  return userWithoutPassword;
};
