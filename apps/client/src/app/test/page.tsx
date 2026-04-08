import { auth } from "@clerk/nextjs/server";

const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  console.log("Token:", token);

  const resProduct = await fetch("http://localhost:8000/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const dataProduct = await resProduct.json();
  console.log("Product:", dataProduct);

  const resOrder = await fetch("http://localhost:8001/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const dataOrder = await resOrder.json();
  console.log("Order:", dataOrder);

  const resPayment = await fetch("http://localhost:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const dataPayment = await resPayment.json();
  console.log("Payment:", dataPayment);

  return <div>TestPage</div>;
};

export default TestPage;
