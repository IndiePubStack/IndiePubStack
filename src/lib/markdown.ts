import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
import {getSettings} from "@/lib/settings";

export const md = MarkdownIt();

md.use(
    await Shiki({
        themes: {
            light: getSettings().codeTheme || 'one-light'
        },
    }),
);