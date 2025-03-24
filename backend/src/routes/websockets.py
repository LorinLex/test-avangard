from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.schemas.task import TaskActionEnum, TaskPublic, \
    TaskWSActionCreateUpdate, TaskWSActionDelete


router = APIRouter(prefix="/ws", tags=["websockets"])


class ConnectionManager:
    active_connections: dict[int, WebSocket]

    def __init__(self) -> None:
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"Connect {user_id}!")

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        self.active_connections[user_id] = websocket
        print(f"Disconnect {user_id}!")

    async def send(self, user_id: int, data: str) -> None:
        try:
            websocket = self.active_connections[user_id]
            await websocket.send_text(data)
        except KeyError:
            print(f"User {user_id} is not connected!")

    async def send_create_task(
        self,
        user_id: int,
        task_data: TaskPublic,
    ):
        payload = TaskWSActionCreateUpdate.model_validate({
            "action": TaskActionEnum.CREATED,
            "data": task_data
        })
        await self.send(user_id, data=payload.model_dump_json())

    async def send_update_task(
        self,
        user_id: int,
        task_data: TaskPublic,
    ):
        payload = TaskWSActionCreateUpdate.model_validate({
            "action": TaskActionEnum.UPDATED,
            "data": task_data
        })
        await self.send(user_id, data=payload.model_dump_json())

    async def send_delete_task(
        self,
        user_id: int,
        task_id: int,
    ):
        payload = TaskWSActionDelete.model_validate({
            "action": TaskActionEnum.DELETED,
            "data": {"id": task_id}
        })
        await self.send(user_id, data=payload.model_dump_json())


ws_manager = ConnectionManager()


@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await ws_manager.connect(user_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            print(f"recieved on WS from user: {user_id}")
            print(data)
    except WebSocketDisconnect:
        ws_manager.disconnect(user_id, websocket)
