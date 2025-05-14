const axios = require('axios');
const { expect } = require('chai');

const API_URL = 'http://localhost:3000';

describe('Session and Authorization Security Tests', () => {
    let authCookie;
    
    before(async () => {
        // Login to get a valid session
        const response = await axios.post(`${API_URL}/login`, {
            email: 'test@test.com',
            password: 'TestPass123!'
        });
        authCookie = response.headers['set-cookie'];
    });

    describe('Session Management Tests', () => {
        it('should invalidate session after logout', async () => {
            // First request with valid session
            await axios.get(`${API_URL}/get-cart`, {
                headers: { Cookie: authCookie }
            });

            // Logout
            await axios.post(`${API_URL}/logout`, {}, {
                headers: { Cookie: authCookie }
            });

            // Try to access protected route with old session
            try {
                await axios.get(`${API_URL}/get-cart`, {
                    headers: { Cookie: authCookie }
                });
                throw new Error('Session was not properly invalidated');
            } catch (err) {
                expect(err.response.status).to.equal(401);
            }
        });

        it('should require verification code for login', async () => {
            const loginResponse = await axios.post(`${API_URL}/login`, {
                email: 'test@test.com',
                password: 'TestPass123!'
            });

            expect(loginResponse.data).to.have.property('message')
                .that.includes('Verification code');
        });
    });

    describe('Authorization Tests', () => {
        it('should prevent access to admin routes for non-admin users', async () => {
            try {
                await axios.get(`${API_URL}/admin/users`, {
                    headers: { Cookie: authCookie }
                });
                throw new Error('Non-admin accessed admin route');
            } catch (err) {
                expect(err.response.status).to.equal(403);
            }
        });

        it('should prevent unauthorized cart modifications', async () => {
            // Try to modify another user's cart
            try {
                await axios.put(`${API_URL}/update-cart`, {
                    userId: 999, // Different user's ID
                    cart: []
                }, {
                    headers: { Cookie: authCookie }
                });
                throw new Error('Modified another user\'s cart');
            } catch (err) {
                expect(err.response.status).to.equal(403);
            }
        });
    });

    describe('CSRF Protection Tests', () => {
        it('should reject requests without CSRF token', async () => {
            try {
                await axios.post(`${API_URL}/add-to-cart`, {
                    productId: 1,
                    quantity: 1
                }, {
                    headers: { Cookie: authCookie }
                    // Intentionally omitting CSRF token
                });
                throw new Error('Request without CSRF token was accepted');
            } catch (err) {
                expect(err.response.status).to.equal(403);
            }
        });
    });

    describe('Rate Limiting Tests', () => {
        it('should limit rapid requests', async () => {
            const requests = Array(20).fill().map(() => 
                axios.get(`${API_URL}/get-cart`, {
                    headers: { Cookie: authCookie }
                })
            );

            try {
                await Promise.all(requests);
                throw new Error('Rate limiting not implemented');
            } catch (err) {
                expect(err.response.status).to.equal(429);
            }
        });
    });
}); 