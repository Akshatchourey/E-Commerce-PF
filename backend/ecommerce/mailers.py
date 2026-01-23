import os
from decimal import Decimal, ROUND_HALF_UP
from django.utils.html import escape
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def _format_money(value):
    if not isinstance(value, Decimal):
        try:
            value = Decimal(str(value))
        except Exception:
            return str(value)
    return f"{value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)}"


def _build_items_rows(order):
    rows = []
    for item in order.items.select_related("product").all():
        title = item.product.title if item.product else "Product"
        qty = item.quantity
        price = _format_money(item.price_at_purchase)
        rows.append(
            f"<tr>"
            f"<td style='padding:8px;border:1px solid #e5e7eb'>{escape(title)}</td>"
            f"<td style='padding:8px;border:1px solid #e5e7eb;text-align:center'>{qty}</td>"
            f"<td style='padding:8px;border:1px solid #e5e7eb;text-align:right'>₹{price}</td>"
            f"</tr>"
        )
    return "\n".join(rows)


def _build_order_email_html(order):
    rows_html = _build_items_rows(order)
    total = _format_money(order.total_amount)
    order_id = escape(order.public_order_id)
    customer = escape(order.user.first_name or order.user.email)
    return (
        "<!DOCTYPE html>"
        "<html lang='en'>"
        "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>"
        "<body style='font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:24px'>"
        "<div style='max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px'>"
        "<div style='padding:24px;border-bottom:1px solid #e5e7eb'>"
        f"<h2 style='margin:0;font-size:20px;color:#111827'>Thank you, {customer}!</h2>"
        f"<p style='margin:8px 0 0;color:#374151'>Your order <strong>{order_id}</strong> is completed.</p>"
        "</div>"
        "<div style='padding:24px'>"
        "<h3 style='margin:0 0 12px;color:#111827;font-size:16px'>Order items</h3>"
        "<table style='width:100%;border-collapse:collapse;border:1px solid #e5e7eb'>"
        "<thead>"
        "<tr style='background:#f3f4f6'>"
        "<th style='padding:8px;border:1px solid #e5e7eb;text-align:left'>Item</th>"
        "<th style='padding:8px;border:1px solid #e5e7eb;text-align:center'>Qty</th>"
        "<th style='padding:8px;border:1px solid #e5e7eb;text-align:right'>Price</th>"
        "</tr>"
        "</thead>"
        f"<tbody>{rows_html}</tbody>"
        "</table>"
        "<div style='margin-top:16px;text-align:right'>"
        f"<p style='margin:0;color:#111827'><strong>Total:</strong> ₹{total}</p>"
        "</div>"
        "</div>"
        "<div style='padding:24px;border-top:1px solid #e5e7eb;color:#4b5563;font-size:14px'>"
        "<p style='margin:0'>We appreciate your purchase. If you need help, reply to this email.</p>"
        "</div>"
        "</div>"
        "</body>"
        "</html>"
    )


def _build_order_email_text(order):
    lines = [
        f"Thank you!",
        f"Your order {order.public_order_id} is completed.",
        "",
        "Order items:",
    ]
    for item in order.items.select_related("product").all():
        title = item.product.title if item.product else "Product"
        lines.append(f"- {title} x {item.quantity} @ ₹{_format_money(item.price_at_purchase)}")
    lines.append("")
    lines.append(f"Total: ₹{_format_money(order.total_amount)}")
    lines.append("")
    lines.append("We appreciate your purchase. If you need help, reply to this email.")
    return "\n".join(lines)


def send_order_completed_email(order, to_email=None):
    recipient = to_email or order.user.email
    subject = f"Order {order.public_order_id} completed"
    html_body = _build_order_email_html(order)
    text_body = _build_order_email_text(order)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.EMAIL_HOST_USER,
        to=[recipient]
    )
    msg.attach_alternative(html_body, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
