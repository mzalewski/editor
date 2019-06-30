import TestSection from "./testsection";
import Headline from "./headline";
import VideoHero1 from "./videohero1";
import VideoHero2 from "./videohero2";
import TestSectionPng from "../../../TestSection.png";
const AllBlocks = [
  {
    name: "Test",
    block: TestSection,
    image: TestSectionPng,
    schema: TestSection.EditorProps
  },
  {
    name: "Headline",
    block: Headline,
    image: TestSectionPng,
    schema: TestSection.EditorProps
  },
  {
    name: "Video Hero 1",
    block: VideoHero1,
    image: TestSectionPng,
    schema: TestSection.EditorProps
  },
  {
    name: "Video Hero 2",
    block: VideoHero2,
    image: TestSectionPng,
    schema: TestSection.EditorProps
  }
];
export const getBlockByName = name => {
  const matches = AllBlocks.filter(r => r.name === name);
  if (matches.length) return matches[0];
  return null;
};
export { TestSection, Headline };
export default AllBlocks;
