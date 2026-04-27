import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Req, RawBodyRequest, HttpCode, HttpStatus,
  BadRequestException, Headers,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingWebhookService } from './billing.webhook';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { Request } from 'express';

@Controller('billing')
@UseGuards(ClerkGuard)
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly webhookService: BillingWebhookService,
  ) {}

  // ── Razorpay Webhook (NO Clerk auth — signature-verified only) ────────────
  // This route MUST be defined BEFORE the UseGuards decorator on the class.

  @Post('webhook')
  @UseGuards() // Explicitly remove guard for this method only
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = (req as any).rawBody as string;
    if (!rawBody) throw new BadRequestException('Missing raw body');

    const isValid = this.webhookService.verifySignature(rawBody, signature);
    if (!isValid) {
      // Return 400 for invalid signatures so Razorpay retries won't pile up
      throw new BadRequestException('Invalid webhook signature');
    }

    const body = JSON.parse(rawBody);
    await this.webhookService.handleEvent(body.event, body.payload);
    return { received: true };
  }

  // ── Authenticated routes ───────────────────────────────────────────────────

  @Get('status')
  @RateLimit({ limit: 60, windowSeconds: 60 })
  async getStatus(@Req() req: Request) {
    const data = await this.billingService.getBillingStatus(req.clerkUserId!);
    return { success: true, data };
  }

  @Post('subscribe')
  @RateLimit({ limit: 10, windowSeconds: 60 })
  async subscribe(@Body() body: { plan: string; cycle: string }, @Req() req: Request) {
    if (!['pro', 'elite'].includes(body.plan)) {
      throw new BadRequestException('Invalid plan. Choose pro or elite.');
    }
    if (!['monthly', 'yearly'].includes(body.cycle)) {
      throw new BadRequestException('Invalid cycle. Choose monthly or yearly.');
    }
    const data = await this.billingService.createSubscription(
      req.clerkUserId!,
      body.plan as any,
      body.cycle as any,
    );
    return { success: true, data };
  }

  @Post('cancel')
  @RateLimit({ limit: 5, windowSeconds: 60 })
  async cancel(
    @Body('atPeriodEnd') atPeriodEnd: boolean,
    @Req() req: Request,
  ) {
    const data = await this.billingService.cancelSubscription(
      req.clerkUserId!,
      atPeriodEnd ?? true,
    );
    return { success: true, data };
  }

  @Post('pause')
  @RateLimit({ limit: 5, windowSeconds: 60 })
  async pause(@Req() req: Request) {
    const data = await this.billingService.pauseSubscription(req.clerkUserId!);
    return { success: true, data };
  }

  @Post('resume')
  @RateLimit({ limit: 5, windowSeconds: 60 })
  async resume(@Req() req: Request) {
    const data = await this.billingService.resumeSubscription(req.clerkUserId!);
    return { success: true, data };
  }

  @Get('invoices')
  @RateLimit({ limit: 60, windowSeconds: 60 })
  async invoices(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.billingService.getInvoiceHistory(
      req.clerkUserId!,
      page ? parseInt(page) : 1,
      limit ? Math.min(parseInt(limit), 50) : 20,
    );
    return { success: true, data };
  }

  @Get('feature-check/:feature')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async featureCheck(@Param('feature') feature: string, @Req() req: Request) {
    const data = await this.billingService.checkFeatureLimit(req.clerkUserId!, feature as any);
    return { success: true, data };
  }
}
