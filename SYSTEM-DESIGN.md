# 1. High-Level Architecture

The Room Booking Platform is built as a two-microservice architecture designed for scalability, fault tolerance, and multi-region deployment.  
A global load balancer routes traffic to the UI service or the Booking API service, which communicates with PostgreSQL, Redis, and optional asynchronous components.

## Architecture Diagram

```mermaid
flowchart TD
    A[Browser / Client] --> B[Global Load Balancer]

    B --> C[The UI Service serves the React single-page application.
It communicates exclusively with the Booking API Service via HTTPS.
It can be deployed as a standalone microservice or as a static asset hosted on a CDN.<br/>(React App)]
    B --> D[The Booking API Service is the core backend responsible for:

User registration and authentication

Room search

Room booking

It is stateless and horizontally scalable.
The service communicates with PostgreSQL, Redis, and the message broker to support caching, persistence, and asynchronous workflows.<br/>(Node.js / TypeScript)]

    D --> E[(PostgreSQL is used as the source of truth for:

Users

Rooms

Bookings

Room availability

The deployment includes:

Primary writer node

Read replicas to offload read-heavy operations such as room search

This ensures high consistency for bookings while allowing scalable search performance.<br/>Primary + Read Replicas)]
    D --> F[(Redis is used for:

Caching room details and availability

Distributed locking in the booking flow to prevent double-booking

This improves performance and ensures safe concurrent operations.<br/>Caching + Distributed Locking)]
    D --> G[A message broker (Kafka / RabbitMQ / SQS) is used to publish domain events such as:

UserRegistered

BookingCreated

These events are consumed by:

Notification Service (emails/SMS)

Analytics Pipeline

This ensures booking flows remain fast and asynchronous operations do not block API responses.<br/>(Kafka / RabbitMQ / SQS)]

    G --> H[The system supports multi-region deployment with:

A global load balancer routing users to the closest healthy region

Local Redis and API instances in each region

PostgreSQL primary in one region and read replicas in others<br/>(Email/SMS)]
    G --> I[Analytics Pipeline]
