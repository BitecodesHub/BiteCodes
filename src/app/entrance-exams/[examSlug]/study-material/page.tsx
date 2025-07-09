import { notFound } from 'next/navigation';
import StudyMaterialClient from './StudyMaterialClient';

async function getStudyMaterials(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-material/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch study materials:', error);
    return null;
  }
}

export default async function StudyMaterialPage({ 
  params 
}: { 
  params: Promise<{ examSlug: string }> 
}) {
  const { examSlug } = await params;
  const data = await getStudyMaterials(examSlug);
  
  if (!data || data.length === 0) {
    return notFound();
  }
  
  return <StudyMaterialClient syllabusTopics={data} />;
}