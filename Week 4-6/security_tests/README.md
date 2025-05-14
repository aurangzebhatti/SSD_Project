# Security Testing Suite

This directory contains automated security tests for the e-commerce application. The tests cover various security aspects including authentication, input validation, session management, and authorization.

## Test Categories

1. **Authentication Tests** (`auth.test.js`)
   - Password strength validation
   - Brute force protection
   - Session security

2. **Input Validation Tests** (`input_validation.test.js`)
   - XSS prevention
   - SQL injection prevention
   - File upload security
   - Input length and format validation

3. **Session and Authorization Tests** (`session.test.js`)
   - Session management
   - Authorization checks
   - CSRF protection
   - Rate limiting

## Running the Tests

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run all tests:
   ```bash
   npm test
   ```

3. Run specific test categories:
   ```bash
   npm run test:auth     # Run authentication tests
   npm run test:input    # Run input validation tests
   npm run test:session  # Run session tests
   ```

4. Generate HTML report:
   ```bash
   npm run test:report
   ```
   The report will be generated in the `mochawesome-report` directory.

## Test Coverage

- **Authentication Security**
  - Password complexity requirements
  - Protection against brute force attacks
  - Session token security

- **Input Validation**
  - XSS attack prevention
  - SQL injection prevention
  - File upload vulnerabilities
  - Input length restrictions
  - Email format validation

- **Session Management**
  - Session invalidation after logout
  - Multi-factor authentication
  - Session fixation prevention

- **Authorization**
  - Role-based access control
  - Resource access protection
  - CSRF token validation
  - Rate limiting implementation

## Adding New Tests

To add new security tests:
1. Create a new test file with the `.test.js` extension
2. Import required dependencies (axios, chai)
3. Write test cases using the Mocha/Chai framework
4. Run the tests to ensure they work as expected

## Security Issues Found

Use this section to document any security issues discovered during testing:

1. [Issue Template]
   - **Severity**: [High/Medium/Low]
   - **Description**: [Brief description of the issue]
   - **Location**: [Where the issue was found]
   - **Status**: [Fixed/Pending/In Progress]
   - **Fix**: [How it was or should be fixed] 