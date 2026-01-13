import { Request, Response } from 'express';
import { WhatsAppMessage } from '@/lib/greenApi';
import { parseWhatsAppMessage, createItemFromCommand } from '@/services/whatsappParser';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/greenApi';

/**
 * Webhook handler for incoming WhatsApp messages
 * This should be set up as a Supabase Edge Function or Express endpoint
 */
export const handleWhatsAppWebhook = async (req: Request, res: Response) => {
  try {
    const message: WhatsAppMessage = req.body;
    
    // Only process incoming messages
    if (message.type !== 'incoming' || !message.textMessage) {
      return res.status(200).json({ success: true });
    }
    
    const chatId = message.chatId;
    const text = message.textMessage;
    
    // Parse the message
    const command = parseWhatsAppMessage(text);
    
    if (command.action === 'add') {
      // Find user by phone number (chatId might be phone number)
      // In production, you'd have a mapping table between phone numbers and user IDs
      const phoneNumber = chatId.replace('@c.us', '');
      
      // For now, we'll need to get the user ID from a mapping
      // This is a simplified version - in production, create a user_whatsapp table
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.find(u => 
        u.phone === phoneNumber || 
        u.user_metadata?.phone === phoneNumber
      );
      
      if (!user) {
        await sendWhatsAppMessage(
          chatId,
          '❌ לא נמצא משתמש מקושר למספר זה. אנא התחבר למערכת תחילה.'
        );
        return res.status(200).json({ success: true });
      }
      
      try {
        const item = await createItemFromCommand(command, user.id);
        
        await sendWhatsAppMessage(
          chatId,
          `✅ נוסף בהצלחה!\n` +
          `שם: ${item.name}\n` +
          `מוסד: ${item.institution}\n` +
          `קטגוריה: ${item.category}\n` +
          `ערך: ₪${item.value.toLocaleString()}`
        );
      } catch (error: any) {
        await sendWhatsAppMessage(
          chatId,
          `❌ שגיאה בהוספת הפריט: ${error.message}`
        );
      }
    } else if (command.action === 'query') {
      // Handle queries - this would use the AI chat functionality
      await sendWhatsAppMessage(
        chatId,
        '🔍 שאילתות זמינות דרך הצ\'אט החכם באפליקציה. אנא היכנס לאפליקציה לשאילתות מורכבות יותר.'
      );
    } else {
      await sendWhatsAppMessage(
        chatId,
        '👋 שלום! אני יכול לעזור לך:\n' +
        '• הוסף ביטוח/פריט - "הוסף ביטוח רכב הראל 5000"\n' +
        '• שאלות - השתמש באפליקציה לצ\'אט חכם'
      );
    }
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error handling WhatsApp webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

