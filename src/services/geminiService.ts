import { GoogleGenAI } from "@google/genai";

// process.env.GEMINI_API_KEY is defined in vite.config.ts
const apiKey = process.env.GEMINI_API_KEY;

export const generateTravelPlan = async (params: {
  budget: number;
  days: number;
  preference: string;
  destination?: string;
  startCity?: string;
}) => {
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash"; 
  
  const prompt = `你是一个专业的旅游规划师。请根据以下要求规划一次旅行：
  - 起点城市：${params.startCity || "未指定（请根据目的地推荐合理的起点或假设从主要城市出发）"}
  - 目的地：${params.destination ? params.destination : "请根据预算和偏好推荐一个合适的目的地"}
  - 预算：${params.budget} 元人民币 (这是总预算，必须包含从起点到目的地的往返交通、当地交通、住宿、餐饮和门票)
  - 天数：${params.days} 天
  - 偏好：${params.preference}

  要求：
  1. **详细行程**：提供每日详细行程，包括上午、下午和晚上的活动。
  2. **实时价格**：利用搜索功能获取最新的交通（机票/高铁）、酒店和景点门票价格。
  3. **酒店预算 (重点)**：必须明确计算并列出每晚的酒店住宿预算。请推荐具体的酒店或住宿区域，并说明预估价格。
  4. **预算拆解**：给出总预算的详细分类拆解（例如：往返交通 25%，当地交通 5%，住宿 35%，餐饮 25%，门票/其他 10%），并确保总额在 ${params.budget} 元以内。
  5. **具体推荐**：推荐具体的餐厅（包含特色菜）和景点。
  6. **地图链接 (非常重要)**：
     - **禁止**生成短链接（如 maps.app.goo.gl），因为它们极易失效。
     - 请使用标准的 Google Maps 搜索链接格式：\`https://www.google.com/maps/search/?api=1&query=地点名称+城市\`。
     - 确保链接文本清晰，例如：[查看 地点名称 的地图](https://www.google.com/maps/search/?api=1&query=地点名称+城市)。
  7. **实用建议**：包含当地交通建议、天气提醒和必备物品。
  
  请使用 Markdown 格式输出，排版要精美，使用表格来展示预算拆解。`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
    },
  });

  return {
    text: response.text,
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};
