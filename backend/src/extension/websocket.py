from fastapi import WebSocket, APIRouter

router = APIRouter()

@router.websocket("/ws/extension")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # handle received data
        await websocket.send_text(f"Message received: {data}")
