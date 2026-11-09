interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const data = (await context.request.json()) as {
      name?: string;
      phone?: string;
      city?: string;
      pincode?: string;
      systemSizeKw?: number;
      state?: string;
      discom?: string;
      totalSubsidy?: number;
      netCost?: number;
      monthlySavings?: number;
      timestamp?: string;
    };

    const cleanPhone = (data.phone || '').trim();
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid 10-digit Indian mobile number required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Default to configured Bot Token and Chat ID; can also be overridden via Cloudflare Environment Variables
    const botToken = context.env?.TELEGRAM_BOT_TOKEN || '9171801343:AAHaOh1vpOJz10haB9a7F6QlmdtCf3S7BOw';
    const chatId = context.env?.TELEGRAM_CHAT_ID || '8175957596';

    const escapeHtml = (str: string = '') =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const name = escapeHtml(data.name || 'Anonymous Homeowner');
    const phone = escapeHtml(cleanPhone);
    const city = escapeHtml(data.city || 'Not specified');
    const pincode = escapeHtml(data.pincode || 'N/A');
    const state = escapeHtml(data.state || 'All India');
    const systemSize = data.systemSizeKw ? `${data.systemSizeKw} kW` : '3 kW';
    const subsidy = data.totalSubsidy ? `₹${Number(data.totalSubsidy).toLocaleString('en-IN')}` : '₹78,000';
    const netCost = data.netCost ? `₹${Number(data.netCost).toLocaleString('en-IN')}` : 'N/A';
    const savings = data.monthlySavings ? `₹${Number(data.monthlySavings).toLocaleString('en-IN')}/mo` : 'N/A';
    const dateStr = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const messageHtml = [
      `☀️ <b>NEW SOLAR QUOTE LEAD</b> ☀️`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Name:</b> ${name}`,
      `📱 <b>Phone:</b> <code>${phone}</code>`,
      `📍 <b>Location:</b> ${city}, ${pincode} (${state})`,
      `⚡ <b>System Size:</b> ${systemSize}`,
      `💰 <b>Govt. Subsidy:</b> ${subsidy}`,
      `💵 <b>Est. Savings:</b> ${savings}`,
      `🏷️ <b>Est. Net Cost:</b> ${netCost}`,
      `⏱️ <b>Submitted At:</b> ${dateStr} IST`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🌐 <i>solarcalculatorindia.com</i>`
    ].join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const tgResult = (await tgRes.json()) as any;

    if (!tgResult.ok) {
      console.error('Telegram API error:', tgResult);
      return new Response(
        JSON.stringify({ success: false, error: tgResult.description }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err: any) {
    console.error('Lead handler exception:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
