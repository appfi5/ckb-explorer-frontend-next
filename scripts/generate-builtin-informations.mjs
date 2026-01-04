import { generateScripts } from "./generate-builtin-informations/generateScripts.mjs"
import { generateUDTInfos } from "./generate-builtin-informations/generateUDT.mjs"



(async function main() {
  generateScripts();
  generateUDTInfos();
})()