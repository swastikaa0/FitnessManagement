# Scripts Directory

This directory contains utility scripts for the Fitness Management backend.

## Available Scripts

### adminSetup.js
Sets up admin user and sample data for development.

**Usage:**
```bash
# Create admin user only
bun scripts/adminSetup.js

# Reset database and create admin
bun scripts/adminSetup.js --reset

# Create admin and seed sample data
bun scripts/adminSetup.js --seed

# Full setup (reset + admin + sample data)
bun scripts/adminSetup.js --reset --seed
```

**Default Admin Credentials:**
- Email: admin@gmail.com
- Password: admin123

⚠️ **Important:** Change the default password after first login!

### subscriptionMock.js
Generates mock subscription data for development and testing.

**Features:**
- Creates realistic subscription data with various plans and statuses
- Generates sample users if none exist
- Provides revenue analytics
- Supports different billing cycles (monthly, quarterly, annually)

**Usage:**
```bash
# Create mock subscriptions
bun scripts/subscriptionMock.js

# Reset all subscription data
bun scripts/subscriptionMock.js --reset

# Show available subscription plans
bun scripts/subscriptionMock.js --plans

# Generate and display revenue analytics
bun scripts/subscriptionMock.js --revenue

# Combine options
bun scripts/subscriptionMock.js --reset --plans --revenue
```

**Package.json Scripts:**
```bash
bun run mock:subscriptions          # Create mock subscriptions
bun run mock:subscriptions-reset    # Reset subscription data
bun run mock:subscriptions-plans    # Show available plans
bun run mock:subscriptions-revenue  # Show revenue analytics
```

### subscriptionApiMock.js
Standalone API server that mocks subscription endpoints for frontend development.

**Features:**
- Runs on port 3001 (configurable)
- Provides realistic API responses with delays
- Supports all subscription-related endpoints
- CORS enabled for frontend development
- Detailed logging for debugging

**Usage:**
```bash
# Start the mock API server
bun scripts/subscriptionApiMock.js

# Or using package.json script
bun run mock:api-server
```

**Available Endpoints:**
- `GET /api/subscriptions/plans` - Get all subscription plans
- `GET /api/subscriptions/current` - Get current user subscription
- `POST /api/subscriptions/subscribe` - Create new subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/history` - Get subscription history
- `GET /health` - Server health check

**Frontend Integration:**
Update your frontend API base URL to `http://localhost:3001` when using the mock server.

## Subscription Plans

The mock scripts include the following subscription plans:

### Monthly Plans
1. **Basic** - Rs. 999/month
   - Access to all workouts
   - Basic meal plans
   - Progress tracking
   - Email support

2. **Standard** - Rs. 1,999/month ⭐ (Popular)
   - All Basic features
   - Personalized meal plans
   - Advanced progress tracking
   - Priority support
   - Custom workout creation
   - Nutrition guidance

3. **Premium** - Rs. 2,999/month
   - All Standard features
   - Personal trainer consultation
   - Advanced analytics
   - Unlimited custom workouts
   - 24/7 priority support
   - Exclusive content access

### Annual Plans (17% savings)
4. **Basic Annual** - Rs. 9,999/year
5. **Standard Annual** - Rs. 19,999/year ⭐ (Best Value)
6. **Premium Annual** - Rs. 29,999/year

## Development Workflow

### Quick Setup
```bash
# 1. Set up admin and basic data
bun run admin:full-setup

# 2. Create subscription mock data
bun run mock:subscriptions --plans --revenue

# 3. Start mock API server (optional)
bun run mock:api-server
```

### Testing Scenarios
```bash
# Test with fresh subscription data
bun run mock:subscriptions-reset
bun run mock:subscriptions

# View revenue analytics
bun run mock:subscriptions-revenue

# Test frontend with mock API
bun run mock:api-server
```

## Notes

- All scripts require a MongoDB connection
- Mock data includes realistic usage patterns and payment statuses
- The API mock server includes request/response logging
- Scripts are designed to be safe for development environments
- Always backup production data before running reset commands

The `adminSetup.js` script provides functionality to:
- Create admin users
- Reset the database
- Seed sample data

### Usage

#### Create Admin User Only
```bash
bun run admin:create
```
Creates an admin user with default credentials:
- **Email**: admin@fitme.com
- **Password**: admin123

#### Reset Database and Create Admin
```bash
bun run admin:reset
```
Drops all collections and creates a fresh admin user.

#### Create Admin with Sample Data
```bash
bun run admin:seed
```
Creates admin user and seeds the database with sample meals and workouts.

#### Full Setup (Reset + Admin + Sample Data)
```bash
bun run admin:full-setup
```
Performs a complete setup: resets database, creates admin, and seeds sample data.

### Manual Script Execution

You can also run the script directly with custom options:

```bash
# Basic admin creation
node scripts/adminSetup.js

# Reset database only
node scripts/adminSetup.js --reset

# Create admin with sample data
node scripts/adminSetup.js --seed

# Full reset with sample data
node scripts/adminSetup.js --reset --seed
```

### Default Admin Credentials

**⚠️ IMPORTANT SECURITY NOTICE**

The script creates an admin user with default credentials:
- **Email**: `admin@fitme.com`
- **Password**: `admin123`

**You MUST change these credentials immediately after first login!**

### Admin Login

After creating the admin user, you can access the admin panel at:
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@fitme.com`
- **Password**: `admin123`

### Environment Variables

Ensure your `.env` file contains the MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/fitness_management
```

### Sample Data

When using the `--seed` option, the script creates:

#### Sample Meals
- Grilled Chicken Salad (350 cal, high-protein)
- Protein Smoothie Bowl (280 cal, vegetarian)

#### Sample Workouts
- Full Body Strength Training (45 min, intermediate)

### Error Handling

The script includes comprehensive error handling and will:
- Check for existing admin users
- Validate database connections
- Provide detailed error messages
- Clean up connections on exit

### Security Best Practices

1. **Change Default Password**: Immediately change the default admin password
2. **Use Strong Passwords**: Use complex passwords with mixed characters
3. **Environment Variables**: Store sensitive data in environment variables
4. **Access Logging**: All admin access attempts are logged
5. **Regular Updates**: Keep dependencies updated for security patches

### Troubleshooting

#### Database Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- Verify network connectivity

#### Permission Errors
- Ensure the script has write permissions
- Check MongoDB user permissions

#### Script Execution Issues
- Ensure Node.js version compatibility
- Check that all dependencies are installed (`bun install`)
- Verify the script path is correct

### Development Notes

- The script uses ES modules (import/export)
- Compatible with Node.js 14+
- Uses bcryptjs for password hashing (12 salt rounds)
- Includes graceful shutdown handling

For additional support or questions, please refer to the main project documentation.