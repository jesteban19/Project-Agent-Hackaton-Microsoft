from pydantic import BaseModel
from quart import app, Blueprint, request, jsonify

class MessageRequest(BaseModel):
    message: str

def create_handler_bp(agent):
    handler_bp = Blueprint('handler', __name__,url_prefix='/handler')

    @handler_bp.route("/message", methods=["POST"])
    async def handler_message():
        try:
            data = await request.get_json()
            message_request = MessageRequest(**data)
            process = await agent.message(message_request.message)
            return process
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    return handler_bp