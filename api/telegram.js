export default async function handler(req, res) {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { message, type = 'payment' } = req.body;
        
        // Configuration Telegram
        const TELEGRAM_BOT_TOKEN = '8219481030:AAFlvMF148S2-fT-XmCVGyVEWZ_KR76YUkA';
        const TELEGRAM_CHAT_ID = '6523794278';
        
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            res.status(200).json({ 
                success: true, 
                message: 'Message envoyé avec succès',
                telegramResponse: data
            });
        } else {
            const errorData = await response.text();
            res.status(400).json({ 
                success: false, 
                error: 'Erreur Telegram',
                details: errorData
            });
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur serveur',
            details: error.message
        });
    }
}
