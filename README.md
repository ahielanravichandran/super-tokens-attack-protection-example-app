# SuperTokens Attack Protection Suite Demo

This project demonstrates the implementation of SuperTokens' Attack Protection Suite to protect against various authentication attacks.

## Features Implemented

- **Brute Force Protection**: Limits login attempts and detects suspicious patterns
- **Request ID Tracking**: Monitors and tracks authentication requests
- **Custom Security Middleware**: Implements security checks for sign-in/sign-up flows

## Setup

### Backend Configuration

1. Create `.env` file in backend directory
2. Configured security checks in `backend/security/securityChecks.ts`
3. Added middleware in `backend/config.ts`


### Frontend Implementation

1. Brute Force Demo Component
2. Integration with SuperTokens UI

   
## Testing the Protection

1. Create a test account
2. Click "Simulate Brute Force Attack" button
3. Observe how the system:
   - Detects multiple failed attempts
   - Implements rate limiting
   - Shows protection messages

## Documentation Reference

For more details about the Attack Protection Suite, visit:
[SuperTokens Attack Protection Documentation](https://supertokens.com/docs/additional-verification/attack-protection-suite/introduction)
