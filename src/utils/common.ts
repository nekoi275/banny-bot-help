import content from '../data/content.json'

export enum ContentKey {
  General = "general",
  Models = "models",
  LORAS = "loras",
  Header = "header",
  Content = "content",
  Copied = "copied",
  Type = "type"
}

export function getText(...args: string[]) {
  let lang: keyof typeof content | undefined = window.Telegram.WebApp.initDataUnsafe.user?.language_code
  if ((!lang) || !(lang in content)) {
    lang = 'en'
  }
  let result: any = content[lang]
  for (let i in args) {
    result = result[args[i] as keyof typeof result]
  }
  return result
}