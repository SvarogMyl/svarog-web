import { NextRequest, NextResponse } from "next/server";

const MAIL_URL = "https://mail.svasoft.cl/mail/send";
const CONTACT_EMAIL = "contacto@svasoft.cl";

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/**
 * Token de servicio para lab-mail-service, firmado aquí por cada envío y de 5 minutos.
 *
 * Antes era un token fijo guardado como secreto (`MAIL_SERVICE_TOKEN`). lab-mail-service ya no
 * acepta tokens de vida larga ni de sesión (S16): exige `roles: ["service"]`, un `sub` conocido y
 * vencimiento corto, firmado con su propio secreto. HS256 con Web Crypto: corre igual en el Worker.
 */
async function serviceToken(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = b64url(enc.encode(JSON.stringify({ sub: "svarog-web", roles: ["service"], iat: now, exp: now + 300 })));
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${header}.${payload}`)));
  return `${header}.${payload}.${b64url(sig)}`;
}

/** Lo que escribe una persona en el formulario va dentro de un correo HTML: se escapa. */
const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  const secret = process.env.MAIL_SERVICE_JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let name: string, email: string, message: string;
  try {
    ({ name, email, message } = await req.json());
    if (!name || !email || !message) throw new Error("Missing fields");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const body = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <h2 style="color:#f59e0b">Nuevo mensaje de contacto — svasoft.cl</h2>
  <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  <hr style="border:1px solid #333;margin:16px 0"/>
  <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
</div>
  `.trim();

  try {
    const res = await fetch(MAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await serviceToken(secret)}`,
      },
      body: JSON.stringify({
        to: CONTACT_EMAIL,
        subject: `Contacto svasoft.cl — ${name}`,
        body,
        template: "custom",
        data: {},
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("mail-service error:", res.status, detail);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
