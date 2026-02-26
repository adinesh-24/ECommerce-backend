const transporter = require("../config/mail.config");

// Removed local Gmail-specific transporter
// Centralized transporter from mail.config.js is now used.

// ── Send Order Confirmation ──────────────────────────────────
const sendOrderConfirmation = async ({ toEmail, username, orderId, products, shippingAddress, paymentMethod, total }) => {
  const productRows = products
    .map(item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">${item.productId?.title || "Product"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">₹${(item.productId?.price || 0) * item.quantity}</td>
      </tr>`)
    .join("");

  const paymentLabel = paymentMethod === "cod" ? "💵 Cash on Delivery" : "📲 UPI / Razorpay";

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#6366f1,#818cf8);padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">🎉 Order Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Thank you for shopping with us.</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 24px;">
        <p style="color:#334155;margin:0 0 4px;">Hi <strong>${username || "Customer"}</strong>,</p>
        <p style="color:#64748b;font-size:14px;margin:0 0 20px;">Your order has been placed and is now being processed.</p>

        <!-- Order ID -->
        <div style="background:#f8fafc;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
          <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order ID</span><br/>
          <strong style="color:#6366f1;font-size:15px;">#${orderId.toString().slice(-8).toUpperCase()}</strong>
        </div>

        <!-- Products table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Product</th>
              <th style="padding:8px 12px;text-align:center;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Qty</th>
              <th style="padding:8px 12px;text-align:right;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Price</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:700;color:#1e293b;text-align:right;">Total</td>
              <td style="padding:12px;font-weight:700;color:#6366f1;text-align:right;">₹${total}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Shipping -->
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;">
          <div style="flex:1;min-width:180px;background:#f8fafc;border-radius:10px;padding:14px 16px;">
            <span style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Shipping To</span>
            <p style="margin:6px 0 0;color:#334155;font-size:13px;line-height:1.6;">
              <strong>${shippingAddress?.fullName}</strong><br/>
              ${shippingAddress?.address}, ${shippingAddress?.city}<br/>
              ${shippingAddress?.state} – ${shippingAddress?.pincode}<br/>
              📞 ${shippingAddress?.phone}
            </p>
          </div>
          <div style="flex:1;min-width:180px;background:#f8fafc;border-radius:10px;padding:14px 16px;">
            <span style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Payment</span>
            <p style="margin:6px 0 0;color:#334155;font-size:13px;font-weight:600;">${paymentLabel}</p>
          </div>
        </div>

        <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">We'll notify you when your order ships. 🚚</p>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"E-Commerce Store" <${process.env.BREVO_SENDER}>`,
    to: toEmail,
    subject: `🎉 Order Confirmed – #${orderId.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

module.exports = { sendOrderConfirmation };
