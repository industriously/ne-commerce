export const getISOString = (date?: Date) => {
  return (date ?? new Date()).toISOString();
};
