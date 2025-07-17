# Create Admin Script

This script creates only an admin user without any sample data or database operations.

## Usage

```bash
# Navigate to backend directory
cd backend

# Run the admin creation script
bun run admin:only
```

## What it does

- Connects to MongoDB database
- Checks if an admin user already exists
- Creates a new admin user if none exists
- Uses secure password hashing (bcrypt with 12 salt rounds)
- Closes database connection after completion

## Default Admin Credentials

- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: admin

⚠️ **Important**: Change the default password after first login!

## Features

- ✅ Simple and focused - only creates admin user
- ✅ Prevents duplicate admin creation
- ✅ Secure password hashing
- ✅ Proper error handling
- ✅ Clean database connection management
- ✅ No sample data or database reset

## Difference from adminSetup.js

- `adminSetup.js`: Full setup with sample data, database reset options
- `createAdmin.js`: Only creates admin user, no additional operations

## Requirements

- MongoDB connection (local or remote)
- Environment variables configured in `.env` file
- All dependencies installed (`bun install`)