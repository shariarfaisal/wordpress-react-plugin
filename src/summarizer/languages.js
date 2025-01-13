import { useState } from "react";
import { useSummarizer } from "./useSummarizer";

const languages = [
  {
    code: "en-US",
    short_code: "EN",
    name: "English",
  },
  {
    code: "es-ES",
    short_code: "ES",
    name: "Español",
  },
  {
    code: "zh-HK",
    short_code: "HK",
    name: "中文",
  },
  {
    code: "zh-TW",
    short_code: "TW",
    name: "中文 (台灣)",
  },
  {
    code: "zh-CN",
    short_code: "CN",
    name: "中文 (中国)",
  },
  {
    code: "hi-IN",
    short_code: "HI",
    name: "हिन्दी",
  },
  {
    code: "bn-BD",
    short_code: "BN",
    name: "বাংলা",
  },
  {
    code: "fr-FR",
    short_code: "FR",
    name: "Français",
  },
  {
    code: "it-IT",
    short_code: "IT",
    name: "Italiana",
  },
  {
    code: "de-DE",
    short_code: "DE",
    name: "Deutsch",
  },
  {
    code: "jv-ID",
    short_code: "JV",
    name: "Basa Jawa",
  },
  {
    code: "pl-PL",
    short_code: "PL",
    name: "Polski",
  },
  {
    code: "uk-UA",
    short_code: "UK",
    name: "Українська",
  },
  {
    code: "ko-KR",
    short_code: "KO",
    name: "한국어",
  },
  {
    code: "ja-JP",
    short_code: "JA",
    name: "日本語",
  },
  {
    code: "pt-PT",
    short_code: "PT",
    name: "Português",
  },
  {
    code: "ru-RU",
    short_code: "RU",
    name: "Русский",
  },
  {
    code: "ar-SA",
    short_code: "AR",
    name: "العربية",
  },
  {
    code: "vi-VN",
    short_code: "VI",
    name: "Tiếng Việt",
  },
  {
    code: "ta-IN",
    short_code: "TA",
    name: "தமிழ்",
  },
  {
    code: "tr-TR",
    short_code: "TR",
    name: "Türkçe",
  },
  {
    code: "ur-PK",
    short_code: "UR",
    name: "اردو",
  },
  {
    code: "gu-IN",
    short_code: "GU",
    name: "ગુજરાતી",
  },
  {
    code: "ro-RO",
    short_code: "RO",
    name: "Română",
  },
  {
    code: "bg-BG",
    short_code: "BG",
    name: "Български",
  },
  {
    code: "cs-CZ",
    short_code: "CS",
    name: "Čeština",
  },
  {
    code: "da-DK",
    short_code: "DA",
    name: "Dansk",
  },
  {
    code: "el-GR",
    short_code: "EL",
    name: "Ελληνικά",
  },
  {
    code: "et-EE",
    short_code: "ET",
    name: "Eesti",
  },
  {
    code: "fi-FI",
    short_code: "FI",
    name: "Suomi",
  },
  {
    code: "he-IL",
    short_code: "HE",
    name: "עברית",
  },
  {
    code: "hu-HU",
    short_code: "HU",
    name: "Magyar",
  },
  {
    code: "id-ID",
    short_code: "ID",
    name: "Indonesia",
  },
  {
    code: "lt-LT",
    short_code: "LT",
    name: "Lietuvių",
  },
  {
    code: "lv-LV",
    short_code: "LV",
    name: "Latviešu",
  },
  {
    code: "ms-MY",
    short_code: "MS",
    name: "Bahasa Melayu",
  },
  {
    code: "nb-NO",
    short_code: "NB",
    name: "Norsk",
  },
  {
    code: "nl-NL",
    short_code: "NL",
    name: "Nederlands",
  },
  {
    code: "sk-SK",
    short_code: "SK",
    name: "Slovenčina",
  },
  {
    code: "sl-SI",
    short_code: "SL",
    name: "Slovenščina",
  },
  {
    code: "sv-SE",
    short_code: "SV",
    name: "Svenska",
  },
  {
    code: "th-TH",
    short_code: "TH",
    name: "ไทย",
  },
  {
    code: "fil-PH",
    short_code: "fil",
    name: "Filipino",
  },
  {
    code: "zu-ZA",
    short_code: "ZU",
    name: "isiZulu",
  },
];

export default function Languages() {
  const [lang, setLang] = useState("en-US");
  const { setLimitOpen } = useSummarizer();
  return (
    <select
      value={lang}
      onChange={(e) => {
        setLang(e.target.value);
        setLimitOpen(true);
      }}
      className="flex items-center gap-2 text-sm font-medium border px-2 h-8 outline-none focus:outline-note rounded hover:bg-gray-100 transitions-colors max-w-[110px] cursor-pointer"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
