import React from "react";

export function FooterPublic() {
    return (
        <nav className="prose dark:prose-invert flex justify-between container py-2.5 items-center font-mono border-t-1">
            <div className={"block font-mono text-sm"}>
                 Powered by <a className={'underline '}
                          href={"https://indiepubstack.com"}>IndiePubStack</a> </div>
            <div className={"font-mono text-sm"}>© 2025</div>
        </nav>
    );
}

export function DashboardFooter() {
    return (
        <nav className="flex justify-center container mx-auto px-10 py-5 items-center border-t font-mono mt-10 text-sm text-muted-foreground">
            <p className={"block font-mono text-center"}>
                © 2025 <a className={'underline '}
                          href={"https://indiepubstack.com"}>IndiePubStack</a>. Built with ❤️ by developers.</p>
        </nav>
    );
}