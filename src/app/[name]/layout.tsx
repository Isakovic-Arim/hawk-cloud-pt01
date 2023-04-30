'use client'

import Link from "next/link"
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Loading from "./loading";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    interface User {
        id: any;
        user_metadata: any;
    }
    const { supabase } = useSupabase();
    const [user, setUser] = useState<User>();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }

    const getUser = async () => {
        const session = await supabase.auth.getSession();
        if (session !== null && session.data !== null && session.data.session !== null && session.data.session.user !== null) {
            setUser(session.data.session.user);
        } else {
            router.push('/login');
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        user === undefined ? <Loading /> :
            <div className="flex justify-evenly w-screen h-screen overflow-hidden p-3">
                <nav className="h-full bg-clip-padding bg-white rounded-xl w-52 p-4" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link className="text-lg text-black mb-2" href={`/${user.id}`}>Dashboard</Link>
                    <Link className="text-lg text-black" href={`/${user.id}/create`}>Create</Link>
                    <div className="flex border-t-2 p-2 border-t-black justify-between mt-auto">
                        <p className="text-black mt-auto">{user.user_metadata.username}</p>
                        <Link href={`/${user.id}/account`}><Image src={'/svgs/navigation/cog.svg'} alt="settings" width='20' height='20' /></Link>
                    </div>
                </nav>
                <div className="w-full">
                    <nav className="w-full h-10 bg-white flex justify-end items-center px-4 m-2 rounded-lg">
                        <Link className="mr-5 flex justify-between items-center w-28 h-7 p-2 bg-white rounded-sm text-black text-lg font-bold" href={`/${user.id}/shell`}>Attach</Link>
                        <button onClick={handleSignOut}><Image src={'/svgs/navigation/logout.svg'} alt='logout' width='20' height='20' /></button>
                    </nav>
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
    );
}