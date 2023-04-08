import type { NextApiRequest, NextApiResponse } from 'next'
var child_process = require('child_process');

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  child_process.exec(`start cmd.exe /K docker attach ${JSON.parse(req.body).name}`);
  res.status(200).json(req.body);
}
