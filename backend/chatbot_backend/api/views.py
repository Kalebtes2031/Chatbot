import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import requests
from rest_framework import status, generics, permissions
from huggingface_hub import InferenceClient
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

openai.api_key = settings.OPENAI_API_KEY


HF_API_KEY = settings.HF_API_KEY
client = InferenceClient(api_key=HF_API_KEY)

def generate_title_from_message(message: str) -> str:
    """Generate a short title from the first user message"""
    if not message:
        return "New Conversation"
    words = message.strip().split()
    title = " ".join(words[:6])  # take first 6 words
    return title + ("..." if len(words) > 6 else "")


class HuggingFaceChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_messages = request.data.get("messages", [])
        conversation_id = request.data.get("conversation_id", None)

        if not user_messages:
            return Response({"error": "No messages provided"}, status=status.HTTP_400_BAD_REQUEST)

        system_msg = {
            "role": "system",
            "content": "You are a professional AI assistant that helps users with code and general questions."
        }

        messages_for_ai = [system_msg]

        # For authenticated users: fetch history or create new conversation
        conversation = None
        if request.user.is_authenticated:
            if conversation_id:
                try:
                    conversation = Conversation.objects.get(id=conversation_id, user=request.user)
                    history = conversation.messages.order_by("created_at")
                    messages_for_ai += [{"role": m.role, "content": m.content} for m in history]
                except Conversation.DoesNotExist:
                    return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                # ✅ Create a new conversation with generated title
                first_user_msg = user_messages[0].get("content", "") if user_messages else ""
                title = generate_title_from_message(first_user_msg)
                conversation = Conversation.objects.create(user=request.user, title=title)

        # Add current user messages
        messages_for_ai += [{"role": m["role"], "content": m["content"]} for m in user_messages]

        try:
            response = client.chat_completion(
                model="deepseek-ai/DeepSeek-V3-0324",
                messages=messages_for_ai,
                max_tokens=512,
            )

            # Collect replies
            replies = []
            for choice in response.get("choices", []):
                content = choice.get("message", {}).get("content") or choice.get("content")
                if content:
                    replies.append(content)

            if not replies and "generated_text" in response:
                replies.append(response["generated_text"])

            if not replies:
                return Response({"error": "No reply generated"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Save messages for authenticated users
            if request.user.is_authenticated and conversation:
                for msg in user_messages:
                    if msg["role"] == "user":
                        Message.objects.create(
                            conversation=conversation,
                            role="user",
                            content=msg["content"]
                        )
                for reply in replies:
                    Message.objects.create(
                        conversation=conversation,
                        role="assistant",
                        content=reply
                    )

            # Return replies and conversation_id for frontend to track
            return Response({
                "replies": replies,
                "conversation_id": conversation.id if conversation else None
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConversationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-created_at')

class ConversationDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

class ConversationCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConversationClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Conversation.objects.filter(user=request.user).delete()
        return Response({"message": "All conversations deleted"}, status=status.HTTP_204_NO_CONTENT)


class ConversationDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

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

