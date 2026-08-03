import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black tracking-wider text-orange-500">
          RbxLava STUDIO 🌋
        </h1>
        <p className="text-sm md:text-base opacity-70">
          Roblox Universe & Place Automated Generator
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/create"
          className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl text-lg"
        >
          ジェネレーターを開く 🚀
        </Link>
      </div>
    </main>
  );
}
