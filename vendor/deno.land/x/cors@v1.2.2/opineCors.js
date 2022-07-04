"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.opineCors = void 0;
var cors_ts_1 = require("./cors.ts");
var opineCors = function (o) {
    var corsOptionsDelegate = cors_ts_1.Cors.produceCorsOptionsDelegate(o);
    return (function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
        var options, corsOptions, originDelegate, requestMethod, getRequestHeader, getResponseHeader, setResponseHeader, setStatus, end, origin_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4, corsOptionsDelegate(request)];
                case 1:
                    options = _a.sent();
                    corsOptions = cors_ts_1.Cors.produceCorsOptions(options || {});
                    originDelegate = cors_ts_1.Cors.produceOriginDelegate(corsOptions);
                    if (!originDelegate) return [3, 3];
                    requestMethod = request.method;
                    getRequestHeader = function (headerKey) {
                        return request.headers.get(headerKey);
                    };
                    getResponseHeader = function (headerKey) {
                        return response.get(headerKey);
                    };
                    setResponseHeader = function (headerKey, headerValue) {
                        return response.set(headerKey, headerValue);
                    };
                    setStatus = function (statusCode) {
                        return response.setStatus(statusCode);
                    };
                    end = function () { return response.end(); };
                    return [4, originDelegate(getRequestHeader("origin"))];
                case 2:
                    origin_1 = _a.sent();
                    if (!origin_1)
                        return [2, next()];
                    else {
                        corsOptions.origin = origin_1;
                        return [2, new cors_ts_1.Cors({
                                corsOptions: corsOptions,
                                requestMethod: requestMethod,
                                getRequestHeader: getRequestHeader,
                                getResponseHeader: getResponseHeader,
                                setResponseHeader: setResponseHeader,
                                setStatus: setStatus,
                                next: next,
                                end: end
                            }).configureHeaders()];
                    }
                    _a.label = 3;
                case 3: return [3, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3, 5];
                case 5: return [2, next()];
            }
        });
    }); });
};
exports.opineCors = opineCors;