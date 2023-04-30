'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSupabase } from '../../components/supabase-provider'

type Inputs = {
  email: string,
  password: string
};

// Supabase auth needs to be triggered client-side
function Login() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { supabase } = useSupabase();

  const getUser = async () => {
    return (await supabase.auth.getSession()).data.session?.user;
  }

  const onSubmit: SubmitHandler<Inputs> = async data => {
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })
    handleLogin();
  };

  const handleLogin = async () => {
    const user = await getUser();
    router.push(`/${user?.id}`);
  }

  const handleGitHubLogin = async () => {
    const user = await getUser();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `http://localhost:3000/${user?.id}`
      }
    })
  }

  return (
    <div className='h-screen grid place-items-center'>
      <form className='grid place-items-center' onSubmit={handleSubmit(onSubmit)}>
        <input type="email" className='m-5 p-2 rounded-md' placeholder='Email' {...register("email", { required: true })} />
        {errors.email && <span>This field is required</span>}

        <input type="password" className='m-5 p-2 rounded-md' placeholder='password' {...register("password", { required: true })} />
        {errors.password && <span>This field is required</span>}

        <button onClick={handleGitHubLogin}>GitHub Login</button>
        <button type='submit'>Login</button>
        <p className='mt-2 text-sm'>New user?</p>
        <Link className='text-sm' href='/register'>Register</Link>
      </form>
    </div>
  )
}

export default Login;