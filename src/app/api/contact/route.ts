import { NextRequest, NextResponse } from "next/server";

const MAIL_URL = "https://mail.svasoft.cl/mail/send";
const CONTACT_EMAIL = "contacto@svasoft.cl";

export async function POST(req: NextRequest) {
  const token = process.env.MAIL_SERVICE_TOKEN;
  if (!token) {
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
  <p><strong>Nombre:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <hr style="border:1px solid #333;margin:16px 0"/>
  <p style="white-space:pre-wrap">${message}</p>
</div>
  `.trim();

  try {
    const res = await fetch(MAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
