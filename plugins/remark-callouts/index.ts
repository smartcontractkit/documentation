import { visit } from "unist-util-visit";
export default function remarkCallouts() {
  return (tree, file) => {
    visit(tree, "blockquote", (node) => {
      console.log(node);
    });
  };
}
