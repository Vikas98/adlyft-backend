require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const User = require('../models/User');
const AdSlot = require('../models/AdSlot');
const Campaign = require('../models/Campaign');
const Ad = require('../models/Ad');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    AdSlot.deleteMany({}),
    Campaign.deleteMany({}),
    Ad.deleteMany({}),
  ]);

  // Create admin
  console.log('Creating admin...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@adlyft.com',
    password: 'Admin@123',
    role: 'admin',
    status: 'approved',
  });

  // Create publishers
  console.log('Creating publishers...');
  const [pub1, pub2] = await User.create([
    {
      name: 'TechBlog Publisher',
      email: 'publisher1@adlyft.com',
      password: 'Publisher@123',
      role: 'publisher',
      status: 'approved',
      website: 'https://techblog.com',
      websiteCategory: 'technology',
    },
    {
      name: 'FashionHub Publisher',
      email: 'publisher2@adlyft.com',
      password: 'Publisher@123',
      role: 'publisher',
      status: 'approved',
      website: 'https://fashionhub.com',
      websiteCategory: 'fashion',
    },
  ]);

  // Create advertisers
  console.log('Creating advertisers...');
  const [adv1, adv2] = await User.create([
    {
      name: 'John Advertiser',
      email: 'advertiser1@adlyft.com',
      password: 'Advertiser@123',
      role: 'advertiser',
      status: 'approved',
      companyName: 'TechCorp Inc',
    },
    {
      name: 'Jane Advertiser',
      email: 'advertiser2@adlyft.com',
      password: 'Advertiser@123',
      role: 'advertiser',
      status: 'approved',
      companyName: 'FashionBrand Co',
    },
  ]);

  // Create ad slots
  console.log('Creating ad slots...');
  const slots = await AdSlot.create([
    {
      publisher: pub1._id,
      name: 'Header Banner',
      description: 'Top header banner slot',
      size: 'leaderboard',
      position: 'header',
      pricingModel: 'CPM',
      price: 5.00,
      adPreferences: { allowedCategories: ['technology', 'finance'], blockedCategories: [], allowedFormats: ['image', 'banner'] },
      status: 'active',
    },
    {
      publisher: pub1._id,
      name: 'Sidebar Rectangle',
      description: 'Right sidebar rectangle slot',
      size: 'rectangle',
      position: 'sidebar',
      pricingModel: 'CPC',
      price: 0.50,
      adPreferences: { allowedCategories: ['technology'], blockedCategories: [], allowedFormats: ['image'] },
      status: 'active',
    },
    {
      publisher: pub2._id,
      name: 'Fashion Footer Banner',
      description: 'Footer banner for fashion content',
      size: 'banner',
      position: 'footer',
      pricingModel: 'CPM',
      price: 3.00,
      adPreferences: { allowedCategories: ['fashion', 'lifestyle'], blockedCategories: [], allowedFormats: ['image', 'banner'] },
      status: 'active',
    },
    {
      publisher: pub2._id,
      name: 'In-Content Skyscraper',
      description: 'Skyscraper ad in article content',
      size: 'skyscraper',
      position: 'in-content',
      pricingModel: 'CPM',
      price: 4.00,
      adPreferences: { allowedCategories: ['fashion'], blockedCategories: ['gambling'], allowedFormats: ['image'] },
      status: 'active',
    },
  ]);

  // Create campaigns
  console.log('Creating campaigns...');
  const now = new Date();
  const campaigns = await Campaign.create([
    {
      advertiser: adv1._id,
      name: 'TechCorp Q1 Campaign',
      description: 'Brand awareness for TechCorp products',
      budget: 5000,
      spent: 1250.50,
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      targetCategory: 'technology',
    },
    {
      advertiser: adv2._id,
      name: 'FashionBrand Spring Sale',
      description: 'Spring collection promotion',
      budget: 3000,
      spent: 450.00,
      startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      targetCategory: 'fashion',
    },
  ]);

  // Create ads
  console.log('Creating ads...');
  await Ad.create([
    {
      advertiser: adv1._id,
      campaign: campaigns[0]._id,
      publisher: pub1._id,
      adSlot: slots[0]._id,
      title: 'TechCorp - Innovate Today',
      description: 'Discover the future of technology with TechCorp',
      imageUrl: 'https://s3.amazonaws.com/adlyft/techcorp-banner.jpg',
      destinationUrl: 'https://techcorp.com/products',
      status: 'approved',
      approvedBy: admin._id,
      approvedAt: new Date(),
    },
    {
      advertiser: adv2._id,
      campaign: campaigns[1]._id,
      publisher: pub2._id,
      adSlot: slots[2]._id,
      title: 'FashionBrand Spring Collection',
      description: 'New arrivals for spring 2026',
      imageUrl: 'https://s3.amazonaws.com/adlyft/fashionbrand-spring.jpg',
      destinationUrl: 'https://fashionbrand.com/spring',
      status: 'pending',
    },
  ]);

  console.log('\n=== Seed Complete ===');
  console.log('Admin:       admin@adlyft.com / Admin@123');
  console.log('Publisher 1: publisher1@adlyft.com / Publisher@123');
  console.log('Publisher 2: publisher2@adlyft.com / Publisher@123');
  console.log('Advertiser 1: advertiser1@adlyft.com / Advertiser@123');
  console.log('Advertiser 2: advertiser2@adlyft.com / Advertiser@123');

  mongoose.connection.close();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
