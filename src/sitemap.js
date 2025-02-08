import { Sitemap } from 'react-router-sitemap';

const sitemap = new Sitemap(['/', '/about', '/services', '/contact','/projects'])
  .build('https://www.bitecodes.com')
  .save('./public/sitemap.xml');
