from pydantic import BaseModel
from quart import app, Blueprint, request, jsonify
import os
from supabase import create_client, Client

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


    @handler_bp.route("/transactions", methods=["GET"])
    async def get_transactions():
        try:
            supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
            response = (supabase.table("transactions").select('*').order("date",desc=True).execute())
            return jsonify(response.data)
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    return handler_bp