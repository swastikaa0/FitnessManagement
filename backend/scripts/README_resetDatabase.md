# Reset Database Script

A dedicated script to safely reset the entire database by dropping all collections, with an optional flag to recreate the admin user.

## Features

- **Safe Reset**: Drops all collections in the database
- **Collection Discovery**: Automatically finds and lists all collections before dropping
- **Optional Admin Creation**: Can recreate admin user after reset
- **Detailed Logging**: Provides clear feedback on all operations
- **Error Handling**: Comprehensive error handling with graceful shutdown

## Usage

### Reset Database Only
```bash
bun run db:reset
```
This will:
- Connect to the database
- List all existing collections
- Drop all collections
- Close the connection

### Reset Database and Create Admin
```bash
bun run db:reset-with-admin
```
This will:
- Reset the database (as above)
- Create a new admin user with default credentials
- Provide login information

### Manual Script Execution
```bash
# Reset only
bun scripts/resetDatabase.js

# Reset with admin creation
bun scripts/resetDatabase.js --create-admin
```

## Default Admin Credentials

When using the `--create-admin` flag:
- **Email**: `admin@gmail.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Email Verified**: `true`

**⚠️ SECURITY WARNING**: Change the default password immediately after first login!

## What Gets Reset

The script will drop ALL collections in the database, including:
- Users (all user accounts)
- Meals (all meal data)
- Workouts (all workout data)
- Subscriptions (all subscription data)
- UserMeals (user meal tracking)
- UserWorkouts (user workout tracking)
- Any other collections that may exist

## Safety Features

- **Collection Listing**: Shows exactly what will be deleted before proceeding
- **Empty Database Detection**: Detects if database is already empty
- **Graceful Shutdown**: Properly closes database connections
- **Error Recovery**: Handles errors without leaving connections open

## Use Cases

### Development
- Clean slate for testing
- Remove test data
- Reset to initial state

### Testing
- Prepare clean environment for automated tests
- Reset between test suites
- Ensure consistent starting conditions

### Maintenance
- Clean up corrupted data
- Start fresh after major schema changes
- Remove all user data for privacy compliance

## Environment Requirements

- MongoDB connection (via `MONGODB_URI` environment variable)
- Node.js with ES modules support
- All required dependencies installed

## Example Output

```
🚀 Starting database reset script...
==========================================
✅ MongoDB connected successfully
🗑️  Starting database reset...
🔍 Found 6 collections to drop:
   - users
   - meals
   - workouts
   - subscriptions
   - usermeals
   - userworkouts
✅ Dropped collection: users
✅ Dropped collection: meals
✅ Dropped collection: workouts
✅ Dropped collection: subscriptions
✅ Dropped collection: usermeals
✅ Dropped collection: userworkouts
🧹 Database reset completed successfully!

👤 Creating admin user as requested...
✅ Admin user created successfully!
📧 Email: admin@gmail.com
🔑 Password: admin123

==========================================
✅ Database reset completed!
👤 Admin user created:
📧 Email: admin@gmail.com
🔑 Password: admin123
⚠️  Please change the default password after first login!
🔌 Database connection closed
```

## Differences from Other Scripts

| Script | Purpose | Admin Creation | Sample Data |
|--------|---------|----------------|-------------|
| `resetDatabase.js` | Clean database reset | Optional | No |
| `createAdmin.js` | Admin creation only | Always | No |
| `adminSetup.js` | Full setup with options | Optional | Optional |

## Best Practices

1. **Backup First**: Always backup important data before resetting
2. **Development Only**: Use primarily in development environments
3. **Confirm Environment**: Double-check you're connected to the right database
4. **Change Passwords**: Immediately change default admin credentials
5. **Team Communication**: Notify team members before resetting shared databases

## Troubleshooting

### Connection Issues
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Ensure network connectivity

### Permission Errors
- Verify database user has drop permissions
- Check MongoDB authentication settings

### Script Execution Issues
- Ensure all dependencies are installed (`bun install`)
- Verify Node.js version compatibility
- Check file permissions

For additional support, refer to the main project documentation or contact the development team.