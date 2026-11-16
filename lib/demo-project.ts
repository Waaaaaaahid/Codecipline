import { ProjectModel } from '@/models/Project';

export const DEMO_SOURCE_FILE = '__codecipline_demo_zip__';
export const DEMO_ZIP_BASE64 = 'UEsDBBQAAAAIAFVmcF2yLnXOnAAAAMwAAAAKAAAAUkVBRE1FLnR4dC2OsQrDMAxEd3/FfUGga9Z2CZQQ2k7dhK0mbh3LyAqhf18HCtru3emdJbCPJcXMuPAqmFTe7M25xxIr2hEs5i8qrSUxqmzqGc9hwlaSUOCAlyiMa8Nm2MJYST9sJVEDg+z5wPBKsnfO/ed73I3UWHGlHI7iRDO3NHruMYw3nJwbBUUlbN6iZPhmivbJKwfOFik1N2XE7NPWNDr3A1BLAwQUAAAACABVZnBdN+PKmnEAAACUAAAADgAAAHNyYy9pbmRleC5odG1sTY4xDoQwDAT7e4X5ABG95YYr6HlBDhsRnYMtLhLi90SkuWql1c5osWNbyuUCW8lKL3wCN4lMWFJRodFYluSadoG3ZMPQegxt9TG+KjHQJKoG62EZ/piu7gZCpzlmVwG2c1eLDKcd31+PwaupOUL7cANQSwMEFAAAAAgAVWZwXUaJy0JBAAAAQQAAAAoAAABzcmMvYXBwLmpzS87PK87PSdXLyU/XUHLOT0lNzizIycxLVUhJzc1XKM4vLUoGsvPL83LyE1NSUxSKS5OTU4uL00pzcioVlTStuQBQSwECFAMUAAAACABVZnBdsi51zpwAAADMAAAACgAAAAAAAAAAAAAAgAEAAAAAUkVBRE1FLnR4dFBLAQIUAxQAAAAIAFVmcF0348qacQAAAJQAAAAOAAAAAAAAAAAAAACAAcQAAABzcmMvaW5kZXguaHRtbFBLAQIUAxQAAAAIAFVmcF1GictCQQAAAEEAAAAKAAAAAAAAAAAAAACAAWEBAABzcmMvYXBwLmpzUEsFBgAAAAADAAMArAAAAMoBAAAAAA==';

/**
 * Idempotently creates one clearly-labelled demo project so the complete
 * payment/download journey can be tested without an admin ZIP upload.
 */
export async function ensureDemoProject() {
  return ProjectModel.findOneAndUpdate(
    { slug: 'codec-demo-starter' },
    {
      $setOnInsert: {
        slug: 'codec-demo-starter',
        name: 'Codecipline Demo Starter',
        shortDescription: 'A tiny starter project to test checkout and ZIP downloads.',
        description: 'This is a sample project created for testing the Codecipline marketplace purchase and source-code download flow. The ZIP contains a README, a simple HTML page, and a tiny JavaScript file.',
        category: 'websites',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        price: 1,
        thumbnail: '',
        screenshots: [],
        features: ['Tiny downloadable ZIP', 'README included', 'HTML starter page', 'JavaScript example'],
        liveUrl: '',
        demoVideo: '',
        sourceFile: DEMO_SOURCE_FILE,
        published: true,
        featured: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
