import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link href="/" aria-label="DevSpirits home">
            <Image
              src="/DevSpirits_white_black.jpeg"
              alt="DevSpirits"
              width={140}
              height={40}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/DevSpirits_black_white.jpeg"
              alt="DevSpirits"
              width={140}
              height={40}
              className="hidden dark:block"
              priority
            />
          </Link>
        </div>
      </header>

      <main>{/* Ready for content */}</main>
    </div>
  );
}
