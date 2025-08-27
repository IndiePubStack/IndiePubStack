"use client"

import React, {useEffect, useState} from "react";
import Link from "next/link";

interface TocItem {
    id: string;
    text: string;
    depth: number; // 1 for h2, 2 for h3
}

const TableOfContent: React.FC = () => {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);

    useEffect(() => {
        const contentEl = document.getElementById("blog-content");
        if (!contentEl) return;

        const headings = Array.from(
            contentEl.querySelectorAll("h2, h3")
        ) as HTMLElement[];

        const items: TocItem[] = headings.map((heading) => {
            const anchor = heading.querySelector<HTMLAnchorElement>("a.header-anchor");
            const id = anchor ? anchor.getAttribute("href") || "" : "";
            const text = heading.textContent?.replace("#", "").trim() || "";
            const depth = heading.tagName === "H2" ? 1 : 2;
            return { id, text, depth };
        });

        setTocItems(items);
    }, []);

    return (
        <aside className="fixed top-20 left-20 z-10 hidden lg:block dark:text-white">

            <div className="w-[180px]">
                <nav aria-label="Table of contents" className="text-text-secondary">
                    <ul className="space-y-0">
                        {/* Home link */}
                        <li className="toc-link pb-10">
                            <Link
                                href="/"
                                className="text-text-secondary block py-1 font-medium opacity-50 transition-colors transition-opacity duration-200 ease-out hover:opacity-100"
                                style={{ fontSize: "0.75rem", lineHeight: "1.4" }}
                                aria-label="Return to home page"
                            >
                <span className="flex items-center gap-1.5">
                  <svg
                      width={10}
                      height={10}
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                  >
                    <path
                        d="M5.5 4L1.5 8M1.5 8L5.5 12M1.5 8H10C11.3807 8 12.5 6.88071 12.5 5.5V5.5C12.5 4.11929 11.3807 3 10 3H8.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                  </svg>
                  Home
                </span>
                            </Link>
                        </li>

                        {/* Dynamic TOC */}
                        {tocItems.map((item) => (
                            <li
                                key={item.id}
                                className={`toc-link depth-${item.depth}`}
                            >
                                <a
                                    href={item.id}
                                    className={`block ${
                                        item.depth === 1
                                            ? "py-1 font-medium"
                                            : "py-0.5 pl-3 font-normal"
                                    } text-text-secondary opacity-50 transition-colors transition-opacity duration-200 ease-out hover:opacity-100`}
                                    style={{ fontSize: "0.75rem", lineHeight: "1.4" }}
                                    aria-label={`Jump to section: ${item.text}`}
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default TableOfContent;
