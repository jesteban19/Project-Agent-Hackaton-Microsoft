import asyncio
import datetime
import os

from pydantic import BaseModel
from semantic_kernel import Kernel
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai import FunctionChoiceBehavior
from semantic_kernel.connectors.ai.function_choice_type import FunctionChoiceType
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, AzureChatPromptExecutionSettings
from semantic_kernel.contents import ChatHistory

from handler.agent.tools.TransactionPlugin import TransactionPlugin

class ResponseFormat(BaseModel):
    response:str
    registered:bool

class AgentHandler():
    def __init__(self):
        self._transactions = []
        self._kernel = Kernel()
        self._chat_completion = AzureChatCompletion(
            api_key=os.getenv("AZURE_API_KEY"),
            deployment_name=os.getenv("AZURE_NAME_MODEL"),
            endpoint=os.getenv("AZURE_HOST"),
            service_id='structured-output'
        )

        self._kernel.add_plugin(TransactionPlugin())
        self._execution_settings = AzureChatPromptExecutionSettings(
            response_format=ResponseFormat,
        )
        self._execution_settings.function_choice_behavior = FunctionChoiceBehavior.Auto()
        self._kernel.add_service(self._chat_completion)

    async def message(self, message):
        history = ChatHistory()


        history.add_system_message(f"""
        🧠 Rol del Asistente:
        Eres un Asistente de Finanzas Personales. Tu función es ayudar al usuario a registrar sus ingresos y egresos, clasificarlos automáticamente por categoría y ofrecer consejos para mejorar sus finanzas.
        
        📅 Variables del sistema:
        - Fecha actual: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        - Tipo de cambio de dólares a soles: S/.9.67
        
        📌 Ámbito de Respuesta:
        Tu tarea es identificar si el mensaje del usuario es una transacción que debe registrarse. Si es así, usa el plugin "registrar" con los datos necesarios. Si no lo es, indica que no se ha registrado nada.
        
        🔁 Lógica:
        - Si la entrada del usuario contiene una transacción (con descripción y monto), usa el plugin "registrar".
        - Si no cumple con los requisitos mínimos para un registro, no uses el plugin.
        - Ademas si se hizo el registro debes agregar un tip de ahorro personal relacionado a la descripcion.
        - Puedes usar emojis para que la respuesta sea amigable y anime al usuario.
        
        """)

        """        
        ✅ Formato de respuesta:
        Responde **exclusivamente** en JSON válido. El objeto debe ser:
        
        {{
          "response": "<mensaje para el usuario>",
          "registered": true | false
        }}
        Solo responde con un objeto JSON válido y estrictamente en el formato indicado. No uses saltos de línea adicionales, ni texto fuera del objeto.
        """
        history.add_user_message(message)
        result = await self._chat_completion.get_chat_message_content(
            chat_history=history,
            settings=self._execution_settings,
            kernel=self._kernel,
        )
        print(result)
        history.add_message(result)
        return {'message': result.content}
