'use client'

import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent } from 'react';

function Home() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const handleHover = (e: MouseEvent<HTMLAnchorElement>) => {
    const link = e.target as HTMLAnchorElement;
    let iterations = 0;

    const intervalId = setInterval(() => {
      link.innerText = link.innerText.split("")
        .map((letter: string, index: number) => {
          if (index < iterations) {
            return link.dataset.value![index];
          }

          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iterations >= link.dataset.value!.length) clearInterval(intervalId);
      iterations += 1 / 6;
    }, 30);
  }

  return <>
    <main className='bg-black'>
      <nav>
        <Link data-value='REGISTER' onMouseOver={event => handleHover(event)} className='p-2 absolute w-fit h-fit inset-3 uppercase hover:text-black hover:bg-white' href='/register'>Register</Link>
        <Link data-value='LOGIN' onMouseOver={event => handleHover(event)} className='target p-2 absolute top-3 right-3 uppercase' href='/login'>Login</Link>
      </nav>
      <section className='h-screen grid place-items-center'>
        <header>
          <h1 className='text-center uppercase text-3xl'>Hawk - Cloud</h1>
          <h2 className='font-mono space-x-2 text-center text-xl'>Prototype 01</h2>
        </header>
      </section>
      <section className='h-screen mx-20'>
        <header><h1 className='text-3xl'>Features</h1></header>
        <ul>
          <li>
            <p>Creation of containers</p>
          </li>
          <li>
            <p>Actions on created containers (start, stop, shell)</p>
          </li>
        </ul>
      </section>
      <section className='h-screen grid place-items-center'>
        <header><h1 className='text-3xl'>Stack</h1></header>
        <div className='flex w-full justify-evenly'>
          <figure>
            <Image src='/svgs/nextjs.svg' alt='nextjs' width={100} height={100} />
            <figcaption className='text-center'>Next 13</figcaption>
          </figure>
          <figure>
            <Image src='/svgs/supabase.svg' alt='supabase' width={100} height={100} />
            <figcaption className='text-center'>Supabase</figcaption>
          </figure>
          <figure>
            <Image src='/svgs/socket-io.svg' alt='socket-io' width={100} height={100} />
            <figcaption className='text-center'>Socket.io</figcaption>
          </figure>
          <figure>
            <Image src='/svgs/docker.svg' alt='docker' width={100} height={100} />
            <figcaption className='text-center'>Docker</figcaption>
          </figure>
        </div>
      </section>
    </main>
  </>;
}

export default Home;