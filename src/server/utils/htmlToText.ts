import { compile } from "html-to-text";

export default compile({
  limits: {
    maxDepth: 25,
    maxChildNodes: 500,
  },
});
