'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
    name: string,
    image: string,
    tag: string,
    memory: number
};

function Create() {
    const [tags, setTags] = useState([]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

    const fetchTags = async (image: string) => {
        if (image === null) {
            return;
        }

        const token = await fetch(`http://localhost/api/auth?image=${image}`).then(async response => (await response.json()).token);
        const response = await fetch(`http://localhost:80/api/tags?image=${image}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json());
        setTags(response.tags);
    }

    useEffect(() => {
        setTags([]);
        fetchTags(watch('image'));
    }, [watch('image')]);

    const onSubmit: SubmitHandler<Inputs> = async data => {
        const pullImageResponse = await fetch(`http://localhost:2375/images/create?fromImage=${data.image}:${data.tag}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const reader = pullImageResponse.body.getReader();
        let output = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            output += new TextDecoder().decode(value);
            // Check if the image has been fully pulled
            if (output.includes(`"status":"Download complete"`) || output.includes(`"status":"Image is up to date for ${data.image}:${data.tag}"`)) {
                console.log('Image pulled successfully');
                break;
            }
        }

        setTimeout(async () => {
            await fetch('/api/docker/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": `${data.name}`,
                    "Image": `${data.image}:${data.tag}`,
                    "HostConfig": {
                        "Memory": (data.memory * 1074000000000),
                        "Binds": [
                            "/tmp:/tmp"
                        ],
                        "PortBindings": {
                            "22/tcp": [
                                {
                                    "HostPort": "11022"
                                }
                            ]
                        },
                        "NetworkMode": "bridge",
                        "Devices": [],
                        "Sysctls": {
                            "net.ipv4.ip_forward": "1"
                        },
                        "LogConfig": {
                            "Type": "json-file",
                            "Config": {}
                        },
                        "SecurityOpt": [],
                        "StorageOpt": {},
                        "CgroupParent": "",
                        "VolumeDriver": "",
                        "ShmSize": 67108864
                    }
                })
            })
        }, 1000);

        // setTimeout(async () => await fetch(`http://localhost:2375/containers/create?name=${data.name}`, {
        //     method: 'POST',
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         "User": "root",
        //         "AttachStdin": true,
        //         "AttachStdout": true,
        //         "AttachStderr": true,
        //         "Tty": true,
        //         "OpenStdin": true,
        //         "StdinOnce": false,
        //         "Cmd": [
        //             "-f",
        //             "/dev/null"
        //         ],
        //         "Entrypoint": "tail",
        //         "Image": `${data.image}:${data.tag}`,
        //         "Volumes": {
        //             "/volumes/data": {}
        //         },
        //         "WorkingDir": "/",
        //         "NetworkDisabled": false,
        //         "MacAddress": "12:34:56:78:9a:bc",
        //         "ExposedPorts": {
        //             "22/tcp": {}
        //         },
        //         "HostConfig": {
        //             "Memory": (data.memory * 1074000000000),
        //             "Binds": [
        //                 "/tmp:/tmp"
        //             ],
        //             "PortBindings": {
        //                 "22/tcp": [
        //                     {
        //                         "HostPort": "11022"
        //                     }
        //                 ]
        //             },
        //             "NetworkMode": "bridge",
        //             "Devices": [],
        //             "Sysctls": {
        //                 "net.ipv4.ip_forward": "1"
        //             },
        //             "LogConfig": {
        //                 "Type": "json-file",
        //                 "Config": {}
        //             },
        //             "SecurityOpt": [],
        //             "StorageOpt": {},
        //             "CgroupParent": "",
        //             "VolumeDriver": "",
        //             "ShmSize": 67108864
        //         }
        //     })
        // }).then(response => response.json())
        //     .then(data => data.Id), 1000);
    };

    function Option({ name }) {
        return <li>
            <input {...register("image")} type="radio" id={name} value={name} className="hidden peer" />
            <label htmlFor={name} className="inline-flex items-center justify-between w-20 h-20 p-5 bg-gray-800 border rounded-lg cursor-pointer border-gray-700 peer-checked:bg-white hover:bg-gray-700">
                <div className="block">
                    <Image priority alt={name} width={200} height={200} src={`/svgs/${name}.svg`} />
                </div>
            </label>
        </li>
    }

    return <div className='w-full h-full grid place-items-center'>
        <form className='grid grid-cols-2 gap-x-5' onSubmit={handleSubmit(onSubmit)}>
            <fieldset className='m-5'>
                <legend className='text-3xl'>Meta-data</legend>
                <input className='p-2 my-5 rounded-md' pattern='[a-zA-Z-_\s]+' placeholder="Name" {...register("name", { required: true })} />
                {errors.name && <span>This field is required</span>}

                <ul className="grid w-96 gap-5 grid-cols-4 mb-4">
                    <Option name={'ubuntu'} />
                    <Option name={'alpine'} />
                    <Option name={'rockylinux'} />
                    <Option name={'archlinux'} />
                    <Option name={'mongo'} />
                    <Option name={'redis'} />
                    <Option name={'postgres'} />
                    <Option name={'influxdb'} />
                </ul>
                <p className='mb-5'>Image: {watch('image')}</p>

                <label htmlFor="memory" className="text-sm mr-5 font-medium text-gray-900 dark:text-white">GB: {watch('memory')}</label>
                <input id="memory" type="range" min="1" max="10" defaultValue="5" className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" {...register("memory", { required: true })} />
            </fieldset>

            <fieldset>
                <legend className='text-3xl'>Tag: {watch('tag')}</legend>
                <div className='grid grid-cols-2 xl:grid-cols-3 gap-2 h-96 overflow-y-scroll my-4 decoration-none'>
                    {
                        tags.map((tag, index) => {
                            return <div key={index}>
                                <input {...register("tag")} type="radio" id={tag} value={tag} className="hidden peer" />
                                <label htmlFor={tag} className='inline-flex items-center justify-evenly w-40 h-10 rounded-md bg-white text-black hover:bg-transparent hover:text-white cursor-pointer peer-checked:bg-transparent peer-checked:text-white'>
                                    <p>{tag}</p>
                                </label>
                            </div>
                        })
                    }
                </div>
            </fieldset>

            <button className='block col-span-2 hover:bg-white hover:text-black p-2 rounded-md text-3xl' type='submit'>Create</button>
        </form>
    </div>
}

export default Create;