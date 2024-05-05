import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page({ params }: { params: { address: string } }) {
    return (
        <div className='mx-10 my-10'>
            <h1 className='text-3xl font-bold'>Create Transaction</h1>
            <div className='flex justify-center'>
                <Card className='w-[500px] mt-32'>
                    <CardHeader>
                        <CardTitle>Create transaction</CardTitle>
                        <CardDescription>
                            Send money to another wallet in a few clicks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid w-full items-center gap-4'>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='from'>From</Label>
                                <Input
                                    id='from'
                                    value={params.address}
                                    disabled
                                />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='to'>To</Label>
                                <Input
                                    id='to'
                                    placeholder='Address of receiver'
                                />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor='amount'>Amount</Label>
                                <Input
                                    id='amount'
                                    placeholder='Amount to send'
                                    type='number'
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className='w-full'>Send</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
