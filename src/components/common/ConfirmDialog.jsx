import React, { useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Custom confirmation dialog component — replaces window.confirm.
 * Usage: <ConfirmDialog isOpen={...} onConfirm={...} onCancel={...} title="..." message="..." />
 */
export const ConfirmDialog = React.memo(({ isOpen, onConfirm, onCancel, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', btnBg: '#EF4444' },
    warning: { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', btnBg: '#F59E0B' },
    primary: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', btnBg: '#3B82F6' },
  };
  const c = colors[variant] || colors.danger;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onCancel}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div className="card" style={{ position: 'relative', width: '100%', maxWidth: '400px', padding: '2rem', zIndex: 1, textAlign: 'center' }} onClick={e => e.stopPropagation()} role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
        {/* Close */}
        <button onClick={onCancel} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} aria-label="Close">
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: c.color }}>
          <AlertTriangle size={22} />
        </div>

        <h3 id="confirm-title" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
        <p id="confirm-msg" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>{message}</p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: c.btnBg, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
});

/**
 * Hook for using the custom confirm dialog.
 * Returns [ConfirmDialogComponent, showConfirm(options)]
 */
export const useConfirmDialog = () => {
  const [state, setState] = useState({ isOpen: false, title: '', message: '', variant: 'danger', resolve: null });

  const showConfirm = useCallback(({ title, message, variant = 'danger', confirmText, cancelText } = {}) => {
    return new Promise((resolve) => {
      setState({ isOpen: true, title, message, variant, confirmText, cancelText, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState(prev => ({ ...prev, isOpen: false }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState(prev => ({ ...prev, isOpen: false }));
  }, [state.resolve]);

  const DialogComponent = (
    <ConfirmDialog
      isOpen={state.isOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      title={state.title}
      message={state.message}
      variant={state.variant}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
    />
  );

  return [DialogComponent, showConfirm];
};
