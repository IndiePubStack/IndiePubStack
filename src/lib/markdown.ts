import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
import {getSettings} from "@/lib/settings";
import anchor from "markdown-it-anchor";
import slugify from "slugify";

export const md = MarkdownIt();

md.use(
    await Shiki({
        themes: {
            light: getSettings().codeTheme || 'one-light',
            dark: 'one-dark-pro',
        },
    }),
);

md.use(anchor, {
    slugify: (s) => {return slugify(s, {
        lower: true,
        strict: true,
    })},
    permalink: anchor.permalink.linkInsideHeader({
        symbol: "#",
        placement: "before",
    }),
    level: [1, 2, 3]
});