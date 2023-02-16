export function invalidDataError(details) {
  return {
    name: "InvalidDataError",
    message: "Invalid data",
    details,
  };
}
