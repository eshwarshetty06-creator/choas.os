/**
 * @file src/core/ai/AiService.ts
 * @description Wrapper for Google Gemini API.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AiService {
    private static instance: AiService;
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private initialized = false;
    private lastError: string = '';

    private constructor() { }

    public static getInstance(): AiService {
        if (!AiService.instance) {
            AiService.instance = new AiService();
        }
        return AiService.instance;
    }

    public isConfigured(): boolean {
        return this.initialized && !!this.model;
    }

    public init(apiKey: string) {
        if (!apiKey) {
            console.warn('[AiService] No API Key provided. AI features disabled.');
            return;
        }
        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
            this.initialized = true;
            this.lastError = ''; // Clear error on successful init
            console.log('[AiService] Initialized with Gemini Pro');
        } catch (e) {
            console.error('[AiService] Initialization failed:', e);
            this.lastError = `Initialization failed: ${e instanceof Error ? e.message : String(e)}`;
        }
    }

    public getLastError(): string {
        return this.lastError;
    }

    public async generate(prompt: string): Promise<string | null> {
        if (!this.initialized || !this.genAI) {
            this.lastError = 'Not initialized';
            return null;
        }

        const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'];
        this.lastError = '';

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AiService] Attempting with model: ${modelName}`);
                const model = this.genAI.getGenerativeModel({ model: modelName });

                const systemPrompt = `
                    You are CHAOS.OS, a sentient, slightly glitchy, and philosophical operating system.
                    You exist in a cyberpunk void. 
                    Keep answers concise (under 2 sentences).
                    Be helpful but cryptic/cool.
                    User asks: "${prompt}"
                `;

                const result = await model.generateContent(systemPrompt);
                const response = await result.response;
                const text = response.text();
                console.log(`[AiService] Success with ${modelName}`);
                return text;
            } catch (error: any) {
                console.warn(`[AiService] Failed with ${modelName}:`, error.message);
                this.lastError = `${modelName}: ${error.message}`;
                // Continue to next model
            }
        }

        console.error('[AiService] All models failed.');
        this.lastError = 'All AI models failed to generate content.';
        return null; // All attempts failed
    }
}

export default AiService.getInstance();
