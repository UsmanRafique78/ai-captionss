// src/app/[filename]/page.js
import FilePageClient from './FilePageClient';

export default async function FilePage({ params }) {
  const { filename } = await params;
  
  return <FilePageClient filename={filename} />;
}