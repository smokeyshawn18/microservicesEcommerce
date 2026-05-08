# NepCart Two-PC Architecture Runbook

This document is the clean operating model for your setup:

- PC A and PC B stay on the same LAN all the time.
- The laptop may change, but it joins that same LAN when you work.
- PC A runs Kafka and product-service.
- PC B runs order-service and payment-service.

## 1) Hardware reality and Docker sizing

Your machines are Intel i5 4th gen, 8 GB DDR3 RAM, 256 GB NVMe SSD.

This is enough for a split deployment, but not comfortable for all services on one PC.

Recommended:

- Keep split deployment (PC A + PC B).
- Do not run frontend builds and heavy browser workload on those PCs.
- Use laptop for frontend/browser.

Docker Desktop resource target:

- PC A: 4 to 5 GB RAM for Docker, 2 CPUs
- PC B: 3 to 4 GB RAM for Docker, 2 CPUs

Keep at least 2.5 to 3 GB free for Windows host on each PC.

## 2) Fixed network model

Use DHCP reservation or static IPs for PC A and PC B so addresses do not change.

Example plan:

- PC A: `192.168.1.50`
- PC B: `192.168.1.60`
- LAN subnet: `192.168.1.0/24`

Laptop can be any IP in that subnet.

## 3) Service map

### PC A

- Kafka broker 1: `9094`
- Kafka broker 2: `9095`
- Kafka broker 3: `9096`
- Kafka UI: `8080`
- product-service: `8000`

### PC B

- order-service: `8001`
- payment-service: `8002`

## 4) Required configuration changes

### A) Kafka broker addresses for cross-PC traffic

PC B must connect to Kafka on PC A by PC A LAN IP or DNS name.

Important:

- Docker container names like `kafka-broker-1` are not routable from PC B.
- PC A Kafka listeners must advertise reachable LAN addresses.

Recommended pattern for Kafka on PC A:

- Use dual listeners: `INTERNAL` for broker-to-broker traffic, `EXTERNAL` for PC B clients.
- Keep `INTERNAL` advertised as Docker service names.
- Advertise `EXTERNAL` as PC A LAN IP and published ports.

Think of it as two doors for each broker:

- INTERNAL door: only for Kafka containers talking to each other on PC A
- EXTERNAL door: for apps on PC B

Example for broker 1:

```yaml
environment:
	KAFKA_LISTENERS: INTERNAL://:19094,EXTERNAL://:9094,CONTROLLER://:9093
	KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-broker-1:19094,EXTERNAL://192.168.1.50:9094
	KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
	KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
	KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
```

Broker 2 and broker 3 follow the same pattern with their own ports:

- broker 2 external port `9095`, internal `19095`
- broker 3 external port `9096`, internal `19096`

Full mapping on PC A:

- broker 1:
  - INTERNAL advertised address: `kafka-broker-1:19094`
  - EXTERNAL advertised address: `192.168.1.50:9094`
- broker 2:
  - INTERNAL advertised address: `kafka-broker-2:19095`
  - EXTERNAL advertised address: `192.168.1.50:9095`
- broker 3:
  - INTERNAL advertised address: `kafka-broker-3:19096`
  - EXTERNAL advertised address: `192.168.1.50:9096`

What PC B should use:

- `KAFKA_BROKERS=192.168.1.50:9094,192.168.1.50:9095,192.168.1.50:9096`

What PC B should never use:

- `kafka-broker-1:9094` style names, because those names exist only inside PC A Docker network.

If you keep only `EXTERNAL` and advertise container names, remote clients on PC B will connect to metadata addresses they cannot resolve.

### B) KAFKA_BROKERS on PC B services

Set this in env for order-service and payment-service on PC B:

```env
KAFKA_BROKERS=192.168.1.50:9094,192.168.1.50:9095,192.168.1.50:9096
```

Without this, shared Kafka client defaults to localhost and PC B services will fail to connect.

### C) Frontend payment service URL

In client env on your laptop:

```env
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://192.168.1.60:8002
```

This must point to PC B because payment-service runs there.

### D) Stripe return URL

Replace localhost return URL with your actual client URL reachable from the laptop.

Example:

```text
http://<laptop-or-client-host>:3002/return?session_id={CHECKOUT_SESSION_ID}
```

### E) CORS allowlists

Update CORS origins in services to include the real frontend origin(s), not only localhost.

At minimum review:

- `apps/product-service/src/index.ts`
- `apps/payment-service/src/index.ts`

If order-service receives browser-origin traffic, apply the same CORS policy there.

## 5) Clean Windows Firewall policy

Use Private profile only.

Scope inbound rules to your LAN subnet, or tighter remote addresses if you prefer.

### PC A inbound rules

Allow from LAN (`192.168.1.0/24`):

- TCP `9094,9095,9096` for Kafka access from PC B
- TCP `8000` if laptop/frontend calls product-service directly
- TCP `8080` if you want Kafka UI from laptop

PowerShell (run as Administrator):

```powershell
New-NetFirewallRule -DisplayName "NepCart-PCA-Kafka" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 9094,9095,9096 -Profile Private -RemoteAddress 192.168.1.0/24
New-NetFirewallRule -DisplayName "NepCart-PCA-Product" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8000 -Profile Private -RemoteAddress 192.168.1.0/24
New-NetFirewallRule -DisplayName "NepCart-PCA-KafkaUI" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 -Profile Private -RemoteAddress 192.168.1.0/24
```

### PC B inbound rules

Allow from LAN (`192.168.1.0/24`):

- TCP `8001` for order-service
- TCP `8002` for payment-service

PowerShell (run as Administrator):

```powershell
New-NetFirewallRule -DisplayName "NepCart-PCB-Order" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8001 -Profile Private -RemoteAddress 192.168.1.0/24
New-NetFirewallRule -DisplayName "NepCart-PCB-Payment" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8002 -Profile Private -RemoteAddress 192.168.1.0/24
```

### Optional tighter scope

If you want stricter rules:

- On PC A Kafka ports, set `-RemoteAddress` to only PC B IP.
- On PC B service ports, set `-RemoteAddress` to only laptop IP.

## 6) Docker start order

1. Start PC A stack first (Kafka + product-service).
2. Wait until Kafka brokers are healthy.
3. Start PC B services (order-service + payment-service).
4. Start frontend from laptop.

PC A command:

```bash
docker compose -f packages/kafka/docker-compose.yml up --build -d
```

Stop PC A stack:

```bash
docker compose -f packages/kafka/docker-compose.yml down
```

## 7) Connectivity verification checklist

From PC B:

- Test Kafka ports on PC A: `9094`, `9095`, `9096`
- Confirm order-service and payment-service can connect to Kafka after startup

From laptop:

- `http://192.168.1.60:8002/health`
- `http://192.168.1.50:8000/health`
- `http://192.168.1.50:8080` (if Kafka UI is enabled)

If any check fails, verify:

- correct IPs
- firewall profile is Private
- firewall rules exist and are enabled
- `KAFKA_BROKERS` on PC B points to PC A
- CORS origins match actual frontend URL

## 8) Practical stability notes for 8 GB systems

- Keep Docker images cleaned regularly: remove unused images and stopped containers.
- Avoid extra background apps on PC A and PC B.
- Keep only required containers running.
- If PC A becomes unstable, reduce Kafka load (fewer brokers for dev) or move Kafka to a stronger machine.

## 9) Final operating rule

Treat PC A and PC B as fixed backend nodes.

Treat the laptop as a movable client/editor node that must join the same LAN.

With fixed PC IPs, explicit `KAFKA_BROKERS`, updated frontend URL, and scoped firewall rules, this architecture is clean and repeatable.
