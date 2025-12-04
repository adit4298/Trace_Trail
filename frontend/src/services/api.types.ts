// src/lib/api.types.ts

export interface User {
    id: number;
    email: string;
    name: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface AnalysisResult {
    id: string;
    score: number;
    recommendations: string[];
}
