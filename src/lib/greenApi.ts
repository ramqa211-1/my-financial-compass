const GREEN_API_BASE_URL = 'https://api.green-api.com';

interface GreenApiConfig {
  instanceId: string;
  token: string;
}

let config: GreenApiConfig | null = null;

export const initGreenApi = (instanceId: string, token: string) => {
  config = { instanceId, token };
};

const getConfig = () => {
  if (!config) {
    const instanceId = import.meta.env.VITE_GREEN_API_INSTANCE_ID;
    const token = import.meta.env.VITE_GREEN_API_TOKEN;
    
    if (!instanceId || !token) {
      throw new Error('GREEN API credentials not configured');
    }
    
    config = { instanceId, token };
  }
  
  return config;
};

export interface WhatsAppMessage {
  type: 'incoming' | 'outgoing';
  timestamp: number;
  idMessage: string;
  typeMessage: string;
  chatId: string;
  senderId?: string;
  senderName?: string;
  textMessage?: string;
  extendedTextMessage?: {
    text: string;
  };
}

export interface SendMessageResponse {
  idMessage: string;
}

/**
 * Send a text message via WhatsApp
 */
export const sendWhatsAppMessage = async (
  chatId: string,
  message: string
): Promise<SendMessageResponse> => {
  const { instanceId, token } = getConfig();
  
  const response = await fetch(
    `${GREEN_API_BASE_URL}/waInstance${instanceId}/sendMessage/${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send message: ${error}`);
  }

  return response.json();
};

/**
 * Get incoming messages
 */
export const getIncomingMessages = async (): Promise<WhatsAppMessage[]> => {
  const { instanceId, token } = getConfig();
  
  const response = await fetch(
    `${GREEN_API_BASE_URL}/waInstance${instanceId}/receiveNotification/${token}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      // No new messages
      return [];
    }
    const error = await response.text();
    throw new Error(`Failed to get messages: ${error}`);
  }

  const data = await response.json();
  
  // Delete notification after receiving
  if (data.receiptId) {
    await deleteNotification(data.receiptId);
  }
  
  return data.body ? [data.body] : [];
};

/**
 * Delete notification after processing
 */
const deleteNotification = async (receiptId: number) => {
  const { instanceId, token } = getConfig();
  
  await fetch(
    `${GREEN_API_BASE_URL}/waInstance${instanceId}/deleteNotification/${token}/${receiptId}`,
    {
      method: 'DELETE',
    }
  );
};

/**
 * Get account state
 */
export const getAccountState = async (): Promise<{
  stateInstance: string;
}> => {
  const { instanceId, token } = getConfig();
  
  const response = await fetch(
    `${GREEN_API_BASE_URL}/waInstance${instanceId}/getStateInstance/${token}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get account state: ${error}`);
  }

  return response.json();
};

