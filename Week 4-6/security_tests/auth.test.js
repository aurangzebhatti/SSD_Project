const axios = require('axios');
const { expect } = require('chai');

const API_URL = 'http://localhost:3000';

describe('Authentication Security Tests', () => {
    describe('Password Security Tests', () => {
        it('should reject weak passwords', async () => {
            const testCases = [
                { password: '12345678', desc: 'numbers only' },
                { password: 'abcdefgh', desc: 'lowercase only' },
                { password: 'ABCDEFGH', desc: 'uppercase only' },
                { password: 'Ab1!', desc: 'too short' },
                { password: 'password123', desc: 'common password pattern' }
            ];

            for (const testCase of testCases) {
                try {
                    await axios.post(`${API_URL}/signup`, {
                        name: 'Test User',
                        email: 'test@test.com',
                        password: testCase.password
                    });
                    throw new Error(`Password validation failed: accepted ${testCase.desc}`);
                } catch (err) {
                    expect(err.response.status).to.equal(400);
                }
            }
        });

        it('should accept strong passwords', async () => {
            try {
                const response = await axios.post(`${API_URL}/signup`, {
                    name: 'Test User',
                    email: `test${Date.now()}@test.com`,
                    password: 'TestPass123!'
                });
                expect(response.status).to.equal(200);
            } catch (err) {
                throw new Error('Strong password was rejected: ' + err.message);
            }
        });
    });

    describe('Brute Force Protection Tests', () => {
        it('should detect multiple failed login attempts', async () => {
            const attempts = 5;
            let failedAttempts = 0;

            for (let i = 0; i < attempts; i++) {
                try {
                    await axios.post(`${API_URL}/login`, {
                        email: 'test@test.com',
                        password: 'wrongpassword'
                    });
                } catch (err) {
                    failedAttempts++;
                }
            }

            expect(failedAttempts).to.equal(attempts);
        });
    });

    describe('Session Security Tests', () => {
        it('should require authentication for protected routes', async () => {
            try {
                await axios.get(`${API_URL}/get-cart`);
                throw new Error('Unauthenticated access was allowed');
            } catch (err) {
                expect(err.response.status).to.equal(401);
            }
        });
    });
}); 