export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function titleCase(label) {
  return (
    label?.charAt(0)?.toUpperCase() +
    label
      ?.slice(1)
      ?.split(/(?=[A-Z])/)
      ?.join("")
  );
}
