import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import VisitTracker from '@/components/VisitTracker';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <VisitTracker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}