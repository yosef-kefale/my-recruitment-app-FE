const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  // Hero and CTA images - Ethiopian office settings and professionals
  'hero-placeholder.jpg': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80',
  'cta-bg.jpg': 'https://images.unsplash.com/photo-1559239115-ce3eb7cb87ea?auto=format&fit=crop&w=2000&q=80',
  
  // Job category images
  'tech-category.jpg': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80',
  'business-category.jpg': 'https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&w=800&q=80',
  'production-category.jpg': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  'marketing-category.jpg': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'education-category.jpg': 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
  'healthcare-category.jpg': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
  'agriculture-category.jpg': 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=800&q=80',
  'construction-category.jpg': 'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?auto=format&fit=crop&w=800&q=80',

  // Feature section images
  'feature-matching.jpg': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'feature-application.jpg': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
  'feature-updates.jpg': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',

  // Testimonial profile images - Ethiopian professionals
  'testimonial-1.jpg': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
  'testimonial-2.jpg': 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
  'testimonial-3.jpg': 'https://images.unsplash.com/photo-1572985025058-f27aeca1b8bf?auto=format&fit=crop&w=400&q=80'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const filePath = path.join(__dirname, '../public/images/placeholders', filename);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => reject(err));
      });
    }).on('error', reject);
  });
};

const downloadAllImages = async () => {
  // Create directories if they don't exist
  const dirs = [
    path.join(__dirname, '../public/images'),
    path.join(__dirname, '../public/images/placeholders')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Download all images
  const downloads = Object.entries(images).map(([filename, url]) => 
    downloadImage(url, filename)
  );

  try {
    await Promise.all(downloads);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

downloadAllImages(); 