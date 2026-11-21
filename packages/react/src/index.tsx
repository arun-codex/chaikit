/**
 * @chaikit/react
 * React adapter and component wrapper for ChaiKit.
 * SSR-safe, fully typed, supports refs and reactive props.
 */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type {
  ChaiKitAnimation,
  ChaiKitPosition,
  ChaiKitTheme,
  ChaiTier,
} from '@chaikit/core';
import '@chaikit/widget';
import type { ChaiSupportElement } from '@chaikit/widget';

export interface ChaiSupportProps {
  creatorName: string;
  upiId: string;
  description?: string;
  buttonText?: string;
  theme?: ChaiKitTheme;
  position?: ChaiKitPosition;
  accentColor?: string;
  animation?: ChaiKitAnimation;
  enable3D?: boolean;
  demoMode?: boolean;
  headless?: boolean;
  defaultTierId?: string;
  tiers?: ChaiTier[];
  allowCustomAmount?: boolean;
  minAmountPaise?: number;
  maxAmountPaise?: number;
  note?: string;
  className?: string;
  style?: React.CSSProperties;

  // Event callbacks
  onOpen?: () => void;
  onClose?: () => void;
  onTierSelected?: (tier: ChaiTier) => void;
  onAmountChanged?: (amountPaise: number, formattedRupees: string) => void;
  onUpiHandoff?: (uri: string) => void;
  onError?: (message: string, code: string) => void;
}

export interface ChaiSupportRef {
  open: () => void;
  close: () => void;
  setAmount: (amountPaise: number) => void;
  getElement: () => ChaiSupportElement | null;
}

export const ChaiSupport = forwardRef<ChaiSupportRef, ChaiSupportProps>(
  (props, ref) => {
    const elementRef = useRef<ChaiSupportElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: () => elementRef.current?.open(),
        close: () => elementRef.current?.close(),
        setAmount: (paise: number) => elementRef.current?.setAmount(paise),
        getElement: () => elementRef.current,
      }),
      []
    );

    // Event listener attachments
    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      const handleOpened = () => props.onOpen?.();
      const handleClosed = () => props.onClose?.();
      const handleTier = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        props.onTierSelected?.(detail.tier);
      };
      const handleAmount = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        props.onAmountChanged?.(detail.amountPaise, detail.formattedRupees);
      };
      const handleHandoff = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        props.onUpiHandoff?.(detail.upiUri);
      };
      const handleError = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        props.onError?.(detail.message, detail.code);
      };

      el.addEventListener('chai:opened', handleOpened);
      el.addEventListener('chai:closed', handleClosed);
      el.addEventListener('chai:tier-selected', handleTier);
      el.addEventListener('chai:amount-changed', handleAmount);
      el.addEventListener('chai:upi-handoff-attempted', handleHandoff);
      el.addEventListener('chai:error', handleError);

      return () => {
        el.removeEventListener('chai:opened', handleOpened);
        el.removeEventListener('chai:closed', handleClosed);
        el.removeEventListener('chai:tier-selected', handleTier);
        el.removeEventListener('chai:amount-changed', handleAmount);
        el.removeEventListener('chai:upi-handoff-attempted', handleHandoff);
        el.removeEventListener('chai:error', handleError);
      };
    }, [
      mounted,
      props.onOpen,
      props.onClose,
      props.onTierSelected,
      props.onAmountChanged,
      props.onUpiHandoff,
      props.onError,
    ]);

    // Update config on props change
    useEffect(() => {
      const el = elementRef.current;
      if (!el) return;

      el.updateConfig({
        creatorName: props.creatorName,
        upiId: props.upiId,
        description: props.description,
        buttonText: props.buttonText,
        theme: props.theme,
        position: props.position,
        accentColor: props.accentColor,
        animation: props.animation,
        enable3D: props.enable3D,
        demoMode: props.demoMode,
        headless: props.headless,
        defaultTierId: props.defaultTierId,
        tiers: props.tiers,
        allowCustomAmount: props.allowCustomAmount,
        minAmountPaise: props.minAmountPaise,
        maxAmountPaise: props.maxAmountPaise,
        note: props.note,
      });
    }, [
      mounted,
      props.creatorName,
      props.upiId,
      props.description,
      props.buttonText,
      props.theme,
      props.position,
      props.accentColor,
      props.animation,
      props.enable3D,
      props.demoMode,
      props.headless,
      props.defaultTierId,
      props.tiers,
      props.allowCustomAmount,
      props.minAmountPaise,
      props.maxAmountPaise,
      props.note,
    ]);

    // During SSR or before client mount, render empty container to prevent hydration mismatches
    if (!mounted) {
      return null;
    }

    return (
      // @ts-expect-error React custom element support
      <chai-support
        ref={elementRef}
        creator-name={props.creatorName}
        upi-id={props.upiId}
        description={props.description}
        theme={props.theme}
        position={props.position}
        button-text={props.buttonText}
        accent-color={props.accentColor}
        headless={props.headless ? '' : undefined}
        enable-3d={props.enable3D ? '' : undefined}
        demo-mode={props.demoMode ? '' : undefined}
        note={props.note}
        default-tier={props.defaultTierId}
        min-amount={
          props.minAmountPaise ? Math.floor(props.minAmountPaise / 100) : undefined
        }
        max-amount={
          props.maxAmountPaise ? Math.floor(props.maxAmountPaise / 100) : undefined
        }
        className={props.className}
        style={props.style}
      />
    );
  }
);

ChaiSupport.displayName = 'ChaiSupport';

export * from '@chaikit/core';
