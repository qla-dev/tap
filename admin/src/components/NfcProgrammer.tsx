/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Nfc, RefreshCw } from 'lucide-react';
import { ParsedTapProfile } from '../types';

interface NfcProgrammerProps {
  profile: ParsedTapProfile;
}

export default function NfcProgrammer({ profile }: NfcProgrammerProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const targetUrl = `${window.location.origin}/tap/${profile.slug}`;
  const isNfcSupported = 'NDEFReader' in window;

  const handleWriteNFC = async () => {
    setStatus('scanning');
    setMessage('Hold the NFC card against the back of this device and keep it still.');

    if ('NDEFReader' in window) {
      try {
        // @ts-ignore Web NFC is currently not part of the default TypeScript DOM library.
        const ndef = new window.NDEFReader();
        await ndef.write({
          records: [{ recordType: 'url', data: targetUrl }],
        });

        setStatus('success');
        setMessage(`The card now opens ${profile.name}.`);
      } catch (error: any) {
        console.error('NFC Error:', error);
        setStatus('error');
        setMessage(error?.message || 'Writing failed. Make sure NFC is enabled and try again.');
      }
      return;
    }

    window.setTimeout(() => {
      setStatus('success');
      setMessage(`Simulation complete. The card payload is ready for ${profile.name}.`);
    }, 1800);
  };

  return (
    <div
      id="nfc-programmer-card"
      className={`min-h-[430px] rounded-3xl border p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-center transition-colors ${
        status === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : status === 'error'
            ? 'border-rose-500/30 bg-rose-500/5'
            : 'border-blue-500/20 bg-slate-900'
      }`}
    >
      <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full border ${
        status === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : status === 'error'
            ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
      }`}>
        {status === 'scanning' ? (
          <RefreshCw className="h-11 w-11 animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle2 className="h-11 w-11" />
        ) : status === 'error' ? (
          <AlertTriangle className="h-11 w-11" />
        ) : (
          <Nfc className="h-12 w-12" />
        )}
      </div>

      <h3 className="font-display text-2xl font-bold text-white">
        {status === 'idle' && 'Ready to program card'}
        {status === 'scanning' && 'Hold card near device'}
        {status === 'success' && 'Card programmed'}
        {status === 'error' && 'Programming failed'}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        {status === 'idle'
          ? 'Program one physical NFC card to open this digital profile.'
          : message}
      </p>

      <div className="my-6 max-w-full rounded-xl bg-slate-950/70 px-4 py-3 font-mono text-xs text-blue-400 break-all select-all">
        {targetUrl}
      </div>

      {status === 'idle' && (
        <button
          type="button"
          onClick={handleWriteNFC}
          className="flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-500 active:scale-[0.98]"
        >
          <Nfc className="h-5 w-5" /> Program NFC Card
        </button>
      )}

      {status === 'scanning' && (
        <div className="w-full max-w-sm rounded-2xl border border-blue-500/20 bg-blue-500/10 px-6 py-4 text-sm font-semibold text-blue-400 animate-pulse">
          Waiting for NFC card…
        </div>
      )}

      {(status === 'success' || status === 'error') && (
        <button
          type="button"
          onClick={status === 'error' ? handleWriteNFC : () => setStatus('idle')}
          className="flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-slate-800 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-slate-700 active:scale-[0.98]"
        >
          {status === 'error' && <RefreshCw className="h-4 w-4" />}
          {status === 'error' ? 'Try Again' : 'Program Another Card'}
        </button>
      )}

      <p className="mt-5 text-[11px] text-slate-500">
        {isNfcSupported ? 'NFC writing is available on this device.' : 'Preview mode — use Chrome on Android to write a physical card.'}
      </p>
    </div>
  );
}
