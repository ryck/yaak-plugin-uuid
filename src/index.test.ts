import { describe, expect, test } from 'vitest';
import { plugin } from "./index";

describe('UUID Plugin', () => {
    test('Exports plugin object', () => {
        expect(plugin).toBeTypeOf('object');
    });

    test('Plugin has templateFunctions', () => {
        expect(plugin.templateFunctions).toBeDefined();
        expect(Array.isArray(plugin.templateFunctions)).toBe(true);
        expect(plugin.templateFunctions?.length).toBeGreaterThan(0);
    });

    test('Each template function has name, description, and onRender', () => {
        plugin.templateFunctions?.forEach(templateFunction => {
            expect(templateFunction.name).toBeTypeOf('string');
            expect(templateFunction.description).toBeTypeOf('string');
            expect(templateFunction.onRender).toBeTypeOf('function');
        });
    });

    const algorithms = ['v1', 'v4', 'v6', 'v7'];

    algorithms.forEach(algorithm => {
        test(`${algorithm} onRender function returns a UUID ${algorithm} string`, async () => {
            const templateFunction = plugin.templateFunctions?.find(tf => tf.name === `uuid.${algorithm}`);
            expect(templateFunction).toBeDefined();

            if (templateFunction) {
                const mockContext = {
                    clipboard: { copyText: (text: string) => { } },
                    toast: { show: (args: any) => { } },
                    prompt: { text: async (args: any) => '' },
                    httpRequest: {
                        send: async (args: any): Promise<any> => ({
                            model: 'http_response' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            requestId: '',
                            bodyPath: '',
                            contentLength: 0,
                            elapsed: 0,
                            elapsedHeaders: 0,
                            error: null,
                            headers: [],
                            method: 'GET',
                            meta: {},
                            request: null,
                            status: 200,
                            statusReason: 'OK',
                            body: '',
                            url: '',
                            remoteAddr: '',
                            state: 'done' as const,
                            version: 1
                        }),
                        getById: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        }),
                        render: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        })
                    },
                    httpResponse: {
                        headers: [],
                        find: async (args: any) => []
                    },
                    templates: {
                        render: async (args: any): Promise<any> => null
                    }
                };
                const result = await templateFunction.onRender(mockContext, { values: { input: 'test' }, purpose: 'preview' });
                expect(typeof result === 'string' || result === null).toBe(true);

                if (typeof result === 'string') {
                    expect(result.length).toBeGreaterThan(0);
                    // Basic UUID format check (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
                    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

                    // Version-specific checks
                    const version = algorithm.substring(1); // Get the number from 'v1', 'v4', etc
                    const parts = result.split('-');
                    if (parts.length !== 5) {
                        throw new Error('Invalid UUID format');
                    }
                    const versionNibble = parseInt(parts[2]!.charAt(0), 16);
                    expect(versionNibble).toBe(parseInt(version));

                    // Variant check (should be 0b10xx for RFC4122)
                    const variantNibble = parseInt(parts[3]!.charAt(0), 16);
                    expect((variantNibble & 0b1100) >> 2).toBe(0b10);
                }
            }
        });
    });

    describe('Namespace-based UUIDs (v3 and v5)', () => {
        const namespaceVersions = ['v3', 'v5'];
        const testNamespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';
        const testName = 'test';

        namespaceVersions.forEach(algorithm => {
            test(`${algorithm} generates deterministic UUIDs for same name and namespace`, async () => {
                const templateFunction = plugin.templateFunctions?.find(tf => tf.name === `uuid.${algorithm}`);
                expect(templateFunction).toBeDefined();

                const mockContext = {
                    clipboard: { copyText: (text: string) => { } },
                    toast: { show: (args: any) => { } },
                    prompt: { text: async (args: any) => '' },
                    httpRequest: {
                        send: async (args: any): Promise<any> => ({
                            model: 'http_response' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            requestId: '',
                            bodyPath: '',
                            contentLength: 0,
                            elapsed: 0,
                            elapsedHeaders: 0,
                            error: null,
                            headers: [],
                            method: 'GET',
                            meta: {},
                            request: null,
                            status: 200,
                            statusReason: 'OK',
                            body: '',
                            url: '',
                            remoteAddr: '',
                            state: 'done' as const,
                            version: 1
                        }),
                        getById: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        }),
                        render: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        })
                    },
                    httpResponse: {
                        headers: [],
                        find: async (args: any) => []
                    },
                    templates: {
                        render: async (args: any): Promise<any> => null
                    }
                };

                // Generate UUID twice with same inputs
                const result1 = await templateFunction!.onRender(mockContext, {
                    values: { name: testName, namespace: testNamespace },
                    purpose: 'preview'
                });
                const result2 = await templateFunction!.onRender(mockContext, {
                    values: { name: testName, namespace: testNamespace },
                    purpose: 'preview'
                });

                expect(typeof result1).toBe('string');
                expect(typeof result2).toBe('string');
                expect(result1).toBe(result2);
            });

            test(`${algorithm} maintains correct version and variant bits`, async () => {
                const templateFunction = plugin.templateFunctions?.find(tf => tf.name === `uuid.${algorithm}`);
                const mockContext = {
                    clipboard: { copyText: (text: string) => { } },
                    toast: { show: (args: any) => { } },
                    prompt: { text: async (args: any) => '' },
                    httpRequest: {
                        send: async (args: any): Promise<any> => ({
                            model: 'http_response' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            requestId: '',
                            bodyPath: '',
                            contentLength: 0,
                            elapsed: 0,
                            elapsedHeaders: 0,
                            error: null,
                            headers: [],
                            method: 'GET',
                            meta: {},
                            request: null,
                            status: 200,
                            statusReason: 'OK',
                            body: '',
                            url: '',
                            remoteAddr: '',
                            state: 'done' as const,
                            version: 1
                        }),
                        getById: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        }),
                        render: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        })
                    },
                    httpResponse: {
                        headers: [],
                        find: async (args: any) => []
                    },
                    templates: {
                        render: async (args: any): Promise<any> => null
                    }
                };

                const result = await templateFunction!.onRender(mockContext, {
                    values: { name: testName, namespace: testNamespace },
                    purpose: 'preview'
                }) as string;

                expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

                const version = algorithm.substring(1);
                const parts = result.split('-');
                const versionNibble = parseInt(parts[2]!.charAt(0), 16);
                expect(versionNibble).toBe(parseInt(version));

                const variantNibble = parseInt(parts[3]!.charAt(0), 16);
                expect((variantNibble & 0b1100) >> 2).toBe(0b10);
            });

            test(`${algorithm} returns null with missing parameters`, async () => {
                const templateFunction = plugin.templateFunctions?.find(tf => tf.name === `uuid.${algorithm}`);
                const mockContext = {
                    clipboard: { copyText: (text: string) => { } },
                    toast: { show: (args: any) => { } },
                    prompt: { text: async (args: any) => '' },
                    httpRequest: {
                        send: async (args: any): Promise<any> => ({
                            model: 'http_response' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            requestId: '',
                            bodyPath: '',
                            contentLength: 0,
                            elapsed: 0,
                            elapsedHeaders: 0,
                            error: null,
                            headers: [],
                            method: 'GET',
                            meta: {},
                            request: null,
                            status: 200,
                            statusReason: 'OK',
                            body: '',
                            url: '',
                            remoteAddr: '',
                            state: 'done' as const,
                            version: 1
                        }),
                        getById: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        }),
                        render: async (args: any): Promise<any> => ({
                            model: 'http_request' as const,
                            id: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            workspaceId: '',
                            folderId: '',
                            authentication: null,
                            authenticationType: '',
                            bodyPath: '',
                            contentLength: 0,
                            method: 'GET',
                            url: '',
                            headers: [],
                            state: 'done' as const
                        })
                    },
                    httpResponse: {
                        headers: [],
                        find: async (args: any) => []
                    },
                    templates: {
                        render: async (args: any): Promise<any> => null
                    }
                };

                const resultNoName = await templateFunction!.onRender(mockContext, {
                    values: { namespace: testNamespace },
                    purpose: 'preview'
                });
                expect(resultNoName).toBeNull();

                const resultNoNamespace = await templateFunction!.onRender(mockContext, {
                    values: { name: testName },
                    purpose: 'preview'
                });
                expect(resultNoNamespace).toBeNull();
            });
        });
    });
});
