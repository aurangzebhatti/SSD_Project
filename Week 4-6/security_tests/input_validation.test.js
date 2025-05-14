const axios = require('axios');
const { expect } = require('chai');

const API_URL = 'http://localhost:3000';

describe('Input Validation Security Tests', () => {
    describe('XSS Prevention Tests', () => {
        it('should sanitize product input fields', async () => {
            const maliciousInput = {
                name: '<script>alert("xss")</script>Product',
                description: '<img src="x" onerror="alert(\'xss\')">Description',
                price: '100',
                category: 'Electronics'
            };

            try {
                const response = await axios.post(`${API_URL}/add-product`, maliciousInput);
                expect(response.data.message).to.not.include('<script>');
                expect(response.data.message).to.not.include('onerror');
            } catch (err) {
                expect(err.response.status).to.equal(400);
            }
        });
    });

    describe('SQL Injection Prevention Tests', () => {
        it('should handle SQL injection attempts in login', async () => {
            const sqlInjectionAttempts = [
                { email: "' OR '1'='1", password: "' OR '1'='1" },
                { email: "admin'--", password: "anything" },
                { email: "'; DROP TABLE users;--", password: "anything" }
            ];

            for (const attempt of sqlInjectionAttempts) {
                try {
                    await axios.post(`${API_URL}/login`, attempt);
                    throw new Error('SQL injection might be possible');
                } catch (err) {
                    expect(err.response.status).to.be.oneOf([400, 401]);
                }
            }
        });
    });

    describe('File Upload Security Tests', () => {
        it('should validate file types for product images', async () => {
            const formData = new FormData();
            formData.append('name', 'Test Product');
            formData.append('description', 'Test Description');
            formData.append('price', '100');
            formData.append('category', 'Electronics');
            
            // Create a fake executable file
            const fakeFile = new Blob(['<?php echo "malicious code"; ?>'], 
                { type: 'application/x-httpd-php' });
            formData.append('image', fakeFile, 'malicious.php');

            try {
                await axios.post(`${API_URL}/add-product`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                throw new Error('Dangerous file type was accepted');
            } catch (err) {
                expect(err.response.status).to.equal(400);
            }
        });
    });

    describe('Input Length and Format Tests', () => {
        it('should validate email format', async () => {
            const invalidEmails = [
                'notanemail',
                'missing@domain',
                '@nodomain.com',
                'spaces in@email.com',
                'unicode@😊.com'
            ];

            for (const email of invalidEmails) {
                try {
                    await axios.post(`${API_URL}/signup`, {
                        name: 'Test User',
                        email: email,
                        password: 'ValidPass123!'
                    });
                    throw new Error(`Invalid email format was accepted: ${email}`);
                } catch (err) {
                    expect(err.response.status).to.equal(400);
                }
            }
        });

        it('should enforce reasonable input lengths', async () => {
            const longInput = 'a'.repeat(1001);
            try {
                await axios.post(`${API_URL}/add-product`, {
                    name: longInput,
                    description: longInput,
                    price: '100',
                    category: 'Electronics'
                });
                throw new Error('Extremely long input was accepted');
            } catch (err) {
                expect(err.response.status).to.equal(400);
            }
        });
    });
}); 