import { db } from "@/lib/database";
import { MessageContent, ResponseWrapper, VisibleTo } from "@/lib/types";

type SendMessageInput = {
  conversationId: number;
  senderProfileId: string;
  content: MessageContent;
  visibleTo: VisibleTo;
};

export class SendMessageCommand {
  static async execute(
    input: SendMessageInput
  ): Promise<ResponseWrapper<void>> {
    try {
      const { conversationId, senderProfileId, content, visibleTo } = input;

      const [result] = await db
        .insertInto("messages")
        .values({
          conversationId,
          senderProfileId,
          content: JSON.stringify([content]),
          visibleTo,
          isRead: false,
        })
        .execute();

      if (!result) {
        return ResponseWrapper.fail("Failed to insert message");
      }

      return ResponseWrapper.empty();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Message insert error:", error.message);
        return ResponseWrapper.fail(`Failed to send message: ${error.message}`);
      }

      return ResponseWrapper.fail(
        "An unknown error occurred while sending the message"
      );
    }
  }
}
