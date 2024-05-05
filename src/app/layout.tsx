import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <div className='w-full h-16 bg-gray-400 text-3xl font-bold flex items-center pl-10'>
                    <Link href='/'>Blockchain Demo</Link>
                    <Link
                        href='/pending-transactions'
                        className='ml-auto pr-10'
                    >
                        <Button className='text-xl'>
                            Pending Transactions
                        </Button>
                    </Link>
                    <Link href='/wallets' className='pr-10'>
                        <Button className='text-xl'>Wallets</Button>
                    </Link>
                </div>
                {children}
            </body>
        </html>
    );
}
