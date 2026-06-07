import { Router } from 'express';
import Roast from '../models/Roast.js';
import { validateUrl, extractDomain } from '../utils/validateUrl.js';
import { scrapeUrl } from '../services/scraper.js';
import { generateRoast } from '../services/roaster.js';
import { roastLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/roast (mounted at /api/roast)
router.post('/', roastLimiter, async (req, res) => {
  const { url } = req.body;
  const validUrl = validateUrl(url);
  const domain = extractDomain(validUrl);

  // Check if a roast for this URL was generated in the last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existingRoast = await Roast.findOne({
    url: validUrl,
    createdAt: { $gte: twentyFourHoursAgo }
  }).sort({ createdAt: -1 });

  if (existingRoast) {
    return res.status(200).json({
      data: existingRoast.toPublic(),
      cached: true
    });
  }

  // Scrape the website
  const scraped = await scrapeUrl(validUrl);

  // Generate the roast using Gemini AI
  const aiResult = await generateRoast(scraped);

  // Create new Roast in database
  const roast = new Roast({
    url: validUrl,
    domain: scraped.domain,
    favicon: scraped.favicon,
    pageTitle: scraped.title,
    summary: aiResult.summary,
    roast: aiResult.roast,
    verdict: aiResult.verdict
  });

  await roast.save();

  return res.status(201).json({
    data: roast.toPublic(),
    cached: false
  });
});

// GET /api/roasts (mounted at /api/roasts)
router.get('/', async (req, res) => {
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) page = 1;

  let limit = parseInt(req.query.limit, 10);
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 20) limit = 20;

  const skip = (page - 1) * limit;

  const [roasts, total] = await Promise.all([
    Roast.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Roast.countDocuments()
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return res.status(200).json({
    data: roasts.map((r) => r.toPublic()),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore
    }
  });
});

// GET /api/roasts/:id (mounted at /api/roasts/:id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ID matches 24-character hex string
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return res.status(400).json({
      error: 'INVALID_ID',
      message: 'Invalid Roast ID format'
    });
  }

  const roast = await Roast.findById(id);
  if (!roast) {
    return res.status(404).json({
      error: 'NOT_FOUND',
      message: 'Roast not found'
    });
  }

  return res.status(200).json({
    data: roast.toPublic()
  });
});

export default router;
