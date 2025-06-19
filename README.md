# Bitespeed Identity Reconciliation Service

[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A REST API service for identity reconciliation that links customer contacts based on email and phone number.

## 🚀 Live Deployment

The service is hosted at:
🔗 [https://bitespeed-2cvi.onrender.com/identify](https://bitespeed-2cvi.onrender.com/identify)
*(Replace with your actual hosted URL)*

## Features

- **Identity Reconciliation**: Links customer contacts across multiple channels
- **Contact Consolidation**: Merges duplicate contacts while preserving data
- **RESTful API**: JSON-based endpoints for easy integration
- **PostgreSQL Backend**: Relational data storage with proper indexing
- **TypeScript**: Type-safe codebase with modern JavaScript features

## API Documentation

### Identify Endpoint

```http
POST /identify

Sample Request Body:
{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "123456"
}
```
