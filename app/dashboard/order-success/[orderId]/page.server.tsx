import OrderSuccessClient from './page.client';

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  // Return some sample order IDs for static generation
  // In a real app, you would fetch this from your database
  return [
    { orderId: '12345' },
    { orderId: '67890' },
    { orderId: 'sample-order' }
  ];
}

// Server Component that wraps the Client Component
export default async function OrderSuccessServerPage({ params }: { params: { orderId: string } }) {
  return <OrderSuccessClient />;
}