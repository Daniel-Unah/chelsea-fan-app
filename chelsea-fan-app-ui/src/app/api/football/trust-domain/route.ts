import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Path to next.config.js
    const configPath = path.join(process.cwd(), 'next.config.js');
    
    // Read the current config
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if domain is already in the config
    if (configContent.includes(domain)) {
      return NextResponse.json({ message: 'Domain already trusted', domain });
    }
    
    // Find the images.remotePatterns array and add the new domain
    const pattern = /(\s*{\s*protocol:\s*'https',\s*hostname:\s*'[^']+',\s*port:\s*'',\s*pathname:\s*'\/\*\*'\s*},?\s*)/g;
    const newPattern = `      { protocol: 'https', hostname: '${domain}', port: '', pathname: '/**' },\n$1`;
    
    // Replace the last pattern with our new pattern + the last pattern
    const matches = configContent.match(pattern);
    if (matches) {
      const lastMatch = matches[matches.length - 1];
      configContent = configContent.replace(lastMatch, newPattern);
    }
    
    // Write the updated config back
    fs.writeFileSync(configPath, configContent, 'utf8');
    
    return NextResponse.json({ 
      message: 'Domain added to trusted list', 
      domain,
      note: 'Restart dev server to apply changes'
    });
    
  } catch (error) {
    console.error('Error adding trusted domain:', error);
    return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 });
  }
} 