import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link";

export default function Nav() {

    return (
        <nav className="flex justify-between py-5 items-center font-mono">
            <Link className="block text-3xl font-extrabold text-center" href="/">
                {/*{settings?.publicationName || 'IndiePubStack_'}*/}
                {'IndiePubStack'}
            </Link>

            <Button className={'cursor-pointer'} asChild>
                <Link href="/dashboard/home">Dashboard</Link>
            </Button>

            {/*<NavigationMenuDemo/>*/}
        </nav>
    );
}


export function NavigationMenuDemo() {
    return (
        <div className={'flex items-center justify-center mt-5'}>
            <NavigationMenu viewport={false} >
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/dashboard/home">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/dashboard/posts">Posts</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/dashboard/subscribers">Subscribers</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/dashboard/settings">Settings</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

