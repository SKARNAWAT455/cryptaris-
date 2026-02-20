const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function encryptText(text: string, password?: string) {
    const response = await fetch(`${API_URL}/encrypt/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, password: password || "default-key" }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Encryption failed");
    return response.json();
}

export async function decryptText(ciphertext: string, password?: string, salt?: string, nonce?: string) {
    const response = await fetch(`${API_URL}/decrypt/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ciphertext,
            password: password || "default-key",
            salt,
            nonce
        }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Decryption failed");
    return response.json();
}

export async function processFile(file: File, password: string, mode: "encrypt" | "decrypt") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password || "default-key");

    const endpoint = mode === "encrypt" ? "/encrypt/file" : "/decrypt/file";
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "File processing failed" }));
        throw new Error(error.error || "File processing failed");
    }

    // Return blob for download
    return response.blob();
}

export async function hideMessage(image: File, message: string, password?: string) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);
    if (password) formData.append("password", password);

    const response = await fetch(`${API_URL}/steganography/hide`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error((await response.json()).error || "Hiding message failed");
    return response.blob();
}

export async function revealMessage(image: File) {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${API_URL}/steganography/reveal`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error((await response.json()).error || "Revealing message failed");
    return response.json();
}

export async function createLink(url: string, password?: string, expires?: string) {
    const response = await fetch(`${API_URL}/links/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, password, expires }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Link creation failed");
    return response.json();
}

export async function accessLink(linkId: string, password?: string) {
    const response = await fetch(`${API_URL}/links/access/${linkId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Access failed");
    return response.json();
}

// AI Features
export async function analyzePassword(password: string) {
    const response = await fetch(`${API_URL}/ai/analyze-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Analysis failed");
    return response.json();
};

export async function generateDecoy(type: string) {
    const response = await fetch(`${API_URL}/ai/generate-decoy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Generation failed");
    return response.blob();
};

export async function sendContactMessage(name: string, email: string, message: string) {
    const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Failed to send message");
    return response.json();
}
