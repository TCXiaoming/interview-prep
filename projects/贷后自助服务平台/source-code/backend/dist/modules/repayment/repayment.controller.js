"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const repayment_service_1 = require("./repayment.service");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const repayment_dto_1 = require("./repayment.dto");
let RepaymentController = class RepaymentController {
    constructor(repaymentService) {
        this.repaymentService = repaymentService;
    }
    async getPlan(user) {
        return this.repaymentService.getPlan(user.id);
    }
    async repay(user, dto) {
        return this.repaymentService.repay(user.id, dto.period);
    }
    async getSummary(user) {
        return this.repaymentService.getSummary(user.id);
    }
};
exports.RepaymentController = RepaymentController;
__decorate([
    (0, common_1.Get)('plan'),
    (0, swagger_1.ApiOperation)({ summary: '获取还款计划' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '还款计划列表' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepaymentController.prototype, "getPlan", null);
__decorate([
    (0, common_1.Post)('repay'),
    (0, swagger_1.ApiOperation)({ summary: '还款' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '还款成功' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: '版本冲突（并发修改）' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, repayment_dto_1.RepayDto]),
    __metadata("design:returntype", Promise)
], RepaymentController.prototype, "repay", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: '用户摘要信息' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepaymentController.prototype, "getSummary", null);
exports.RepaymentController = RepaymentController = __decorate([
    (0, swagger_1.ApiTags)('repayment'),
    (0, common_1.Controller)('api/repayment'),
    __metadata("design:paramtypes", [repayment_service_1.RepaymentService])
], RepaymentController);
//# sourceMappingURL=repayment.controller.js.map