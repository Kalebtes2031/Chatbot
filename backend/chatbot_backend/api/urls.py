#api/urls.py
from django.urls import path
from .views import ChatBotView, HuggingFaceChatView
from .views import (
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    ConversationDeleteView,
    ConversationClearView,
)

urlpatterns = [
    path("chat/", ChatBotView.as_view(), name="chat"),
    path("chathf/", HuggingFaceChatView.as_view(), name="chathf"),
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/create/", ConversationCreateView.as_view(), name="conversation-create"),
    path("conversations/<int:pk>/", ConversationDetailView.as_view(), name="conversation-detail"),
    path("conversations/<int:pk>/delete/", ConversationDeleteView.as_view(), name="conversation-delete"),
    path("conversations/clear/", ConversationClearView.as_view(), name="conversation-clear"),

]
