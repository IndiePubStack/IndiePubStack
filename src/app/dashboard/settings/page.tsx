"use client"
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useQuery} from "@tanstack/react-query";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";

export default function Page() {
    const {data: settings} = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Failed to fetch settings');
            return res.json();
        }
    });

    const domain = settings?.domain || '';
    const publicationName = settings?.publicationName || '';
    const resendDomain = settings?.resendDomain || '';
    const resendAudienceId = settings?.resendAudienceId || '';
    const lightCodeTheme = settings?.lightCodeTheme
    const darkCodeTheme = settings?.darkCodeTheme

    return (<>
        <div className={"flex justify-between items-center font-mono mt-10"}>
            <h1 className={"text-2xl font-bold"}>Settings</h1>
        </div>

        <Alert className="mt-6 mb-6">
            <AlertDescription>
                The following settings are managed via environment variables on the server side and cannot be changed through this interface.
            </AlertDescription>
        </Alert>

        <div className="space-y-6 mt-5">


            <div className="grid w-full items-center gap-1.5">
                <Label className={'font-mono'}>Publication Name</Label>
                <Input 
                    value={publicationName} 
                    disabled={true} 
                    className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                    This property is managed via the <Badge variant={'secondary'} className={'font-mono'}>PUBLICATION_NAME</Badge> environment variable on the server side.
                </p>
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label className={'font-mono'}>Light Code Theme</Label>
                <Input
                    value={lightCodeTheme}
                    disabled={true}
                    className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                    This property is managed via the <Badge variant={'secondary'} className={'font-mono'}>LIGHT_CODE_THEME</Badge> environment variable on the server side.
                </p>
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label className={'font-mono'}>Dark Code Theme</Label>
                <Input
                    value={darkCodeTheme}
                    disabled={true}
                    className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                    This property is managed via the <Badge variant={'secondary'} className={'font-mono'}>DARK_CODE_THEME</Badge> environment variable on the server side.
                </p>
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label className={'font-mono'}>Domain</Label>
                <Input
                    value={domain}
                    disabled={true}
                    className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                    This property is managed via the <Badge variant={'secondary'} className={'font-mono'}>DOMAIN</Badge> environment variable on the server side.
                </p>
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label className={'font-mono'}>Resend Domain</Label>
                <Input
                    value={resendDomain}
                    disabled={true}
                    className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                    This property is managed via the <Badge variant={'secondary'} className={'font-mono'}>RESEND_DOMAIN</Badge> environment variable on the server side.
                </p>
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label className={'font-mono'}>Resend Audience ID</Label>
                <Input
                    value={resendAudienceId}
                    disabled={true}
                    className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                    This property is managed via the <Badge variant={'secondary'} className={'font-mono'}>RESEND_AUDIENCE_ID</Badge> environment variable on the server side.
                </p>
            </div>
        </div>
    </>)
}
