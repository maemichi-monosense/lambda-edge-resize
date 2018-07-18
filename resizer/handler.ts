import { S3 } from 'aws-sdk';
import {
    Callback,
    CloudFrontResponse,
    CloudFrontResponseEvent,
    CloudFrontResultResponse,
    Context,
    Handler
} from 'aws-lambda';

import * as querystring from "querystring";
import { isArray } from "util";

import { resize } from "./resize";

interface Query {
    width: number, // w
    height: number, // h
    webp?: boolean
}

// 型合わせ
const resultResponse = (response: CloudFrontResponse): CloudFrontResultResponse =>
    response;

export const originResponse: Handler = (event: CloudFrontResponseEvent, context: Context, cb: Callback) => {
    const {request, response} = event.Records[0].cf;
    const result = resultResponse(response);
    const uri = request.uri;

    // guard: check extension
    const ext = uri.split('.', 2)[1];
    if (!ext.match(/jpe?g/)) {
        // response original
        cb(null, response);
        return;
    }
    // guard: origin status
    switch (response.status) {
        case ('200'):
            // keep going
            break;
        case ('404'):
            // response not found
            result.status = '404';
            result.headers['content-type'] = [{key: 'Content-Type', value: 'text/plain'}];
            result.body = `${request.uri} is not found.`;
            cb(null, result);
            return;
        case ('304'):
        default:
            // response original
            cb(null, response);
            return;
    }

    const {width, height, webp} = parseQuery(request.querystring);
    console.log({width, height, webp});

    /**
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#lambda-event-structure-request
     */
    const hostname = request.headers.host[0].value;
    console.log({hostname, uri, headers: request.headers});

    const s3 = new S3();
    s3.getObject({
        Bucket: hostname,
        Key: uri.slice(1), // remove first `/`
    }).promise()
        .then(data => data.Body)
        .then(buffer => resize(width, height, webp)(buffer))
        .then(buffer => {
            // response resized image
            const encoding = 'base64';
            result.body = buffer.toString(encoding);
            result.bodyEncoding = encoding;
            cb(null, result);
        })
        .catch(e => {
            // response any error
            result.status = '403';
            result.headers['content-type'] = [{key: 'Content-Type', value: 'text/plain'}];
            result.body = e.toString();
            console.error(e);
            cb(null, result);
        });
};

const parseQuery = (str: string): Query => {
    const value = (str?: string | string[]): string =>
        isArray(str) ? str[0] : str;
    const guard = (n?: number): number => {
        if (!(isFinite(n) && (n > 0))) {
            throw Error('not a positive number')
        }
        return n;
    };
    const parseNum = str => guard(parseInt(value(str)));

    const query = querystring.parse(str);

    return {
        width: parseNum(query.w),
        height: parseNum(query.h),
        webp: Boolean(query.webp)
    };
};
