import { createClient } from "@/lib/pocket-base";
import { RecordSubscription, UnsubscribeFunc } from "pocketbase";

// PocketBase API Response Type
interface ConversationResponse {
  id: string;
  message: string;
  expand: {
    from: {
      id: string;
      name: string;
    };
    to: {
      id: string;
      name: string;
    };
  };
  created: string;
}

// Internal Model Type
interface ConversationModel {
  id: string;
  message: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  createdAt: Date;
}

let subscription: UnsubscribeFunc | null = null;

export class MessagesRepository {
  /**
   * Subscribe to message updates
   */
  static async subscribeToMessages(
    callback: (data: RecordSubscription<ConversationModel>) => void
  ) {
    const pb = await createClient();

    subscription = await pb
      .collection("messages")
      .subscribe<ConversationResponse>("*", (data) => {
        const mappedData = MessagesRepository.mapResponseToModel(data.record);
        console.log("Received new message:", mappedData);
        callback({ ...data, record: mappedData });
      });
  }

  /**
   * Get grouped conversations
   */
  static async getConversations() {
    const pb = await createClient();

    const initialMessages = await pb
      .collection("messages")
      .getFullList<ConversationResponse>({
        sort: "-created",
        expand: "from, to",
        fields:
          "message, expand.from.id, expand.from.name, expand.to.id, expand.to.name, created",
      });

    // Group messages by `toId`
    const groupedConversations = initialMessages.reduce(
      (
        acc: Record<
          string,
          { toId: string; toName: string; messages: ConversationModel[] }
        >,
        message
      ) => {
        const mappedMessage = MessagesRepository.mapResponseToModel(message);
        const toId = mappedMessage.toId;
        const toName = mappedMessage.toName;

        if (!acc[toId]) {
          acc[toId] = {
            toId,
            toName,
            messages: [],
          };
        }
        acc[toId].messages.push(mappedMessage);
        return acc;
      },
      {}
    );

    return Object.values(groupedConversations);
  }

  /**
   * Unsubscribe from message updates
   */
  static unsubscribeFromMessages() {
    if (subscription) {
      subscription();
      subscription = null;
      console.log("Unsubscribed from messages.");
    }
  }

  /**
   * Create a new message
   */
  static async createMessage(message: string, toUserId: string) {
    const pb = await createClient();

    if (!pb.authStore.model?.id) {
      console.error("User not authenticated. Cannot send message.");
      return;
    }

    await pb.collection("messages").create({
      message,
      from: pb.authStore.model.id,
      to: toUserId,
    });

    console.log("Message sent from", pb.authStore.model.id, "to", toUserId);
  }

  /**
   * Map PocketBase API response to internal model
   */
  private static mapResponseToModel(
    response: ConversationResponse
  ): ConversationModel {
    return {
      id: response.id,
      message: response.message,
      fromId: response.expand.from.id,
      fromName: response.expand.from.name,
      toId: response.expand.to.id,
      toName: response.expand.to.name,
      createdAt: new Date(response.created),
    };
  }
}
