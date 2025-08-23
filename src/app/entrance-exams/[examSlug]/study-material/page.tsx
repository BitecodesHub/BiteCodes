import { notFound } from 'next/navigation';
import StudyMaterialClient from './StudyMaterialClient';

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exam Preparation - Study Resources & Tips',
  description: 'Access study tips, recommended resources, and mock tests to prepare effectively for DAU, NIRMA, NFSU, and other entrance exams.',
  keywords: ['exam preparation', 'study tips', 'DAU preparation', 'NIRMA preparation', 'NFSU preparation', 'mock tests', 'study resources'],
  openGraph: {
    title: 'Exam Preparation - Study Resources & Tips',
    description: 'Access study tips, recommended resources, and mock tests to prepare effectively for DAU, NIRMA, NFSU, and other entrance exams.',
    url: '/preparation',
    type: 'website',
  },
}

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