import Background1 from "./background1";
const AllStyles = [
  {
    name: "Angled",
    style: Background1,
    category: "background"
  }
];

export const getStyleByName = name => {
  const matches = AllStyles.filter(r => r.name === name);
  if (matches.length) return matches[0];
  return null;
};
export default AllStyles;
