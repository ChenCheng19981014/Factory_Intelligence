import axios from "@/lib/axios";

/**
 * 
 */
export const getChangquData = (params) => {
  return axios.request({
    url: "/dh/Message/getFactoryOutput",
    method: "get",
    params
  });
};