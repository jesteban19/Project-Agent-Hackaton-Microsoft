from quart import Quart
from quart_cors import cors
from dotenv import load_dotenv
from handler.agent.main import AgentHandler
import logging

from handler.controllers.handler_controller import create_handler_bp

logging.basicConfig(level=logging.INFO)
load_dotenv()

agent = AgentHandler()

app = Quart(__name__)
app = cors(app,allow_origin=["*"])

app.register_blueprint(create_handler_bp(agent))

app.run(use_reloader=True)