const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(path: string) {
    const res = await fetch(`${API_BASE_URL}${path}`);
    return res.json();
}
