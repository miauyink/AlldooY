/**
 * AlldooY - 人物与打赏运营中心
 * Professional Responsive Dark Theme Operations Center
 */

import React, { useState } from 'react';
import { NavTab, Person, AuditItem } from './types';
import {
  INITIAL_PEOPLE,
  INITIAL_ACCOUNTS,
  INITIAL_TIPS,
  INITIAL_GIFTS,
  INITIAL_SESSIONS,
  INITIAL_IDENTITY_LINKS,
  INITIAL_RECEIPTS,
  INITIAL_EXCLUSIONS,
  INITIAL_AUDITS,
} from './data/mockData';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { OverviewView } from './components/overview/OverviewView';
import { PeopleView } from './components/people/PeopleView';
import { TipsView } from './components/tips/TipsView';
import { GiftsView } from './components/gifts/GiftsView';
import { SessionsView } from './components/sessions/SessionsView';
import { AuditView } from './components/audit/AuditView';
import { EvidenceView } from './components/evidence/EvidenceView';
import { PersonDetailDrawer } from './components/people/PersonDetailDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedStreamer, setSelectedStreamer] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain state
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [tips, setTips] = useState(INITIAL_TIPS);
  const [gifts, setGifts] = useState(INITIAL_GIFTS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [identityLinks, setIdentityLinks] = useState(INITIAL_IDENTITY_LINKS);
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS);
  const [exclusions, setExclusions] = useState(INITIAL_EXCLUSIONS);
  const [audits, setAudits] = useState<AuditItem[]>(INITIAL_AUDITS);

  // Global drawer state for cross-view navigation
  const [drawerPerson, setDrawerPerson] = useState<Person | null>(null);
  const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);

  // Filter tips by streamer if selected
  const visibleTips = selectedStreamer === 'ALL'
    ? tips
    : tips.filter((t) => t.streamerAccount === selectedStreamer);

  // Filter sessions by streamer if selected
  const visibleSessions = selectedStreamer === 'ALL'
    ? sessions
    : sessions.filter((s) => s.streamerAccount === selectedStreamer);

  const pendingAuditCount = audits.filter((a) => a.status === 'pending').length;

  const handleResolveAudit = (id: string, action: 'confirmed' | 'rejected' | 'postponed') => {
    setAudits((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: action,
              reviewedAt: '2026-09-18 18:46:00',
              reviewedBy: '运营管理员 (MiauYink)',
            }
          : item
      )
    );
  };

  const handleRecoverExclusion = (importKey: string) => {
    // Add corresponding receipt
    setReceipts((prev) => [
      ...prev,
      {
        importKey,
        status: 'committed',
        source: 'manual_recovery',
        tipId: `TIP-REC-${importKey}`,
        timestamp: '2026-09-18 18:47:00',
        summary: `由运营人工审核撤销排除，恢复入账`,
      },
    ]);
  };

  const handleSelectPersonById = (id: string) => {
    const p = people.find((item) => item.id === id);
    if (p) {
      setDrawerPerson(p);
      setIsGlobalDrawerOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#090b0e] text-[#e2e8f0] overflow-hidden font-sans">
      {/* Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingAuditCount={pendingAuditCount}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          selectedStreamer={selectedStreamer}
          onSelectStreamer={setSelectedStreamer}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pendingAuditCount={pendingAuditCount}
          onNavigateTab={setActiveTab}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#090b0e]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewView
                people={people}
                tips={visibleTips}
                sessions={visibleSessions}
                audits={audits}
                onNavigateTab={setActiveTab}
                onSelectPersonById={handleSelectPersonById}
              />
            )}

            {activeTab === 'people' && (
              <PeopleView
                people={people}
                accounts={accounts}
                tips={tips}
                identityLinks={identityLinks}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {activeTab === 'tips' && (
              <TipsView
                tips={visibleTips}
                people={people}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectPersonById={handleSelectPersonById}
              />
            )}

            {activeTab === 'gifts' && (
              <GiftsView gifts={gifts} tips={tips} />
            )}

            {activeTab === 'sessions' && (
              <SessionsView sessions={visibleSessions} tips={tips} />
            )}

            {activeTab === 'audit' && (
              <AuditView audits={audits} onResolveAudit={handleResolveAudit} />
            )}

            {activeTab === 'evidence' && (
              <EvidenceView
                identityLinks={identityLinks}
                receipts={receipts}
                exclusions={exclusions}
                people={people}
                onRecoverExclusion={handleRecoverExclusion}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Person Detail Drawer (Accessible across Overview, Tips, etc.) */}
      <PersonDetailDrawer
        person={drawerPerson}
        isOpen={isGlobalDrawerOpen}
        onClose={() => setIsGlobalDrawerOpen(false)}
        accounts={accounts}
        tips={tips}
        identityLinks={identityLinks}
      />
    </div>
  );
}
