#api/urls.py
from django.urls import path
from .views import ChatBotView, HuggingFaceChatView

urlpatterns = [
    path("chat/", ChatBotView.as_view(), name="chat"),
    path("chathf/", HuggingFaceChatView.as_view(), name="chathf"),
]
