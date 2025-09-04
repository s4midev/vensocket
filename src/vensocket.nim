import asyncdispatch, ws, cligen

proc asyncFunc(action: string, key: string) {.async.} =
  let ws = await newWebSocket("ws://127.0.0.1:5777")
  echo await ws.receiveStrPacket()
  await ws.send(key)
  echo await ws.receiveStrPacket()
  await ws.send(action)
  ws.close()

proc main(action: string, key: string) = 
     waitFor(asyncFunc(action, key))

when isMainModule:
  dispatch main