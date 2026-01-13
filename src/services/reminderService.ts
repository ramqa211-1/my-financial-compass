import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/greenApi';

interface ReminderItem {
  id: string;
  name: string;
  expiryDate: string | null;
  category: string;
  userId: string;
}

/**
 * Check for items that need renewal reminders
 */
export const checkRenewalReminders = async (daysBefore: number = 14) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + daysBefore);

  // Get financial items with expiry dates
  const { data: items, error } = await supabase
    .from('financial_items')
    .select('id, name, expiry_date, category, user_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .not('expiry_date', 'is', null)
    .lte('expiry_date', reminderDate.toISOString().split('T')[0])
    .gte('expiry_date', today.toISOString().split('T')[0]);

  if (error) {
    console.error('Error checking reminders:', error);
    return;
  }

  return items as ReminderItem[];
};

/**
 * Send reminder via WhatsApp
 */
export const sendReminder = async (
  chatId: string,
  item: ReminderItem
): Promise<void> => {
  const daysUntilExpiry = Math.ceil(
    (new Date(item.expiryDate!).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const categoryNames: Record<string, string> = {
    insurance: 'ביטוח',
    finance: 'כספים',
    investments: 'השקעות',
    assets: 'נכסים',
  };

  const categoryName = categoryNames[item.category] || item.category;
  const message = `🔔 תזכורת: ${item.name} (${categoryName})\n` +
    `תאריך חידוש: ${formatDate(item.expiryDate!)}\n` +
    `נותרו ${daysUntilExpiry} ימים`;

  try {
    await sendWhatsAppMessage(chatId, message);
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
};

/**
 * Send reminders for all items that need renewal
 */
export const sendAllReminders = async (chatId: string) => {
  const reminders = await checkRenewalReminders(14);
  
  if (!reminders || reminders.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const reminder of reminders) {
    try {
      await sendReminder(chatId, reminder);
      sent++;
    } catch (error) {
      console.error(`Failed to send reminder for ${reminder.name}:`, error);
      failed++;
    }
  }

  return { sent, failed };
};

/**
 * Format date for Hebrew display
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

