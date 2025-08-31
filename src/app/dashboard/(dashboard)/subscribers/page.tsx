"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useQuery} from "@tanstack/react-query";
import {AddSubscriberDialog} from "@/app/dashboard/(dashboard)/subscribers/add-subscriber-dialog";
import {Subscriber} from "@/app/dashboard/(dashboard)/types";
import SubscriberActionsDropdown from "@/app/dashboard/(dashboard)/subscribers/subscriber-actions-dropdown";

export default function Page() {
    const subscribersQuery = useQuery({
        queryKey: ['subscribers'],
        queryFn: async (): Promise<Subscriber[]> => {
            return await fetch('/api/subscribers', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                },
            )
                .then((res) =>
                    res.json(),
                )
        },
    })

    return (<>
        <div className={"flex justify-between items-center font-mono mt-10"}>
            <h1 className={"text-2xl font-bold"}>Subscribers</h1>

            <AddSubscriberDialog variant="default" />
        </div>

        <Table className={'mt-10 flex-grow'}>
            <TableHeader>
                <TableRow className={'font-mono'}>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className={'w-0'}></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {subscribersQuery.data && subscribersQuery.data.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                        <TableCell >{subscriber.id}</TableCell>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>{subscriber.createdAt}</TableCell>
                        <TableCell className={'text-right'}>
                            <SubscriberActionsDropdown subscriber={subscriber} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table></>)
}