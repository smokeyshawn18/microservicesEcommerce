import Link from "next/link";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const params = await searchParams;
  const session_id = params?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/session/${session_id}`,
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("API error:", text);
    return <div>Payment verification failed.</div>;
  }

  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Invalid JSON:", text);
    return <div>Failed to load payment status.</div>;
  }

  return (
    <div>
      <h1>Payment {data.status}</h1>
      <p>Payment status: {data.paymentStatus}</p>
      <Link href="/orders">See your orders</Link>
    </div>
  );
};

export default ReturnPage;
