import net from "node:net";

const brokers = (
  process.env.KAFKA_BROKERS ??
  "kafka-broker-1:9094,kafka-broker-2:9095,kafka-broker-3:9096"
)
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

const sleep = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const canConnect = (broker: string) =>
  new Promise<void>((resolve, reject) => {
    const [host, portText] = broker.split(":");
    const port = Number(portText);

    if (!host || !Number.isInteger(port)) {
      reject(new Error(`Invalid Kafka broker address: ${broker}`));
      return;
    }

    const socket = net.createConnection({ host, port }, () => {
      socket.end();
      resolve();
    });

    socket.setTimeout(2000);
    socket.on("timeout", () => {
      socket.destroy(new Error(`Timed out connecting to ${broker}`));
    });
    socket.on("error", reject);
  });

const waitForKafka = async () => {
  const maxAttempts = 30;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    for (const broker of brokers) {
      try {
        await canConnect(broker);
        console.log(`Kafka is available at ${broker}`);
        return;
      } catch (error) {
        if (attempt === maxAttempts && broker === brokers[brokers.length - 1]) {
          throw error;
        }
      }
    }

    console.log(
      `Waiting for Kafka brokers: ${brokers.join(", ")} (attempt ${attempt}/${maxAttempts})`,
    );
    await sleep(delayMs);
  }

  throw new Error(`Kafka brokers were not reachable: ${brokers.join(", ")}`);
};

const start = async () => {
  await waitForKafka();
  await import("./index.js");
};

start().catch((error) => {
  console.error("Unable to start product-service:", error);
  process.exit(1);
});
