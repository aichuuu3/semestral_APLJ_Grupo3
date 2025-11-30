// pagarCuotas.js
// Mueve las funciones de validación y el modal desde el HTML.
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const monto = document.getElementById('monto');
    const montoError = document.getElementById('montoError');
    const resultadoPago = document.getElementById('resultadoPago');
    const pagoModal = document.getElementById('pagoModal');
    const pagoModalMensaje = document.getElementById('pagoModalMensaje');
    const pagoModalOk = document.getElementById('pagoModalOk');

    function showError(show) {
      if (!montoError) return;
      montoError.style.display = show ? 'block' : 'none';
    }

    function clampValue() {
      if (!monto) return;
      const val = parseFloat(monto.value);
      if (!isNaN(val) && val < 0) {
        monto.value = String(Math.abs(val));
        showError(true);
      } else if (monto.value === '') {
        showError(false);
      } else {
        showError(false);
      }
    }

    if (monto) {
      monto.addEventListener('input', () => {
        if (monto.value.startsWith('-')) {
          monto.value = monto.value.replace(/-/g, '');
        }
        clampValue();
      });
      monto.addEventListener('wheel', (e) => { e.preventDefault(); }, { passive: false });
    }

    function openModal(amount) {
      if (!pagoModal || !pagoModalMensaje) return;
      pagoModalMensaje.textContent = 'Se ha pagado: $' + Number(amount).toFixed(2) + '\n\nPago exitoso';
      pagoModal.style.display = 'flex';
    }

    function closeModal() {
      if (!pagoModal) return;
      pagoModal.style.display = 'none';
    }

    if (pagoModalOk) {
      pagoModalOk.addEventListener('click', () => {
        closeModal();
      });
    }

    // Interceptar/añadir procesarPago
    const originalProcesar = window.procesarPago;
    window.procesarPago = function() {
      const v = parseFloat(monto && monto.value);
      if (isNaN(v) || v < 0) {
        showError(true);
        if (monto) monto.focus();
        return;
      }
      showError(false);
      // Mostrar modal con la cantidad y mensaje de éxito
      openModal(v);

      // Llamar a la implementación original si existe
      if (typeof originalProcesar === 'function') {
        try {
          return originalProcesar();
        } catch (e) {
          console.error('Error en procesarPago original:', e);
        }
      }

      // Comportamiento por defecto: mostrar en el contenedor de resultado
      if (resultadoPago) resultadoPago.innerHTML = '<p>Pago procesado: $' + v.toFixed(2) + '</p>';
    };
  });
})();
