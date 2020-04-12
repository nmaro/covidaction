import MD from "markdown-it";
import mila from "markdown-it-link-attributes";

const md = MD({
  linkify: true
}).use(mila, {
  attrs: {
    target: "_blank"
  }
});

export const Markdown = ({ content }: { content: string }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: md.render(content)
    }}
  />
);
