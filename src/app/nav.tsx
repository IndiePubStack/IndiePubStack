import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link";

import {getKindeServerSession, LoginLink, LogoutLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/server";


export default async function Nav() {


    const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();


    return (
        <nav className="flex justify-between py-5 items-center font-mono border-b border-gray-200">
            <Link className="block text-3xl font-extrabold text-center" href="/">
                {/*{settings?.publicationName || 'IndiePubStack_'}*/}
                {'IndiePubStack'}
            </Link>

            <div className={'flex items-center gap-2.5'}>
                {isUserAuthenticated ? <>
                    <Button className={'cursor-pointer'} size={'lg'} asChild>
                        <Link href="/dashboard/home">Dashboard</Link>
                    </Button>

                    <Button className={'cursor-pointer'} variant={'secondary'} size={'lg'} asChild>
                        <LogoutLink>Log out</LogoutLink>
                    </Button>
                </> : <>
                    <Button asChild variant={'ghost'} size={'lg'}>
                        <LoginLink >Sign in</LoginLink>
                    </Button>
                    <Button asChild size={'lg'}>
                        <RegisterLink>Sign up</RegisterLink>
                    </Button>
                </>}
            </div>
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

