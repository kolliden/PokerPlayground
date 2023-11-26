#!/usr/bin/env python

import asyncio
import websockets
import os

async def echo(websockets, path):
    async for message in websockets:
        print ("Received and echoing message: "+message, flush=True)
        await websockets.send(message)



start_server = websockets.serve(echo, "0.0.0.0", os.environ.get('PORT') or 8080)

print("WebSockets echo server starting", flush=True)
asyncio.get_event_loop().run_until_complete(start_server)

print("WebSockets echo server running", flush=True)
asyncio.get_event_loop().run_forever()