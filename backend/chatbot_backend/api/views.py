import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import requests
from rest_framework import status
from huggingface_hub import InferenceClient

openai.api_key = settings.OPENAI_API_KEY


HF_API_KEY = settings.HF_API_KEY
client = InferenceClient(api_key=HF_API_KEY)

class HuggingFaceChatView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            completion = client.chat.completions.create(
                model="deepseek-ai/DeepSeek-V3-0324",  # modern LLM from Hugging Face
                messages=[{"role": "user", "content": user_message}]
            )

            reply = completion.choices[0].message
            return Response({"reply": reply})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatBotView(APIView):
    def post(self, request):
        user_message = request.data.get("message")
        completion = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful chatbot."},
                {"role": "user", "content": user_message},
            ],
        )
        return Response({"reply": completion.choices[0].message.content})

