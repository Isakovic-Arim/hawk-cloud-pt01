'use client'

import { useSupabase } from "@/components/supabase-provider";
import io from 'socket.io-client';
import { User } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TerminalComponent from '@/components/Terminal';

function Dashboard() {
    const { supabase } = useSupabase();
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const [servers, setServers] = useState([]);

    useEffect(() => {
        getUser();
        getServers().then(data => setServers(data));

        fetch('/api/socket');
        const socket = io("http://localhost:3001");

        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socket.on("dockerEvent", (data) => {
            // Update the UI with the new information
            getServers().then(data => setServers(data));
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    const getUser = async () => {
        const session = await supabase.auth.getSession();
        if (session.data.session !== null && session.data.session !== undefined) {
            setUser(session.data.session.user);
        } else {
            router.push('/login');
        }
    }

    const getServers = async () => {
        return await fetch('http://localhost:2375/containers/json?all=true')
            .then(response => response.json());
    }

    return user === undefined ? <p>Loading...</p> : <div className="p-4 m-4 border-2 rounded-lg">
        {/* <TerminalComponent></TerminalComponent> */}
        <table className="w-full h-1/2 table-fixed">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{
                servers.map(server => {
                    return <Server key={server.Id} name={server.Names[0]} image={server.Image} status={server.State} />
                })
            }</tbody>
        </table>
    </div>
}

function Server({ name, image, status }) {
    const router = useRouter();
    const handleAction = async (name: string, action: string) => {
        await fetch(`http://localhost:2375/containers${name}/${action}`, {
            method: 'POST'
        });
        router.refresh();
    }

    const handleAttach = async (name: string) => {
        await fetch('/api/docker/attach', {
            method: 'POST',
            body: JSON.stringify({ "name": name })
        });
        router.refresh();
    }

    return <tr className="text-center border-t">
        <td className="p-4">{name.substring(1)}</td>
        <td className="p-4">{image}</td>
        <td className="p-4"><div className={`w-4 h-4 m-auto ${status === 'running' ? "bg-green-500" : "bg-gray-500"} rounded-full`} /></td>
        <td><button onClick={() => handleAction(name, status === 'running' ? 'stop' : 'start')}>{status === 'running' ? 'Stop' : 'Start'}</button></td>
        {status === 'running' &&
            <td><Image className="cursor-pointer" alt="terminal-icon" src={'/svgs/terminal.svg'} width='30' height='30' onClick={() => handleAttach(name)} /></td>}
    </tr>
}

export default Dashboard;