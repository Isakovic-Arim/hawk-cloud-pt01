'use client'

import { useSupabase } from "@/components/supabase-provider";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Account() {
    const [user, setUser] = useState<User>();
    const { supabase } = useSupabase();
    
    const router = useRouter();

    const getUser = async () => {
        const session = await supabase.auth.getSession();
        if (session.data.session !== null && session.data.session !== undefined) {
            setUser(session.data.session.user);
        } else {
            router.push('/login');
        }
    }

    useEffect(() => {
        getUser();
    });

    return <div className='w-full h-full p-5'>
        <h1 className="text-3xl mb-10">Account Settings</h1>
        <div>
            <h2 className="text-2xl inline-block mr-5">Username:</h2>
            <p className="w-fit text-2xl bg-white text-black p-1 rounded-md">{user?.user_metadata.username}</p>
        </div>
        <div>
            <h2 className="text-2xl inline-block mr-5">E-Mail:</h2>
            <p className="w-fit text-2xl bg-white text-black p-1 rounded-md">{user?.email}</p>
        </div>
    </div>;
}

export default Account;