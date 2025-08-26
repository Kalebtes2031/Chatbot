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
        messages = request.data.get("messages", [])
        if not messages:
            return Response({"error": "No messages provided"}, status=status.HTTP_400_BAD_REQUEST)

        system_msg = {
            "role": "system",
            "content": "You are a professional AI assistant that helps users with code and general questions."
        }
        messages = [system_msg] + messages

        try:
            response = client.chat_completion(
                model="deepseek-ai/DeepSeek-V3-0324",
                messages=messages,
                max_tokens=512,
            )

            # collect multiple replies
            replies = []
            for choice in response.get("choices", []):
                content = (
                    choice.get("message", {}).get("content")
                    or choice.get("content")
                )
                if content:
                    replies.append(content)

            # fallback to single generated_text
            if not replies and "generated_text" in response:
                replies.append(response["generated_text"])

            if not replies:
                return Response({"error": "No reply generated"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({"replies": replies})

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

