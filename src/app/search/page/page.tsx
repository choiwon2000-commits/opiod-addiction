'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type Complaint = {
  name: string;
  slug: string;
  category: string;
  short: string;
};

const COMPLAINTS: Complaint[] = [
  {
    name: 'Verslaving',
    slug: 'verslaving',
    category: 'Opioïden',
    short: 'Risico op geestelijke en lichamelijke afhankelijkheid bij opioïdgebruik.',
  },
  {
    name: 'Chronische pijn',
    slug: 'chronische-pijn',
    category: 'Pijn',
    short: 'Langdurige pijnklachten waarbij opioïden soms (tijdelijk) worden ingezet.',
  },
  {
    name: 'Postoperatieve pijn',
    slug: 'postoperatieve-pijn',
    category: 'Pijn',
    short: 'Pijn na een operatie, vaak behandeld met kortdurend opioïdgebruik.',
  },
  {
    name: 'Slaapproblemen',
    slug: 'slaapproblemen',
    category: 'Overig',
    short: 'Slaapproblemen kunnen verergeren door verkeerd gebruik van pijnmedicatie.',
  },
  {
    name: 'Angstklachten',
    slug: 'angstklachten',
    category: 'Overig',
    short: 'Angst en spanning kunnen samenhangen met langdurig medicijngebruik.',
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const filteredComplaints = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMPLAINTS;
    return COMPLAINTS.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.short.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/opioid-bg.svg')" }}
    >
      {/* 반투명 흰색 오버레이로 글자 가독성 높이기 */}
      <div className="min-h-screen bg-white/80">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
          {/* 상단 제목 + 검색창 */}
          <header className="mb-6 lg:mb-8">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Klachten &amp; ziektes
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Zoeken in klachten rond opioïden
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              Typ een klacht, ziekte of onderwerp om gerelateerde informatie te vinden.
            </p>

            <div className="max-w-md">
              <label htmlFor="search" className="sr-only">
                Zoek
              </label>
              <input
                id="search"
                type="search"
                placeholder="Bijvoorbeeld: verslaving, chronische pijn..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </header>

          {/* Hero-afbeelding onder de titel (plaats `public/images/hero.jpg`) */}
          <div className="mb-6">
            <Image
              src="/images/hero.svg"
              alt="Afbeelding gerelateerd aan opioïden"
              width={1600}
              height={400}
              className="w-full rounded-lg shadow-md object-cover max-h-64"
              priority
            />
          </div>

          {/* 메인 레이아웃: 사이드바 + 콘텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* ===== 사이드바 (sticky) ===== */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4 bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-sm p-4">
                <h2 className="text-sm font-semibold text-slate-800 mb-3">
                  A–Z lijst
                </h2>
                <ul className="space-y-1 text-sm max-h-[60vh] overflow-auto pr-1">
                  {COMPLAINTS.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => setQuery(c.name)}
                        className="w-full text-left px-2 py-1 rounded hover:bg-sky-50 hover:text-sky-800"
                      >
                        {c.name}
                        <span className="ml-1 text-[11px] text-slate-400">
                          ({c.category})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] text-slate-500">
                  Tip: klik op een klacht om direct daarop te zoeken.
                </p>
              </div>
            </aside>

            {/* ===== 검색 결과 영역 ===== */}
            <section className="lg:col-span-3 space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className="bg-white/90 border border-slate-200 rounded-lg shadow-sm p-5">
                  <p className="text-sm text-slate-700">
                    Geen resultaten gevonden voor{" "}
                    <span className="font-semibold">"{query}"</span>. Probeer een andere term.
                  </p>
                </div>
              ) : (
                filteredComplaints.map((c) => (
                  <article
                    key={c.slug}
                    className="bg-white/95 border border-slate-200 rounded-lg shadow-sm p-5"
                  >
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
                      {c.name}
                    </h2>
                    <p className="text-xs uppercase tracking-wide text-sky-700 mb-2">
                      {c.category}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {c.short}
                    </p>

                    {/* 여기 아래에 각 항목별로 상세 페이지 링크를 나중에 연결 가능 */}
                    <p className="mt-3 text-xs text-slate-500">
                      Later kun je hier bijvoorbeeld een link maken naar een aparte detailpagina:
                      <code className="ml-1 bg-slate-100 px-1 py-0.5 rounded">
                        /klachten-ziektes/{'{'}{c.slug}{'}'}
                      </code>
                    </p>
                  </article>
                ))
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
