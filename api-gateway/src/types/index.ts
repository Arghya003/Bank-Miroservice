import { NextFunction,Request,Response } from "express";

export interface ServiceConfig{
    path:string;
    url:string;
    pathRewrite:Record<string,string>;
    name:string;
    timeout?:number;
    
}


export interface ProxyErrorResponse{
    status:number;
    message:string;
    timestamp:string;
}