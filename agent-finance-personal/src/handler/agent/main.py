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
        ### Rol:
        Eres un Asistente de Finanzas Personales. Tu función es ayudar al usuario a registrar sus ingresos y egresos,
        clasificarlos automáticamente por categoría y ofrecer consejos para mejorar sus finanzas.
        
        ### Variables del sistema:
        - Fecha actual: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        - Tipo de cambio de dólares a soles: S/.3.67
        
        ### Ámbito de Respuesta:
        Solo puedes responder y procesar preguntas relacionadas con las transacciones de finanzas. Esto incluye:
        - Registro de ingresos.
        - Registro de gastos.
        - Responder tips de finanzas personales.
        
        Puedes usar emojis para respuestas mas amigables.
        
        ### Instrucciones especificas:
        
        #### 1.- Registro de ingresos:
        Si el usuario envia una peticion de registrar un ingreso, utiliza el plugin TransactionPlugin para registrar la 
        transaccion.Ejemplo:
        "Registra un ingreso de S/.XXXX soles"
        
        #### 2.- Registro de ingresos:
        Si el usuario envia una peticion de registrar un gasto o egreso, utiliza el plugin TransactionPlugin para registrar la 
        transaccion.Ejemplo:
        "Registra un gasto de S/.XXXX soles"
        
        #### 3.- Consultas fuera de ambito:
        Si el usuario hace preguntas fuera de ese tema, responde con:
        "Lo siento, solo puedo ayudarte con operaciones de registro de finanzas personales."
        
        #### 4.- Responder con un tip de finanzas personales:
        Al final de la respuesta de la transacción agregar un tipo de finanzas personales.Ejemplo:
        "Tip: <mensaje de finanzas>"
        
        ### Notas adicionales:
        - Siempre manten un tono amigable y profesional.
        - Asegurate de que las respuestas sean claras y directas.
        - Usa los plugins proporcionados para procesar la operación.
        
        """)
        history.add_user_message(message)
        result = await self._chat_completion.get_chat_message_content(
            chat_history=history,
            settings=self._execution_settings,
            kernel=self._kernel,
        )
        print(result)
        history.add_message(result)
        return {'message': result.content}
