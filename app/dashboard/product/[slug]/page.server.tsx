import ProductDetailClient from './page.client';

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  // Return some sample product slugs for static generation
  // In a real app, you would fetch this from your database
  return [
    { slug: 'sample-product' },
    { slug: 'another-product' },
    { slug: 'test-item' }
  ];
}

// Server Component that wraps the Client Component
export default async function ProductDetailServerPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient />;
}