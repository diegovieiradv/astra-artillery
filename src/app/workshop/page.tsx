'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { UpgradePanel } from './UpgradePanel';
import { CosmeticsPanel } from './CosmeticsPanel';
import { UPGRADE_CATEGORIES, COSMETIC_SLOTS, COSMETICS_DATA } from './constants';
import styles from './page.module.css';

export default function WorkshopPage() {
  return <div>Workshop</div>;
}
