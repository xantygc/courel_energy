'use client';

import type { CardComponentProps } from 'nextstepjs';

export const CustomTourCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      maxWidth: '340px',
      boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px var(--border)',
      color: 'var(--text)',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        {step.icon && (
          <div style={{ 
            fontSize: '24px', 
            background: 'var(--accent-dim)', 
            width: '40px', 
            height: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '10px',
            border: '1px solid var(--accent)'
          }}>
            {step.icon}
          </div>
        )}
        <h3 style={{ 
          margin: 0, 
          fontFamily: 'var(--font-head)', 
          fontSize: '18px', 
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: '0.02em'
        }}>
          {step.title}
        </h3>
      </div>

      <div style={{ 
        fontSize: '15px', 
        lineHeight: '1.6', 
        color: 'var(--text)', 
        marginBottom: '1.5rem' 
      }}>
        {step.content}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.05em' }}>
          {currentStep + 1} / {totalSteps}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {step.showSkip && !isLastStep && (
            <button 
              onClick={skipTour}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text3)',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 8px',
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              Saltar
            </button>
          )}

          {!isFirstStep && (
            <button 
              onClick={prevStep}
              className="btn-sm"
              style={{ padding: '6px 12px' }}
            >
              Anterior
            </button>
          )}

          <button 
            onClick={nextStep}
            className="btn-primary btn-sm"
            style={{ padding: '6px 16px' }}
          >
            {isLastStep ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>

      {/* Custom styles for the arrow if needed, but NextStep usually handles it */}
      <div style={{ position: 'absolute', color: 'var(--bg2)' }}>
        {arrow}
      </div>
    </div>
  );
};
