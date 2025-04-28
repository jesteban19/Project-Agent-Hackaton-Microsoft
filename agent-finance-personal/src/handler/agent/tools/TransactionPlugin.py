from semantic_kernel.functions import kernel_function
import os
from supabase import create_client, Client


class TransactionPlugin:
    def __init__(self):
        self.supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

    @kernel_function(name="TransactionPlugin", description="""
    Registra transaccion de gastos o ingresos personales, recibe como parametro categoria,descripcion,precio,tipo,fecha.
    Si no se tiene los parametros correctos se debe rechazar la transacción.
    """)
    async def save_transaction(self, category, description, price, type, datetime):
        if category == "" or description == "" or price == "" or type == "" or datetime == "":
            return "No se pudo registrar la transacción por falta de parametros correctos."

        response = (self.supabase.table("transactions").insert(
            {"username": "xxx", "type": type, "amount": price, "category": category, "description": description,
             "date": datetime}).execute())
        print(response)
        return "Se registro la transacción."
