/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Copy, Check, Download, Info, FileCode } from 'lucide-react';
import { ParsedTapProfile } from '../types';
import { generateSqlInsert } from '../services/api';

interface DatabaseExporterProps {
  profile: ParsedTapProfile;
}

export default function DatabaseExporter({ profile }: DatabaseExporterProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'laravel'>('sql');

  const sqlQuery = generateSqlInsert(profile);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlQuery], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qla_tap_${profile.slug || 'profile'}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Provide a clean Laravel migration outline to match the schema
  const laravelBlueprint = `<?php
// database/migrations/xxxx_xx_xx_create_taps_table.php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // bigint(20) UNSIGNED
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps(); // created_at, updated_at
            
            // Tap/Showcase Fields
            $table->string('phone_number')->nullable();
            $table->string('office_number')->nullable();
            $table->string('office_address')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('title')->nullable();
            $table->text('about_me')->nullable();
            $table->longText('gallery')->nullable(); // JSON Array
            $table->text('map_location')->nullable();
            $table->longText('testimonials')->nullable(); // JSON Array
            $table->longText('services')->nullable(); // JSON Array
            
            // Social Integrations
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->string('youtube')->nullable();
            
            // External booking / listings
            $table->text('booking')->nullable();
            $table->text('airbnb')->nullable();
            $table->text('google')->nullable();
            $table->string('pik')->nullable();
            
            // External Links & Metrics
            $table->string('website')->nullable();
            $table->string('directions')->nullable();
            $table->string('reviews')->nullable();
            $table->json('work_hours')->nullable();
            $table->integer('views')->default(0);
            $table->boolean('google_redirect')->default(false);
        });
    }
};`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="database-exporter-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-100">Laravel / SQL Sync Tool</h3>
            <p className="text-xs text-slate-400">Match 43 DB columns and export seamlessly</p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'sql' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MySQL SQL
          </button>
          <button
            onClick={() => setActiveTab('laravel')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'laravel' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Laravel Blueprint
          </button>
        </div>
      </div>

      <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl mb-5 text-xs text-indigo-300 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          This module matches your PHPMyAdmin column configurations perfectly. You can run the exported query directly in your database or follow the Laravel migration layout.
        </div>
      </div>

      {activeTab === 'sql' ? (
        <div className="relative">
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-750 flex items-center gap-1.5 text-[11px] font-medium cursor-pointer"
              title="Copy to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-medium cursor-pointer"
              title="Download .sql"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
          <div className="bg-slate-950 rounded-xl p-4 pt-12 border border-slate-850 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto h-72 scrollbar select-all">
            <pre>{sqlQuery}</pre>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute right-3 top-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(laravelBlueprint);
                alert('Laravel migration blueprint copied to clipboard!');
              }}
              className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-750 flex items-center gap-1.5 text-[11px] font-medium cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Schema</span>
            </button>
          </div>
          <div className="bg-slate-950 rounded-xl p-4 pt-12 border border-slate-850 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto h-72 scrollbar select-all">
            <pre>{laravelBlueprint}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
