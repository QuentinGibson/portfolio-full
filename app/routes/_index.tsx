import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Box from '~/components/Box';
import { GrGithub, GrTwitter, GrYoutube } from 'react-icons/gr';
import { HiChip, HiCreditCard, HiCubeTransparent, HiUsers } from 'react-icons/hi';
import { Link } from '@remix-run/react';

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Home" }
  ]
}

export default function IndexRoute() {
  return (
    <main className="relative h-full">
      <div className='grid md:grid-cols-2'>
        <section className='py-8 bg-cream md:order-2'>
          <div className='relative flex justify-center'>
            <img src="/img/nobg-me.png" className='object-fill w-full z-20' alt="A me smiling" />
            <img className='absolute bottom-0 z-10 w-full' src="/img/art.svg" alt="" />
          </div>
        </section>
        <section className="flex flex-col gap-2 w-full bg-cream py-8">
          <div className='px-4'>
            <h1 className="font-thin font-serif uppercase text-lightDark md:text-5xl">Fullstack Web Developer</h1>
            <h2 className='text-6xl leading-[54px] text-dark md:text-9xl md:leading-none'>Quentin <br /> Gibson</h2>
          </div>
          <div className="flex flex-col">
            <div className='ml-16 border-l border-dark pl-4 font-serif'>
              <p className='leading-6 text-lightDark max-w-[300px] my-4 text-base md:text-2xl'>Im a fullstack developer based in College Park, Ga and I enjoy playing with React. I love video games, basketball, and music.</p>
              <div className="flex gap-3 text-lightDark">
                <Link to="https://github.com/QuentinGibson">
                  <GrGithub className='text-4xl' />
                </Link>
                <Link to="https://twitter.com/quent_made_it">
                  <GrTwitter className='text-4xl' />
                </Link>
                <Link to="https://www.youtube.com/channel/UCsX8Ahu9O9dmFyoV_fgoeaw">
                  <GrYoutube className='text-4xl' />
                </Link>
              </div>
              <div className="flex flex-col my-8 md:text-2xl">
                <p className='font-thin  text-lightDark'>Born In</p>
                <h3 className='font-bold '>College Park, Ga</h3>
              </div>
              <div className="flex flex-col my-8 md:text-2xl">
                <p className='font-thin text-lightDark'>Experience</p>
                <h3 className='font-bold '>10+ years</h3>
              </div>
              <div className="flex flex-col my-8 md:text-2xl">
                <p className='font-thin text-lightDark'>Birthday</p>
                <h3 className='font-bold '>November 29</h3>
              </div>
            </div>
          </div>
        </section>

      </div>

      <section className='py-8 bg-cream px-4'>
        <h1 className='text-5xl text-dark mb-4 md:text-8xl md:mb-8'>About Me</h1>
        <div className="grid grid-cols-2 gap-4 font-serif pb-4 md:grid-cols-4 md:pb-8">
          <div className="flex flex-col gap-1 items-center break-words">
            <HiUsers className='text-4xl text-[#ff8059]' />
            <p className="font-bold text-2xl text-dark">10</p>
            <h2 className="text-center font-light text-lightDark">Happy Customers</h2>
          </div>
          <div className="flex flex-col gap-1 items-center break-words">
            <HiChip className='text-3xl text-[#ff8059]' />
            <p className="font-bold text-2xl text-dark">1</p>
            <h2 className="text-center font-light text-lightDark">Hackathons</h2>
          </div>
          <div className="flex flex-col gap-1 items-center break-words">
            <HiCubeTransparent className='text-4xl text-[#ff8059]' />
            <p className="font-bold text-2xl text-dark">4</p>
            <h2 className="text-center font-light text-lightDark">Remix-Run Projects</h2>
          </div>
          <div className="flex flex-col gap-1 items-center break-words">
            <HiCreditCard className='text-4xl text-[#ff8059]' />
            <p className="font-bold text-2xl text-dark">3</p>
            <h2 className="text-center font-light text-lightDark">Shopify Stores</h2>
          </div>
        </div>
        <div className="flex flex-col font-serif text-lightDark leading-6 font-light pb-4">
          <p className='my-2'>
            My name is Quentin Gibson, a passionate developer with an unwavering commitment to excellence. My journey in the world of programming began in 2014 and since then, I have been immersing myself in coding challenges. Every day I make sure to spend time creating a meaningful commit in order to continously get better. I have maintained this commitment even though no one has hired me.
          </p>
          <p className="my-2">As a developer, I believe that every line of code tells a story. I put emphasis on the clarity and maintainability of my code, ensuring that it can be easily understood by others. I make sure to follow famous programmers like celeberties in order to improve. How can you write better code if you dont read better code?</p>
          <p className="my-2">I am a black developer from a infamous low income town. Most people never look my way when looking for a programmer, but I love doing this. I have been coding for years waiting to break into the field as its my dream job.</p>
        </div>
        <Link to="/contact" prefetch="intent" className='inline-block mt-8 px-8 py-3 font-bold font-serif border-2 border-[#ff8059] rounded-lg hover:bg-[#ff8059] hover:scale-105 transition-all duration-150'>
          Contact Me
        </Link>
        <div className='mt-8'>
          <img className="max-w-[300px]" src="/img/signature.svg" alt="" />
        </div>
      </section>
      {/* <Canvas>
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <OrbitControls />
      </Canvas>  */}
    </main>
  );
};
