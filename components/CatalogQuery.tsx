"use client";
import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

function QuerySync({ onChange }: { onChange: (params: URLSearchParams) => void }) {
  const params = useSearchParams();
  const change = useRef(onChange);
  change.current = onChange;
  useEffect(() => { change.current(new URLSearchParams(params.toString())); }, [params]);
  return null;
}

export default function CatalogQuery(props: { onChange: (params: URLSearchParams) => void }) {
  return <Suspense fallback={null}><QuerySync {...props}/></Suspense>;
}
