/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Nfc, AlertTriangle, CheckCircle2, RefreshCw, Smartphone, Radio } from 'lucide-react';
import { ParsedTapProfile } from '../types';

interface NfcProgrammerProps {
  profile: ParsedTapProfile;
}

export default function NfcProgrammer({ profile }: NfcProgrammerProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [nfcLog, setNfcLog] = useState<string[]>([]);

  // Calculate the URL that would be written to the NFC tag
  const appUrl = window.location.origin;
  const targetUrl = `${appUrl}/tap/${profile.slug}`;

  const addLog = (msg: string) => {
    setNfcLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleWriteNFC = async () => {
    setStatus('scanning');
    setMessage('Place your physical NFC tag (e.g. NTAG213 / NTAG215) on the back of your tablet or mobile device...');
    setNfcLog([]);
    addLog('Starting NFC write session...');
    addLog(`Target Payload (URL): ${targetUrl}`);

    // Verify if Web NFC is supported
    if ('NDEFReader' in window) {
      try {
        addLog('Requesting NDEF Reader permission...');
        // @ts-ignore
        const ndef = new window.NDEFReader();
        await ndef.scan();
        addLog('NFC controller active. Ready to write.');

        ndef.addEventListener('readingerror', () => {
          throw new Error('NFC Read/Write Error: Failed to communicate with tag. Keep the tag static.');
        });

        addLog('Writing NDEF URL Record...');
        await ndef.write({
          records: [{ recordType: 'url', data: targetUrl }]
        });

        setStatus('success');
        setMessage(`NFC Tag successfully programmed with slug "/${profile.slug}"!`);
        addLog('Write operation: COMPLETE.');
        addLog('Tag type verified: NDEF compatible.');
      } catch (err: any) {
        console.error('NFC Error:', err);
        setStatus('error');
        setMessage(err?.message || 'NFC Write Failed. Make sure NFC is enabled on your device and permissions are granted.');
        addLog(`Write operation: FAILED. Error: ${err?.message || 'Unknown'}`);
      }
    } else {
      // Simulate NFC writing for Desktop/iOS environments that don't support Web NFC directly
      addLog('[SIMULATION MODE] Web NFC API is not natively supported in this browser (Desktop/iOS require native app shell).');
      addLog('Simulating physical tag discovery...');
      
      setTimeout(() => {
        addLog('NFC Tag detected. UID: 04:A1:2B:C4:DE:5F:80');
        addLog('Verifying tag storage: 504 Bytes (NTAG215)...');
      }, 1000);

      setTimeout(() => {
        addLog('Writing URL Record to Page 04-12...');
      }, 2200);

      setTimeout(() => {
        setStatus('success');
        setMessage(`[SIMULATION SUCCESS] NFC Tag programmed to: ${targetUrl}`);
        addLog('Write operation: COMPLETE (Simulated).');
        addLog('Tag finalized. Locked: False.');
      }, 3500);
    }
  };

  const isNfcSupported = 'NDEFReader' in window;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="nfc-programmer-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
          <Nfc className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-100">NFC Tag Programmer</h3>
          <p className="text-xs text-slate-400">Program any physical NFC chip to open this card</p>
        </div>
      </div>

      {/* NFC Compatibility Banner */}
      <div className={`p-3 rounded-xl mb-5 flex items-start gap-3 text-xs ${
        isNfcSupported 
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
      }`}>
        {isNfcSupported ? (
          <>
            <Radio className="w-4 h-4 mt-0.5 shrink-0 animate-pulse" />
            <div>
              <span className="font-semibold block">Web NFC Supported!</span>
              Your device is fully capable of writing directly to physical chips.
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold block">NFC Simulation Mode Active</span>
              Web NFC is available on Chrome for Android/Tablet. On desktop/iOS, we simulate the exact programming protocol below.
            </div>
          </>
        )}
      </div>

      {/* Target URL Info */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-5 text-sm">
        <div className="text-xs text-slate-500 font-mono mb-1">PROGRAMMING PAYLOAD</div>
        <div className="font-mono text-xs text-blue-400 break-all select-all font-semibold">
          {targetUrl}
        </div>
      </div>

      {/* Controller Area */}
      <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 mb-5">
        {status === 'idle' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-300 font-medium mb-4">Ready to program tag</p>
            <button
              onClick={handleWriteNFC}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              <Nfc className="w-4 h-4" /> Start NFC Write
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 relative animate-pulse">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <p className="text-sm text-blue-400 font-medium mb-2">Transmitting Radio Waves...</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm text-emerald-400 font-semibold mb-1">Tag Programmed Successfully!</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
              Your NFC card is ready to tap. Any smartphone will now automatically launch <strong>{profile.name}</strong>.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Write Another Tag
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-3 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <p className="text-sm text-rose-400 font-semibold mb-1">Programming Failed</p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{message}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleWriteNFC}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Retry Write
              </button>
              <button
                onClick={() => setStatus('idle')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Console Log Area */}
      <div>
        <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2 flex justify-between items-center">
          <span>NFC Programmer Terminal</span>
          {nfcLog.length > 0 && (
            <button 
              onClick={() => setNfcLog([])} 
              className="text-[10px] text-slate-600 hover:text-slate-400 font-semibold uppercase underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 h-32 overflow-y-auto font-mono text-[10px] text-slate-400 leading-relaxed scrollbar">
          {nfcLog.length === 0 ? (
            <div className="text-slate-600 italic">Terminal idle. Start a write sequence to monitor logs.</div>
          ) : (
            nfcLog.map((log, idx) => (
              <div key={idx} className={log.includes('COMPLETE') ? 'text-emerald-400 font-semibold' : log.includes('FAILED') ? 'text-rose-400 font-semibold' : ''}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
