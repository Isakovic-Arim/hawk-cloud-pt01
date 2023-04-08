import type { NextApiRequest, NextApiResponse } from 'next';
import Docker from 'dockerode';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const docker = new Docker({ host: 'localhost', port: 2375 });
    docker.createContainer({
        ...req.body,
        User: "root",
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: true,
        StdinOnce: false,
        Cmd: [
            "-f",
            "/dev/null"
        ],
        Entrypoint: "tail",
        Volumes: {
            "/volumes/data": {}
        },
        WorkingDir: "/",
        NetworkDisabled: false,
        MacAddress: "12:34:56:78:9a:bc",
        ExposedPorts: {
            "22/tcp": {}
        }
    });
    res.status(200).json(req.body);
}
