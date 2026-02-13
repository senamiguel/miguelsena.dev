import fs from 'fs';
import path from 'path';

export function getButtonImages() {
  const dir = path.join(process.cwd(), 'public', 'buttons');
  try {
    return fs.readdirSync(dir).filter(file =>
      /\.(png|gif|jpg|jpeg|svg)$/i.test(file)
    );
  } catch {
    return [];
  }
}
