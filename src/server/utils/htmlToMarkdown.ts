import { compile } from "html-to-markdown";

export default compile({
  limits: {
    maxDepth: 25,
    maxChildNodes: 500,
  },
});
