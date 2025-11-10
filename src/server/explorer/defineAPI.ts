/**
* 
*/
import defineAPIHOC from "../utils";
import interceptors from "./interceptors";
import { env } from "@/env";
// defineAPIHOC 第一个参数为请求方法的公共前缀
const defineAPI = defineAPIHOC(`${env.NEXT_PUBLIC_EXPLORER_SERVICE_URL!}/api/v1`, interceptors);
export default defineAPI;
