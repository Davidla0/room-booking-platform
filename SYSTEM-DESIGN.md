## Architecture Diagram

```mermaid
flowchart TD
    A[Browser / Client] --> B[Global Load Balancer]

    B --> C[UI Service<br/>React SPA]
    B --> D[Booking API Service<br/>Node.js / TypeScript]

    D --> E[(PostgreSQL<br/>Primary + Read Replicas)]
    D --> F[(Redis<br/>Cache + Locks)]
    D --> G[Message Broker]

    G --> H[Notification Service]
    G --> I[Analytics Pipeline]
