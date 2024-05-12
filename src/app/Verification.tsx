"use client";

import { Button } from "@/components/ui/button";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Verification() {
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [valid, setValid] = useState(false);

    async function handleClick() {
        setIsMessageVisible(false);
        const response = await fetch("/api/verify", {
            cache: "no-store",
        });
        const data = await response.json();
        setValid(data.valid);
        setIsMessageVisible(true);
    }

    return (
        <div className='flex items-center space-x-4'>
            <Button onClick={handleClick}>Verify Blockchain</Button>
            {isMessageVisible && valid && (
                <span className='text-lg'>
                    <CheckCircledIcon
                        className='inline-block align-middle mr-1'
                        color='green'
                        width={20}
                        height={20}
                    />
                    Blockchain is valid
                </span>
            )}

            {isMessageVisible && !valid && (
                <span className='text-lg'>
                    <CrossCircledIcon
                        className='inline-block align-middle mr-1'
                        color='red'
                        width={20}
                        height={20}
                    />
                    Blockchain is invalid
                </span>
            )}
        </div>
    );
}
