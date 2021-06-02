import "regenerator-runtime/runtime";

export function formatDate(string) {
  let dateObject = new Date(string);
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
