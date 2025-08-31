import { Button } from "@/components/ui/button";
import Link from "next/link";

import {getKindeServerSession, LoginLink, LogoutLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/server";
import {getSettings} from "@/lib/settings";
import {isAdmin} from "@/lib/utils";
import {ModeToggle} from "@/components/theme-provider";

export default async function Nav() {
    const {isAuthenticated, getRoles} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    const roles = await getRoles() || [];

    const settings = getSettings();

    return (
        <nav className="flex justify-between py-5 items-center font-mono border-b cursor-pointer">
            <Link className="block text-3xl font-extrabold text-center" href="/">
                {settings.publicationName}
            </Link>

            <div className={'flex items-center gap-2.5'}>

                <ModeToggle/>

                {isUserAuthenticated ? <>

                {isAdmin(roles) && <Button className={'cursor-pointer'} size={'lg'} asChild>
                    <Link href="/dashboard/home">Dashboard</Link>
                </Button>}

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
