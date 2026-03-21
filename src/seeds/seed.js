require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const connectDB = require('../config/db');
const User = require('../models/User');
const Publisher = require('../models/Publisher');
const AdSlot = require('../models/AdSlot');
const Campaign = require('../models/Campaign');
const Ad = require('../models/Ad');
const Impression = require('../models/Impression');
const Click = require('../models/Click');
const Invoice = require('../models/Invoice');
const Activity = require('../models/Activity');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Publisher.deleteMany({}),
    AdSlot.deleteMany({}),
    Campaign.deleteMany({}),
    Ad.deleteMany({}),
    Impression.deleteMany({}),
    Click.deleteMany({}),
    Invoice.deleteMany({}),
    Activity.deleteMany({}),
  ]);

  // Create demo advertiser
  console.log('Creating demo advertiser...');
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@adlyft.com',
    password: 'demo123',
    company: 'Demo Corp',
    apiKey: uuidv4(),
  });

  // Create publishers
  console.log('Creating publishers...');
  const publisherData = [
    { name: 'MetroGo', appName: 'MetroGo', category: 'Transport', dau: 50000, platform: 'Android', avgCTR: 2.8, description: 'Urban mobility app connecting commuters with metro services', contactEmail: 'ads@metrogo.com' },
    { name: 'GameZone', appName: 'GameZone', category: 'Gaming', dau: 120000, platform: 'All', avgCTR: 3.5, description: 'Casual gaming platform with 500+ games', contactEmail: 'ads@gamezone.com' },
    { name: 'DailyBuzz', appName: 'DailyBuzz', category: 'News', dau: 85000, platform: 'Web', avgCTR: 1.9, description: 'Breaking news and trending stories', contactEmail: 'ads@dailybuzz.com' },
    { name: 'FinTrack', appName: 'FinTrack', category: 'Finance', dau: 35000, platform: 'iOS', avgCTR: 2.1, description: 'Personal finance and investment tracker', contactEmail: 'ads@fintrack.com' },
    { name: 'FoodRush', appName: 'FoodRush', category: 'Food Delivery', dau: 95000, platform: 'Android', avgCTR: 4.2, description: 'Fast food delivery from 1000+ restaurants', contactEmail: 'ads@foodrush.com' },
    { name: 'FitLife', appName: 'FitLife', category: 'Health & Fitness', dau: 40000, platform: 'All', avgCTR: 2.6, description: 'Fitness tracking and workout plans', contactEmail: 'ads@fitlife.com' },
  ];

  const publishers = await Publisher.insertMany(publisherData.map(p => ({ ...p, status: 'active', apiKey: uuidv4() })));

  // Create ad slots for each publisher
  console.log('Creating ad slots...');
  const slotTypes = [
    { name: 'Home Screen Banner', screen: 'home', size: '320x50', type: 'banner', pricePerMonth: 500, cpm: 2.5 },
    { name: 'Fullscreen Interstitial', screen: 'transition', size: '320x480', type: 'interstitial', pricePerMonth: 1200, cpm: 5.0 },
    { name: 'Post-Action Banner', screen: 'post_action', size: '320x50', type: 'banner', pricePerMonth: 400, cpm: 2.0 },
    { name: 'In-Feed Native', screen: 'feed', size: '300x250', type: 'native', pricePerMonth: 800, cpm: 3.5 },
  ];

  const allSlots = [];
  for (const publisher of publishers) {
    for (const slotType of slotTypes) {
      const slotId = `${publisher.appName.toLowerCase()}_${slotType.screen}_${slotType.type}`;
      allSlots.push({ publisherId: publisher._id, slotId, ...slotType, status: 'available' });
    }
  }
  const slots = await AdSlot.insertMany(allSlots);

  // Create sample ad
  const ad = await Ad.create({
    advertiserId: user._id,
    imageUrl: '/uploads/sample_ad.png',
    clickUrl: 'https://democorp.com',
    altText: 'Demo Corp Advertisement',
    size: '320x50',
    format: 'png',
    status: 'active',
  });

  // Create sample campaigns
  console.log('Creating campaigns...');
  const now = new Date();
  const campaignData = [
    { name: 'Brand Launch Q1', objective: 'brand_awareness', status: 'active', publisherIdx: 0, slotIdx: 0, totalImpressions: 45230, totalClicks: 1267, totalSpend: 892.5 },
    { name: 'Summer App Promo', objective: 'traffic', status: 'active', publisherIdx: 1, slotIdx: 5, totalImpressions: 28450, totalClicks: 996, totalSpend: 567.8 },
    { name: 'Finance Campaign', objective: 'conversions', status: 'paused', publisherIdx: 3, slotIdx: 13, totalImpressions: 12800, totalClicks: 268, totalSpend: 312.0 },
    { name: 'Food Delivery Ads', objective: 'traffic', status: 'active', publisherIdx: 4, slotIdx: 16, totalImpressions: 67890, totalClicks: 2852, totalSpend: 1340.2 },
    { name: 'Fitness Brand Push', objective: 'brand_awareness', status: 'completed', publisherIdx: 5, slotIdx: 20, totalImpressions: 32100, totalClicks: 835, totalSpend: 650.0 },
    { name: 'News Portal Test', objective: 'traffic', status: 'draft', publisherIdx: 2, slotIdx: 10, totalImpressions: 0, totalClicks: 0, totalSpend: 0 },
  ];

  const campaigns = await Campaign.insertMany(campaignData.map((c) => ({
    advertiserId: user._id,
    name: c.name,
    objective: c.objective,
    publisherId: publishers[c.publisherIdx]._id,
    slotId: slots[c.slotIdx]._id,
    adId: ad._id,
    startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    dailyBudget: 50,
    totalBudget: 3000,
    status: c.status,
    totalImpressions: c.totalImpressions,
    totalClicks: c.totalClicks,
    totalSpend: c.totalSpend,
  })));

  // Update ad with campaign reference
  await Ad.findByIdAndUpdate(ad._id, { campaignId: campaigns[0]._id });

  // Create 30 days of impression and click data
  console.log('Creating impression and click data...');
  const impressionBulk = [];
  const clickBulk = [];

  for (let day = 0; day < 30; day++) {
    const date = new Date(now.getTime() - (30 - day) * 24 * 60 * 60 * 1000);
    const activeCampaigns = campaigns.filter(c => ['active', 'completed'].includes(c.status));

    for (const campaign of activeCampaigns) {
      const impressionCount = Math.floor(Math.random() * 800 + 200);
      const clickCount = Math.floor(impressionCount * (Math.random() * 0.04 + 0.01));

      for (let i = 0; i < impressionCount; i++) {
        impressionBulk.push({
          adId: ad._id,
          campaignId: campaign._id,
          publisherId: campaign.publisherId,
          slotId: campaign.slotId,
          timestamp: new Date(date.getTime() + Math.random() * 86400000),
        });
      }
      for (let i = 0; i < clickCount; i++) {
        clickBulk.push({
          adId: ad._id,
          campaignId: campaign._id,
          publisherId: campaign.publisherId,
          slotId: campaign.slotId,
          timestamp: new Date(date.getTime() + Math.random() * 86400000),
        });
      }
    }
  }

  // Insert in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < impressionBulk.length; i += batchSize) {
    await Impression.insertMany(impressionBulk.slice(i, i + batchSize));
  }
  for (let i = 0; i < clickBulk.length; i += batchSize) {
    await Click.insertMany(clickBulk.slice(i, i + batchSize));
  }

  // Create invoices
  console.log('Creating invoices...');
  const invoices = await Invoice.insertMany([
    {
      advertiserId: user._id,
      invoiceNumber: 'INV-2026-001',
      amount: 892.50,
      status: 'paid',
      dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      paidDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      items: [{ campaignId: campaigns[0]._id, campaignName: campaigns[0].name, impressions: 45230, clicks: 1267, amount: 892.50 }],
    },
    {
      advertiserId: user._id,
      invoiceNumber: 'INV-2026-002',
      amount: 567.80,
      status: 'paid',
      dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      paidDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      items: [{ campaignId: campaigns[1]._id, campaignName: campaigns[1].name, impressions: 28450, clicks: 996, amount: 567.80 }],
    },
    {
      advertiserId: user._id,
      invoiceNumber: 'INV-2026-003',
      amount: 1340.20,
      status: 'pending',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      items: [{ campaignId: campaigns[3]._id, campaignName: campaigns[3].name, impressions: 67890, clicks: 2852, amount: 1340.20 }],
    },
    {
      advertiserId: user._id,
      invoiceNumber: 'INV-2026-004',
      amount: 312.00,
      status: 'overdue',
      dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      items: [{ campaignId: campaigns[2]._id, campaignName: campaigns[2].name, impressions: 12800, clicks: 268, amount: 312.00 }],
    },
  ]);

  // Create activities
  console.log('Creating activities...');
  await Activity.insertMany([
    { userId: user._id, type: 'campaign_created', message: 'Campaign "Brand Launch Q1" was created', metadata: { campaignId: campaigns[0]._id }, timestamp: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'campaign_launched', message: 'Campaign "Brand Launch Q1" went live', metadata: { campaignId: campaigns[0]._id }, timestamp: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'campaign_created', message: 'Campaign "Summer App Promo" was created', metadata: { campaignId: campaigns[1]._id }, timestamp: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'payment_received', message: 'Payment received for INV-2026-001 ($892.50)', metadata: { invoiceId: invoices[0]._id }, timestamp: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'publisher_added', message: 'New publisher MetroGo added to network', metadata: { publisherId: publishers[0]._id }, timestamp: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'campaign_paused', message: 'Campaign "Finance Campaign" paused', metadata: { campaignId: campaigns[2]._id }, timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'ad_uploaded', message: 'New ad creative uploaded for Demo Corp', metadata: { adId: ad._id }, timestamp: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000) },
    { userId: user._id, type: 'payment_received', message: 'Payment received for INV-2026-002 ($567.80)', metadata: { invoiceId: invoices[1]._id }, timestamp: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000) },
  ]);

  console.log('\n=== Seed Complete ===');
  console.log(`✓ 1 Demo User: demo@adlyft.com / demo123`);
  console.log(`✓ ${publishers.length} Publishers created`);
  console.log(`✓ ${slots.length} Ad Slots created`);
  console.log(`✓ ${campaigns.length} Campaigns created`);
  console.log(`✓ 1 Ad creative created`);
  console.log(`✓ ${impressionBulk.length} Impressions created`);
  console.log(`✓ ${clickBulk.length} Clicks created`);
  console.log(`✓ ${invoices.length} Invoices created`);
  console.log(`✓ 8 Activities created`);

  mongoose.connection.close();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
