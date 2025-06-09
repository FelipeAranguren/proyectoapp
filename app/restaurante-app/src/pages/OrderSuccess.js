// OrderSuccess.js
import React from 'react';

const OrderSuccess = () => {
  const imagenConfirmacion = localStorage.getItem('imagenConfirmacion') || '/Marana-imagenes/tick.jpeg';

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>¡Pedido Confirmado!</h2>
        <div style={styles.imageContainer}>
          <img 
            src={imagenConfirmacion} 
            alt="Pedido confirmado" 
            style={styles.image}
          />
        </div>
        <p style={styles.message}>Gracias por tu compra. El pedido ha sido realizado.</p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff', // Fondo blanco sólido
    borderRadius: '10px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '100%',
    margin: '20px'
  },
  title: {
    fontSize: '24px',
    color: '#333333',
    marginBottom: '25px',
    fontWeight: '600'
  },
  imageContainer: {
    margin: '0 auto 25px',
    width: '100px',
    height: '100px'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  message: {
    fontSize: '16px',
    color: '#555555',
    marginTop: '15px',
    lineHeight: '1.5'
  }
};

export default OrderSuccess;