// src/util/mailer.ts
import nodemailer from "nodemailer";

type TransporterCache = {
  transporter: nodemailer.Transporter | null;
  inited: boolean;
};

const cache: TransporterCache = { transporter: null, inited: false };

// Helper: read and validate SMTP env at runtime
function readSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;
  const allowEthereal = (process.env.MAIL_ALLOW_ETHEREAL ?? "false").toLowerCase() === "true";

  return { host, port, user, pass, from, allowEthereal };
}

async function buildTransporter(): Promise<nodemailer.Transporter> {
  const { host, port, user, pass, allowEthereal } = readSmtpConfig();

  // If full SMTP config present -> use it (Gmail or any SMTP)
  if (host && port && user && pass) {
    const t = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // TLS for 465, STARTTLS for 587 (secure:false)
      auth: { user, pass }
    });

    // verify connection once
    try {
      await t.verify();
    } catch (err) {
      console.error("Mailer: SMTP verification failed:", err);
      throw new Error(`SMTP verification failed: ${(err as Error).message}`);
    }

    console.log("Mailer: initialized real SMTP transporter (host=%s port=%s user=%s)", host, port, user);
    return t;
  }

  // If we get here and ethereal allowed -> return ethereal transporter for dev only
  if (allowEthereal) {
    console.warn("Mailer: SMTP config missing; creating Ethereal test account because MAIL_ALLOW_ETHEREAL=true");
    const testAccount = await nodemailer.createTestAccount();
    const t = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    return t;
  }

  // No valid config found
  
}

async function ensureTransporter() {
  if (cache.inited && cache.transporter) return cache.transporter;

  cache.inited = true; // mark we attempted init
  cache.transporter = await buildTransporter();
  return cache.transporter;
}

/**
 * sendMail - lazy initializes transporter and sends the mail.
 * Throws if SMTP config missing or send fails.
 */
export async function sendMail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}) {
  // Read from env each call so dotenv timing can't break it
  const { from } = readSmtpConfig();

  // Initialize transporter (may throw with helpful message)
  const transporter = await ensureTransporter();

  try {
    const info = await transporter.sendMail({
      from: opts.from ?? from ?? "no-reply@naviriti.local",
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html
    });

    // If using Ethereal, try to include preview URL (safe check)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preview = (nodemailer as any).getTestMessageUrl ? (nodemailer as any).getTestMessageUrl(info) : undefined;

    console.log("Mailer: message sent id=%s accepted=%o rejected=%o", info.messageId, info.accepted, info.rejected);
    return { info, preview };
  } catch (err) {
    console.error("Mailer: failed to send mail:", err);
    throw err;
  }
}
