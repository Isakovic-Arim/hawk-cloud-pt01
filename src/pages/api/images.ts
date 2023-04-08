import type { NextApiRequest, NextApiResponse } from 'next';
import Docker from 'dockerode';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const docker = new Docker({ host: 'localhost', port: 2375 });
    await docker.pull(req.body.image);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}