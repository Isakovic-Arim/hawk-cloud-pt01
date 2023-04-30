'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

type Inputs = {
    username: string,
    password: string,
    email: string
};

export default function Register() {
    const [hide, setHide] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { supabase } = useSupabase();
    const router = useRouter();

    const onSubmit: SubmitHandler<Inputs> = async data => {
        await supabase.auth.signUp({
            password: data.password,
            email: data.email,
            options: {
                data: { username: data.username },
                emailRedirectTo: 'http://localhost:3000/login'
            }
        })
        router.push(`/verify`);
    };

    const handleHide = () => {
        setHide(!hide);
    }

    return (
        <div className='h-screen grid place-items-center'>
            <form className='grid place-items-center' onSubmit={handleSubmit(onSubmit)}>
                <input className='m-5 p-2 rounded-md' placeholder="Username" {...register("username", { required: true })} />
                {errors.username && <span>This field is required</span>}

                <input type={hide ? "password" : "text"} className='m-5 p-2 rounded-md' placeholder="Password" {...register("password", { required: true })} />
                <label>Show</label><input type="checkbox" onClick={handleHide}/>
                {errors.password && <span>This field is required</span>}

                <input type="email" className='m-5 p-2 rounded-md' placeholder="Mail" {...register("email", { required: true })} />

                <button type='submit'>Sign up</button>

                <p className='mt-2 text-sm'>Or if you already have an account: <Link href='/login'>Login</Link></p>
            </form>
        </div>
    );
}