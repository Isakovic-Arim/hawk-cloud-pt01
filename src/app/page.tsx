'use client'

import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent, useEffect } from 'react';
import { useAnimate, stagger, motion, animate } from "framer-motion";

function Home() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    animate("figure", { y: -100 });
  }, []);

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

  return <div className='bg-black pb-20'>
    <main>
      <nav>
        <Link data-value='REGISTER' onMouseOver={event => handleHover(event)} className='p-2 absolute w-fit h-fit inset-3 uppercase hover:text-black hover:bg-white' href='/register'>Register</Link>
        <Link data-value='LOGIN' onMouseOver={event => handleHover(event)} className='target p-2 absolute top-3 right-3 uppercase' href='/login'>Login</Link>
      </nav>
      <section className='h-screen grid xl:flex justify-evenly'>
        <Image priority draggable={false} src={'/hawk.svg'} alt='logo' width={700} height={700} />
        <header className='my-auto'>
          <h1 className='text-center uppercase text-6xl'>Hawk - Cloud</h1>
          <h2 className='font-mono space-x-2 text-center text-3xl'>Prototype 01</h2>
        </header>
      </section>
      <section className='h-screen mx-20'>
        <header><h1 className='text-5xl text-center mb-10'>Features</h1></header>
        <article className='text-center text-lg my-auto'>
          <p>It grants access to the docker daemon running on the localhost.</p>
          <p>So, it is kind of like a cheap rip-off of Docker Desktop (for now!).</p>
          <p>It is currently possible to create, start and stop containers.</p>
        </article>
      </section>
      <motion.section initial={{ opacity: 0, y: -100 }} transition={{ duration: 1 }} whileInView={{ opacity: 1, y: 0 }} className='h-screen grid place-items-center'>
        <header><h1 className='text-5xl text-center'>Stack</h1></header>
        <div className='flex w-full justify-evenly'>
          <Tech img={'/svgs/stack/nextjs.svg'} name={'Next 13'} />
          <Tech img={'/svgs/stack/supabase.svg'} name={'Supabase'} />
          <Tech img={'/svgs/stack/socket-io.svg'} name={'Socket.io'} />
          <Tech img={'/svgs/stack/docker.svg'} name={'Docker'} />
        </div>
      </motion.section>
    </main>
    <footer className='h-screen w-full grid gap-4 xl:flex justify-evenly items-center rounded-t-lg'>
      <Account img='/contributors/denishuski.jpg' name='Denis Huskic' link='https://github.com/denishuski' />
      <Account img='/contributors/AliCoban03.png' name='Ali Coban' link='https://github.com/AliCoban03' />
      <Account img='/contributors/ByteWolf-dev.png' name='Fabian Baitura' link='https://github.com/ByteWolf-dev' />
      <Account img='/contributors/Isakovic-Arim.png' name='Isakovic Arim' link='https://github.com/Isakovic-Arim' />
    </footer>
  </div>;
}

type TechProps = {
  img: string,
  name: string
}

const Tech: React.FunctionComponent<TechProps> = ({ img, name }) => {
  return <figure>
    <Image src={img} alt={name} width={100} height={100} />
    <figcaption className='text-center'>{name}</figcaption>
  </figure>
}

type AccountProps = {
  img: string,
  name: string,
  link: string
}

const Account: React.FunctionComponent<AccountProps> = ({ img, name, link }) => {
  return <figure className='bg-white w-full h-full flex xl:grid place-items-center rounded-lg shadow-xl px-6 py-10 xl:w-72 xl:h-96'>
    <Link href={link}>
      <Image className='rounded-full' src={img} alt={name} width={200} height={200} />
    </Link>
    <figcaption className='text-black text-3xl'>{name}</figcaption>
  </figure>
}

export default Home;