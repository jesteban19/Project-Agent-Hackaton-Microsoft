from semantic_kernel.functions import kernel_function


class TransactionPlugin:
    def __init__(self):
        pass

    @kernel_function(name="TransactionPlugin",description="""
    Registra transaccion de gastos o ingresos personales, recibe como parametro categoria,descripcion,precio,tipo,fecha.
    Si no se tiene los parametros correctos se debe rechazar la transacción.
    """)
    async def save_transaction(self, category, description, price, type, datetime):
        if category == "" or description == "" or price == "" or type == "" or datetime == "":
            return "No se pudo registrar la transacción por falta de parametros correctos."
        return "Se registro la transacción."
