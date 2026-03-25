import { Application } from "express";
import { config } from "."
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import logger from "./logger";
import { ProxyErrorResponse, ServiceConfig } from "../types/"


class ServiceProxy {
    private static readonly ServiceConfigs: ServiceConfig[] = [
        {
            path: "/api/v1/auth",
            url: config.AUTH_SERVICE_URL,
            pathRewrite: {
                '^/': '/api/v1/auth/'
            },
            name:'auth-service',
            timeout:5000,
            

        },
        {
            path:"/api/v1/account",
            url:config.ACCOUNTS_SERVICE_URL,
            pathRewrite:{
                '^/':'/api/v1/account/'
            },
            name:'account-service',
        },
        {
            path:"/api/v1/transaction",
            url:config.TRANSACTION_SERVICE_URL,
            pathRewrite:{
                '^/':'/api/v1/transaction/'
            },
            name:'transaction-service',
        }
    ];

    private static createProxyOptions(service:ServiceConfig):Options{
        return{
            target:service.url,
            changeOrigin:true,
            pathRewrite:service.pathRewrite,
            timeout:service.timeout,
            logger:logger,
            on:{
                error:ServiceProxy.handleProxyError,
                proxyReq:ServiceProxy.handleProxyRequest,
                proxyRes:ServiceProxy.handleProxyResponse,
            }
        }
    }

    private static handleProxyError(err:Error,req:any,res:any){
        logger.error(`Proxy error: ${err.message}`);
        const errorResponse:ProxyErrorResponse={
          
            message:'Service unavailable',
            status:503,
            timestamp:new Date().toISOString(),
        }

        res.status(500).setHeader('Content-type','application/json')
        .end(JSON.stringify(errorResponse));
       
    }

    private static handleProxyRequest(proxyReq:any,req:any,res:any){
        logger.debug(`Proxying request to ${req.url}`);
    }

    private static handleProxyResponse(proxyRes:any,req:any,res:any){
        logger.debug(`Proxying response from ${req.url}`);
    }

    public static setupProxy(app:Application){
        ServiceProxy.ServiceConfigs.forEach((service)=>{
            const proxyOptions=ServiceProxy.createProxyOptions(service);
            app.use(service.path,createProxyMiddleware(proxyOptions));
            logger.info(`Configured setup for ${service.name} at ${service.path}`);
        })
    }
}


export const proxyServices=(app:Application):void=>{
    ServiceProxy.setupProxy(app);
}
