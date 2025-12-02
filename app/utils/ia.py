import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

def query_ia(mensaje_usuario: str) -> str:
    """Llama al modelo para clasificar la gravedad. Devuelve una de: 'alta','media','baja','spam'."""
    # Usar prompt que pida una única palabra exacta en minúsculas
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres un clasificador que analiza la gravedad de un reporte de convivencia escolar. "
                    "Responde SOLO con UNA de estas palabras EXACTAS en minúsculas y sin texto adicional: 'alta', 'media', 'baja', 'spam'."
                )
            },
            {"role": "user", "content": mensaje_usuario},
        ],
        temperature=0
    )
    return response.choices[0].message.content.strip().lower()