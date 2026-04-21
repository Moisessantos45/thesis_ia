import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const useModelStore = defineStore("models", () => {
  const models = ref<string[]>([]);
  const apiKey = ref<string>("");
  const systemPrompt = ref<string>("");
  const question = ref<string>("");
  const isSettingsOpen = ref<boolean>(false);
  const answers = ref<any[]>([]);

  const updateAnswersState = () => {
    answers.value = models.value.map((model, index) => ({
      id: index + 1,
      model: model,
      status: "Esperando",
      text: "El modelo está listo para recibir la consulta.",
    }));
  };

  const fetchModel = async (index: number) => {
    if (index >= models.value.length) return;

    answers.value[index].status = "Generando";
    answers.value[index].text = "";

    try {
      const messagesPayload: any[] = [];
      if (systemPrompt.value.trim()) {
        messagesPayload.push({ role: "system", content: systemPrompt.value });
      }
      messagesPayload.push({ role: "user", content: question.value });

      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: models.value[index],
          stream: true,
          messages: messagesPayload,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey.value}`,
            "Content-Type": "application/json",
          },
          responseType: "stream",
          adapter: "fetch",
        }
      );

      const reader = res.data?.getReader?.();
      if (!reader) throw new Error("Stream no disponible");

      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line.trim() !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              const content = parsed.choices?.[0]?.delta?.content || "";
              answers.value[index].text += content;
            } catch (e) {}
          }
        }
      }

      answers.value[index].status = "Completado";
      if (!answers.value[index].text)
        answers.value[index].text = "Sin respuesta";
    } catch (e: any) {
      const errorMessage = e.response?.data?.error?.message || e.message;
      answers.value[index].text = `Error: ${errorMessage}`;
      answers.value[index].status = "Completado";
    }
  };

  const sendPrompModelOne = async () => {
    await fetchModel(0);
  };

  const sendPrompModelTwo = async () => {
    await fetchModel(1);
  };

  const sendPrompModelThree = async () => {
    await fetchModel(2);
  };

  const sendPromptModelFour = async () => {
    await fetchModel(3);
  };

  const sendPrompModels = async () => {
    if (!question.value.trim() || models.value.length === 0) return;

    answers.value = models.value.map((model, index) => ({
      id: index + 1,
      model: model,
      status: "Generando",
      text: "Iniciando...",
    }));

    const promises = [];
    if (models.value.length > 0) promises.push(sendPrompModelOne());
    if (models.value.length > 1) promises.push(sendPrompModelTwo());
    if (models.value.length > 2) promises.push(sendPrompModelThree());
    if (models.value.length > 3) promises.push(sendPromptModelFour());

    await Promise.allSettled(promises);
  };

  return {
    models,
    apiKey,
    systemPrompt,
    question,
    answers,
    isSettingsOpen,
    updateAnswersState,
    sendPrompModelOne,
    sendPrompModelTwo,
    sendPrompModelThree,
    sendPromptModelFour,
    sendPrompModels,
  };
});

export default useModelStore;
