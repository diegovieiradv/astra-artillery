import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-cyan-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Página Não Encontrada</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          A página que você procura não existe ou foi movida para outro endereço.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
          >
            Voltar ao Início
          </Link>
          <Link
            href="/game"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            Jogar
          </Link>
        </div>
        
        <div className="mt-12 text-6xl animate-bounce">💣</div>
      </div>
    </div>
  );
}
