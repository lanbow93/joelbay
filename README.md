# Joelbay Collections

## Overview

Welcome to Joelbay Collections! This project serves as a demonstration of my skills as a junior developer. It is a catalog of items available for sale, complete with a contact form for each listing. The goal is to showcase my ability to design and implement a backend system for an e-commerce platform.

## Tech Stack

- **Node.js:** Backend runtime environment
- **Express:** Web application framework for Node.js
- **Sequelize:** Promise-based Node.js ORM for PostgreSQL
- **JWT (JSON Web Tokens):** Securely transmit information between parties
- **Other Dependencies:** `SendGrid` for email, `Bcrypt` for password hashing, and more.

## Getting Started

### Prerequisites

- Node.js (v16.17.0)
- pnpm (v8.10.4)

### Installation

1. Clone the repository.
2. Install dependencies using `pnpm install`.
3. Set up the database and environment variables

```plaintext
PGHOST='your_database_host'
PGDATABASE='your_database_name'
PGUSER='your_database_user'
PGPASSWORD='your_database_password'
ENDPOINT_ID='your_endpoint_id'
SECRET='your_secret_key'
CLIENTID='your_imgur_client_id'
RECEIVINGEMAIL='your_receiving_email'
SENDGRID_API_KEY='your_sendgrid_api_key'
```

**Security Note:** Do not expose sensitive information, such as database credentials or API keys, in public repositories. Ensure that these details are securely handled and stored.

### Running the Server

- For development: `pnpm run dev`
- For production: `pnpm start`

## Data Models

### Admin Model

A simple model for admin users with username and password fields.

The `Admin` model represents administrators of the system. It includes fields for user identification.

- **Fields:**
  - `id` (Integer): Unique identifier for the admin.
  - `username` (String): Admin's username (unique).
  - `password` (String): Admin's password.

```javascript
// Admin Model Code
import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Admin;
```

The Listing model represents items available for sale in the catalog. It includes various details about each item.

- **Fields:**
  - `id` (Integer): Unique identifier for the listing.
  - `name` (String): Name of the item.
  - `description` (String): Description of the item (default: "No Description").
  - `imageUrls` (Array of Strings): URLs of images associated with the item.
  - `price` (Decimal): Price of the item (default: $50.0).
  - `discount` (Integer): Discount percentage applied to the item (default: 0).
  - `quantityAvailable` (Integer): Available quantity of the item (default: 1).
  - `brand` (String): Brand of the item (default: "UNKNOWN").
  - `category` (String): Category of the item.
  - `condition` (String): Condition of the item.

```javascript
// Listing Model Code
import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Listing = sequelize.define(
  "Listing",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      defaultValue: "No Description",
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 50.0,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    brand: {
      type: DataTypes.STRING(100),
      defaultValue: "UNKNOWN",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Listing;
```

## Listings API Routes

| Endpoint                   | Method | Description                                   | Request                                                   | Response                                                                 |
| -------------------------- | ------ | --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/api/listings`            | GET    | Retrieve all available listings.              | Query Parameters: `discount` (Optional)                   | Success (200): List of listings                                          |
|                            |        |                                               |                                                           | Error (400): { "error": "Invalid input data" }                           |
| `/api/listings`            | POST   | Add a new listing with image upload to Imgur. | Body: `{ "name": "New Product", "price": 30.0, ... }`     | Success (201): Created listing                                           |
|                            |        |                                               |                                                           | Error (400): { "error": "Invalid input data" }                           |
| `/api/listings/:ListingId` | PUT    | Update an existing listing with image upload. | Body: `{ "name": "Updated Product", "price": 40.0, ... }` | Success (200): Updated listing                                           |
|                            |        |                                               |                                                           | Error (404): { "error": "Listing not found" }                            |
| `/api/listings/:id`        | DELETE | Delete a specific listing by ID.              |                                                           | Success (200): { "message": "Successful Deletion", "data": deletedRows } |
|                            |        |                                               |                                                           | Error (400): { "error": "Unable to delete listing" }                     |
| `/api/listings/:id`        | GET    | Retrieve details of a specific listing by ID. |                                                           | Success (200): Single listing details                                    |
|                            |        |                                               |                                                           | Error (404): { "error": "Listing not found" }                            |

## Admin API Routes

| Endpoint        | Method | Description                                           | Request                                                 | Response                                                                                                       |
| --------------- | ------ | ----------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/admin/signup` | POST   | (Commented out for security) Create a new admin user. | Body: `{ "username": "admin", "password": "admin123" }` | Success (200): { "status": "Admin Created", "username": admin }<br>Error (400): { error details }              |
| `/admin/login`  | POST   | Log in an admin user.                                 | Body: `{ "username": "admin", "password": "admin123" }` | Success (200): { "payload": { "username": "admin" }, "status": "logged in" }<br>Error (400): { error details } |
| `/admin/logout` | POST   | Log out the admin user.                               |                                                         | Success (200): { "response": "You are Logged Out" }                                                            |

## Contact API Routes

| Endpoint               | Method | Description                 | Request                                                                                                                                                                 | Response                                                                                                                                                                                                                               |
| ---------------------- | ------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/contact/iteminquiry` | PUT    | Send an item inquiry email. | Body: `{ "itemName": "Product A", "name": "John Doe", "email": "john@example.com", "imageUrl": "image-url", "message": "Interested in Product A", "link": "item-url" }` | Success (200): { "status": "Email Sent Successfully", "message": "Check Email For Next Steps", "result": "Success" }<br>Error (400): { "status": "Unable To Process Email", "message": "Unable to Email", "error": { error details } } |

## Backend Site

[Joelbay Collections - Backend Site](https://joelbay-backend.onrender.com)
