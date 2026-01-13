import { supabase } from '@/lib/supabase';
import { FinancialItem, CategoryType } from '@/contexts/AppContext';

interface ParsedCommand {
  action: 'add' | 'query' | 'unknown';
  category?: CategoryType;
  name?: string;
  institution?: string;
  value?: number;
  query?: string;
}

/**
 * Parse WhatsApp message to extract command
 */
export const parseWhatsAppMessage = (message: string): ParsedCommand => {
  const text = message.toLowerCase().trim();
  
  // Add item patterns
  if (text.includes('הוסף') || text.includes('הוסיף') || text.includes('add')) {
    return parseAddCommand(message);
  }
  
  // Query patterns
  if (text.includes('כמה') || text.includes('מה') || text.includes('מתי') || text.includes('?')) {
    return {
      action: 'query',
      query: message,
    };
  }
  
  return { action: 'unknown' };
};

/**
 * Parse "add" command from message
 */
const parseAddCommand = (message: string): ParsedCommand => {
  const result: ParsedCommand = { action: 'add' };
  
  // Extract category
  if (message.includes('ביטוח') || message.includes('insurance')) {
    result.category = 'insurance';
  } else if (message.includes('פנסיה') || message.includes('קרן') || message.includes('pension')) {
    result.category = 'investments';
  } else if (message.includes('חשבון') || message.includes('בנק') || message.includes('bank')) {
    result.category = 'finance';
  } else if (message.includes('דירה') || message.includes('נכס') || message.includes('property')) {
    result.category = 'assets';
  }
  
  // Extract institution (common Israeli institutions)
  const institutions = ['הראל', 'כלל', 'מגדל', 'הפניקס', 'מיטב', 'לאומי', 'הפועלים', 'דיסקונט', 'מזרחי'];
  for (const inst of institutions) {
    if (message.includes(inst)) {
      result.institution = inst;
      break;
    }
  }
  
  // Extract value (numbers with ₪ or shekel)
  const valueMatch = message.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
  if (valueMatch) {
    result.value = parseFloat(valueMatch[1].replace(/,/g, ''));
  }
  
  // Extract name (everything after "הוסף" or "add")
  const addIndex = Math.max(
    message.indexOf('הוסף'),
    message.indexOf('הוסיף'),
    message.indexOf('add')
  );
  if (addIndex !== -1) {
    const afterAdd = message.substring(addIndex + 4).trim();
    // Remove institution and value from name
    let name = afterAdd;
    if (result.institution) {
      name = name.replace(result.institution, '').trim();
    }
    if (valueMatch) {
      name = name.replace(valueMatch[0], '').trim();
    }
    result.name = name || 'פריט חדש';
  }
  
  return result;
};

/**
 * Create financial item from parsed command
 */
export const createItemFromCommand = async (
  command: ParsedCommand,
  userId: string
): Promise<FinancialItem> => {
  if (command.action !== 'add' || !command.category) {
    throw new Error('Invalid command for creating item');
  }
  
  const item: Omit<FinancialItem, 'id'> = {
    name: command.name || 'פריט חדש',
    institution: command.institution || 'לא צוין',
    productType: 'כללי',
    value: command.value || 0,
    category: command.category,
    status: 'active',
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  
  const { data, error } = await supabase
    .from('financial_items')
    .insert({
      user_id: userId,
      name: item.name,
      institution: item.institution,
      product_type: item.productType,
      value: item.value,
      category: item.category,
      status: item.status,
      last_updated: item.lastUpdated,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    ...item,
  };
};

