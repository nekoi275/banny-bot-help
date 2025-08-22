import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Model,
  User,
  UserData,
  Content,
  UserSettings,
} from "@/utils/types";

const BASEURL =
  "https://a3eqyxqi6gfrg3nhw4v3rl6q4m0gtpqi.lambda-url.eu-west-1.on.aws";

export const useAppStore = defineStore("app", () => {
  // Состояния
  const models = ref<Model[]>([]);
  const user = ref<User>();
  const siteContent = ref<Content>();
  const selectedModel = ref<string | null>(null);
  const userId = ref<number>(301507567); // тестовый юзер
  const imageCost = ref<number>(0);

  // Геттеры
  const modelNames = computed(() => models.value.map((model) => model.name));

  const tabHeaders = computed(() => {
    if (!siteContent.value)
      return ["Profile", "Description", "Models", "Settings"];
    return [
      siteContent.value.menu_main,
      siteContent.value.menu_models,
      siteContent.value.menu_settings,
      siteContent.value.menu_profile,
    ];
  });

  const languages = [
    "🇷🇺 Русский",
    "🇺🇸 English",
    "🇺🇦 Українська",
    "🇧🇾 Беларуская",
    "🇧🇬 Български",
    "🇷🇸 Српски",
    "🇪🇸 Español",
    "🇫🇷 Français",
    "🇮🇹 Italiano",
    "🇵🇹 Português",
    "🇩🇪 Deutsch",
    "🇹🇷 Türkçe",
    "🇷🇴 Română",
    "🇵🇱 Polski",
    "🇬🇷 Νέα Ελληνικά",
    "🇬🇪 ქართული",
    "🇨🇳 中文",
    "🇮🇳 हिन्दी",
    "🇸🇦 العربية",
    "🇧🇩 বাংলা",
    "🇯🇵 日本語",
    "🇰🇷 한국어",
    "🇻🇳 Tiếng Việt",
    "🇹🇭 ไทย",
    "🇲🇲 မြန်မာစာ",
  ];
  const languageCodes = [
    "ru",
    "en",
    "uk",
    "be",
    "bg",
    "sr",
    "es",
    "fr",
    "it",
    "pt",
    "de",
    "tr",
    "ro",
    "pl",
    "el",
    "ka",
    "zh",
    "hi",
    "ar",
    "bn",
    "ja",
    "ko",
    "vi",
    "th",
    "my",
  ];

  const languageObjects = languages.map((lang, index) => ({
    label: lang,
    value: languageCodes[index],
  }));

  const modes = computed(() => {
    if (!siteContent.value) {
      return [
        { label: "Roleplay", value: "RP" },
        { label: "Roleplay and art", value: "RP_ART" },
        { label: "Art", value: "ART" },
      ];
    }
    return [
      { label: siteContent.value.settings_mode_RP, value: "RP" },
      { label: siteContent.value.settings_mode_RPART, value: "RP_ART" },
      { label: siteContent.value.settings_mode_ART, value: "ART" },
    ];
  });

  const resolutions = computed(() => [
    { label: "1:2", value: [768, 1536] },
    { label: "9:16", value: [832, 1472] },
    { label: "2:3", value: [896, 1344] },
    { label: "3:4", value: [960, 1280] },
    { label: "1:1", value: [1024, 1024] },
  ]);

  // Действия
  async function fetchContent(lang: string): Promise<Content> {
    try {
      const response = await fetch(`${BASEURL}/content/${lang}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  }

  async function fetchModels(): Promise<Model[]> {
    try {
      const response = await fetch(`${BASEURL}/models`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  }

  async function fetchUserData(id: number): Promise<UserData> {
    try {
      const response = await fetch(`${BASEURL}/user/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async function fetchInitialData() {
    try {
      const userData = await fetchUserData(userId.value);
      const contentData = await fetchContent(userData.user.lang);

      user.value = userData.user;
      selectedModel.value = user.value.settings.model;
      siteContent.value = contentData;

      const modelsData = await fetchModels();
      models.value = modelsData;
    } catch (error) {
      console.error("Error fetching initial data:", error);
      throw error;
    }
  }

  async function saveSettings(settings: UserSettings, id: number) {
    try {
      const response = await fetch(`${BASEURL}/user/${id}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  }

  async function reset(id: number) {
    try {
      const response = await fetch(`${BASEURL}/user/${id}/reset`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to reset settings");

      user.value = (await fetchUserData(id)).user;
      return true;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async function calculateImageCost(settings: UserSettings) {
    try {
      const response = await fetch(`${BASEURL}/dry_run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      imageCost.value = data.kudos;

      if (!response.ok) throw new Error("Failed to calculate image cost");
      return true;
    } catch (error) {
      console.error("Error calculating image cost", error);
      throw error;
    }
  }

  return {
    // Состояния
    models,
    user,
    siteContent,
    selectedModel,
    userId,
    languageObjects,
    imageCost,

    // Геттеры
    modelNames,
    tabHeaders,
    modes,
    resolutions,

    // Действия
    fetchInitialData,
    saveSettings,
    reset,
    calculateImageCost
  };
});
