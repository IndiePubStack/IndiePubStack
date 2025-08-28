export function Footer() {
    return (
        <nav className="flex justify-center container mx-auto px-10 py-5 items-center border-t border-gray-200 font-mono mt-10">
            <p className={"block font-mono text-gray-500 text-center"}>
                © 2025 <a className={'underline hover:text-gray-700'}
                          href={"https://indiepubstack.com"}>IndiePubStack</a>. Built with ❤️ by developers.</p>
        </nav>
    );
}

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