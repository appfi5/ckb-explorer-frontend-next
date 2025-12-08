/**
* 
*/
import defineAPIHOC from "../utils";
import interceptors from "./interceptors";
import { env } from "@/env";
const isDevelop = process.env.NODE_ENV === "development";
// defineAPIHOC 第一个参数为请求方法的公共前缀
const defineAPI = defineAPIHOC(`${ isDevelop ? "" : env.NEXT_PUBLIC_EXPLORER_SERVICE_URL!}/api/v1`, interceptors);
export default defineAPI;
