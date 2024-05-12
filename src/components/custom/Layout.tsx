import { Button } from "../ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className='w-full h-16 bg-gray-400 text-3xl font-bold flex items-center pl-10'>
                <a href='/'>Blockchain Demo</a>
                <a href='/pending-transactions' className='ml-auto pr-10'>
                    <Button className='text-xl'>Pending Transactions</Button>
                </a>
                <a href='/wallets' className='pr-10'>
                    <Button className='text-xl'>Wallets</Button>
                </a>
            </div>
            {children}
        </>
    );
}
