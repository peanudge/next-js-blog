import remark from "remark";
import html from "remark-html";
import prism from "remark-prism";

export default async function markdownToHtml(
  markdown: string
): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false }) // https://github.com/sergioramos/remark-prism/issues/265
    .use(prism)
    .process(markdown);

  return result.toString();
}
