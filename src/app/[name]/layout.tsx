'use client'

import Link from "next/link"
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    const { supabase } = useSupabase();
    const [user, setUser] = useState<string>();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }

    const getUser = async () => {
        const session = await supabase.auth.getSession();
        if (session.data.session !== null && session.data.session !== undefined) {
            setUser(session.data.session.user.user_metadata.username);
        } else {
            router.push('/login');
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        user === undefined ? <p>Loading...</p> :
            <div className="flex justify-evenly w-screen h-screen overflow-hidden p-3">
                <nav className="h-full bg-clip-padding bg-gray-900 rounded-xl w-52 p-4" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link className="text-lg mb-2" href={`/${user}`}>Dashboard</Link>
                    <Link className="text-lg" href={`/${user}/create`}>Create</Link>
                    <div className="flex border-t-2 p-2 border-t-white justify-between mt-auto">
                        <p className="mt-auto">{user}</p>
                        <button onClick={handleSignOut}><Image src={'/svgs/logout.svg'} alt='logout' width='20' height='20' /></button>
                    </div>
                </nav>
                <div className="w-full">
                    {children}
                </div>
            </div>
    );
}