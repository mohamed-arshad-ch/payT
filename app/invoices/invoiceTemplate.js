export const generateInvoiceHTML = (invoice) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            background: #002B96;
            color: white;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 55%, transparent 55%);
        }
        .company-name {
            text-align: right;
            font-size: 2rem;
            margin: 0;
        }
        .company-subtitle {
            text-align: right;
            font-size: 1rem;
            margin: 0;
        }
        .invoice-title {
            text-align: center;
            font-size: 3rem;
            margin: 2rem 0;
        }
        .invoice-date {
            text-align: center;
            color: #666;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin: 2rem;
        }
        .invoice-to {
            font-size: 1.2rem;
        }
        .total-due {
            font-size: 1.2rem;
            text-align: right;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
        }
        th {
            background: #002B96;
            color: white;
            padding: 1rem;
            text-align: left;
        }
        td {
            padding: 1rem;
            border-bottom: 1px solid #ddd;
        }
        .amounts {
            text-align: right;
            margin: 2rem;
        }
        .total {
            background: #002B96;
            color: white;
            padding: 1rem;
            text-align: right;
            margin-top: 1rem;
        }
        .payment-method {
            margin: 2rem;
        }
        .contact-info {
            display: flex;
            justify-content: space-between;
            margin: 2rem;
            color: #666;
        }
        .footer {
            background: #002B96;
            height: 4rem;
            margin-top: 2rem;
            position: relative;
            overflow: hidden;
        }
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(-45deg, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 55%, transparent 55%);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">BORCELLE</h1>
        <p class="company-subtitle">COMPANY</p>
    </div>
    
    <h1 class="invoice-title">INVOICE</h1>
    <p class="invoice-date">Date : ${invoice.date}</p>
    
    <div class="invoice-details">
        <div class="invoice-to">
            <p>INVOICE TO:</p>
            <h2>${invoice.clientName}</h2>
        </div>
        <div class="total-due">
            <p>TOTAL DUE:</p>
            <h2>USD $${invoice.amount.toFixed(2)}</h2>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items?.map(item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                </tr>
            `).join('') || ''}
        </tbody>
    </table>
    
    <div class="amounts">
        <p>Sub-total: $${invoice.subTotal?.toFixed(2) || '0.00'}</p>
        <p>Tax: $${invoice.tax?.toFixed(2) || '0.00'}</p>
        <div class="total">$${invoice.amount.toFixed(2)}</div>
    </div>
    
    <div class="payment-method">
        <h3>Payment Method</h3>
        <p>Bank Name : ${invoice.bankName || 'Borcelle Company'}</p>
        <p>Account No : ${invoice.accountNo || '1234567890'}</p>
    </div>
    
    <div class="contact-info">
        <div>
            <p><strong>Phone.</strong></p>
            <p>${invoice.phone || '123-456-7890'}</p>
        </div>
        <div>
            <p><strong>Email.</strong></p>
            <p>${invoice.email || 'hello@reallygreatsite.com'}</p>
        </div>
        <div>
            <p><strong>Address.</strong></p>
            <p>${invoice.address || '123 Anywhere St., Any City'}</p>
        </div>
    </div>
    
    <div class="footer"></div>
</body>
</html>
`;

